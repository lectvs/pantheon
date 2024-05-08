/// <reference path="../../worldObject/worldObject.ts"/>

namespace SpriteTextDisplay {
    export type Config = WorldObject.Config<SpriteTextDisplay2> & {
        text?: string;
        spacingDx?: number;
        spacingDy?: number;
        spriteTextConfig?: SpriteText.Config<SpriteText>;
    }
}

class SpriteTextDisplay2 extends WorldObject {
    private spriteTexts: SpriteText[];

    constructor(config: SpriteTextDisplay.Config) {
        super(config);

        let spriteTextConfig = config.spriteTextConfig ?? {};
        let spriteTextFont = AssetCache.getFont(spriteTextConfig.font ?? SpriteText.DEFAULT_FONT);

        let scaleX = spriteTextConfig.scaleX ?? (spriteTextConfig.scale ?? 1);
        let scaleY = spriteTextConfig.scaleY ?? (spriteTextConfig.scale ?? 1);
        let spacingDx = config.spacingDx ?? (spriteTextFont?.charWidth ?? 8);
        let spacingDy = config.spacingDy ?? (spriteTextFont?.charHeight ?? 15);

        let styledChars = SpriteTextUtils.splitIntoStyledChars(config.text ?? '');

        this.spriteTexts = this.addChildren(styledChars.map((line, j) => line.map((styledChar, i) => new SpriteText({
            justify: 'center',
            anchor: Anchor.CENTER,
            ...spriteTextConfig,
            x: M.equidistantLine(0, spacingDx * scaleX, line.length, i),
            y: M.equidistantLine(0, spacingDy * scaleY, styledChars.length, j),
            text: styledChar,
            visible: false,
        }))).flat());
    }

    enterFade(duration: number) {
        let std = this;
        return this.runScript(function*() {
            yield std.spriteTexts.map(st => {
                let finalAlpha = st.alpha;
                st.alpha = 0;
                st.setVisible(true);
                return S.tween(duration, st, 'alpha', 0, finalAlpha);
            });
        });
    }

    exitFade(duration: number) {
        let std = this;
        return this.runScript(function*() {
            yield std.spriteTexts.map(st => {
                return S.tween(duration, st, 'alpha', st.alpha, 0);
            });
            std.kill();
        });
    }

    enterScatter(duration: number, scatterDistance: number) {
        let std = this;
        return this.runScript(function*() {
            yield std.spriteTexts.map(st => {
                let finalAlpha = st.alpha;
                st.alpha = 0;
                let d = Random.inCircle(scatterDistance);
                st.setVisible(true);
                return S.simul(
                    S.tween(duration, st, 'x', st.x + d.x, st.x),
                    S.tween(duration, st, 'y', st.y + d.y, st.y),
                    S.tween(duration, st, 'alpha', 0, finalAlpha),
                );
            });
        });
    }

    exitScatter(duration: number, scatterDistance: number) {
        let std = this;
        return this.runScript(function*() {
            yield std.spriteTexts.map(st => {
                let d = Random.inCircle(scatterDistance);
                return S.simul(
                    S.tween(duration, st, 'x', st.x + d.x, st.x),
                    S.tween(duration, st, 'y', st.y + d.y, st.y),
                    S.tween(duration, st, 'alpha', st.alpha, 0),
                );
            });
            std.kill();
        });
    }

    forEach(callback: (spriteText: SpriteText, i: number, spriteTexts: SpriteText[]) => void) {
        this.spriteTexts.forEach((s, i, ss) => callback(s, i, ss));
    }
}

abstract class SpriteTextDisplay extends WorldObject {
    abstract enter(duration: number): Script;
    abstract exit(duration: number): Script;
    abstract forEach(callback: (spriteText: SpriteText) => void): void;
}

namespace SpriteTextDisplay {
    export class Alpha extends SpriteTextDisplay {
        private spriteText: SpriteText;
        displayedAlpha: number;

        constructor(config: SpriteTextDisplay.Config) {
            super(config);

            let spriteTextConfig = config.spriteTextConfig ?? {};

            this.displayedAlpha = spriteTextConfig.alpha ?? 1;

            this.spriteText = this.addChild(new SpriteText({
                justify: 'center',
                anchor: Anchor.CENTER,
                ...spriteTextConfig,
                text: config.text,
                alpha: 0,
            }));
        }

        override enter(duration: number) {
            let std = this;
            return this.runScript(function*() {
                yield S.tween(duration, std.spriteText, 'alpha', 0, std.displayedAlpha);
            });
        }

        override exit(duration: number) {
            let std = this;
            return this.runScript(function*() {
                yield S.tween(duration, std.spriteText, 'alpha', std.spriteText.alpha, 0);
                std.kill();
            });
        }

        override forEach(callback: (spriteText: SpriteText) => void): void {
            callback(this.spriteText);
        }
    }

    export class Scatter extends SpriteTextDisplay {
        private spriteTexts: SpriteText[];
        displayedAlpha: number;
        scatterDistance: number;

        constructor(config: SpriteTextDisplay.Config & { scatterDistance?: number }) {
            super(config);


            let spriteTextConfig = config.spriteTextConfig ?? {};

            this.displayedAlpha = spriteTextConfig.alpha ?? 1;
            this.scatterDistance = config.scatterDistance ?? 0;

            let text = config.text ?? '';
            let lines = text.split('\n');
            this.spriteTexts = this.addChildren(lines.map((line, j) => A.chars(line).map((char, i) => new SpriteText({
                justify: 'center',
                anchor: Anchor.CENTER,
                ...spriteTextConfig,
                x: M.equidistantLine(0, 10, line.length, i),
                y: M.equidistantLine(0, 16, lines.length, j),
                text: char,
                alpha: 0,
            }))).flat());
        }

        override enter(duration: number): Script {
            let std = this;
            return this.runScript(function*() {
                let d = Random.inCircle(std.scatterDistance);
                yield std.spriteTexts.map(char => S.simul(
                    S.tween(duration, char, 'x', char.x + d.x, char.x),
                    S.tween(duration, char, 'y', char.y + d.y, char.y),
                    S.tween(duration, char, 'alpha', 0, std.displayedAlpha),
                ));
            });
        }

        override exit(duration: number): Script {
            let std = this;
            return this.runScript(function*() {
                let d = Random.inCircle(std.scatterDistance);
                yield std.spriteTexts.map(char => S.simul(
                    S.tween(duration, char, 'x', char.x, char.x + d.x),
                    S.tween(duration, char, 'y', char.y, char.y + d.y),
                    S.tween(duration, char, 'alpha', char.alpha, 0),
                ));
            });
        }

        override forEach(callback: (spriteText: SpriteText) => void): void {
            this.spriteTexts.forEach(t => callback(t));
        }
    }
}