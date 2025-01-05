/// <reference path="../../worldObject/worldObject.ts"/>

namespace SpriteTextDisplay {
    export type Config = WorldObject.Config<SpriteTextDisplay> & {
        text?: string;
        spacingDx?: number;
        spacingDy?: number;
        anchor?: Vector2;
        spriteTextConfig?: OrFactory<SpriteText.Config<SpriteText>>;
        /**
         * @default false
         */
        startEntered?: boolean;
        wavy?: {
            amplitude: number;
            cyclesPerSecond: number;
        };
    }
}

class SpriteTextDisplay extends WorldObject {
    spriteTexts: SpriteText[];

    constructor(config: SpriteTextDisplay.Config) {
        super(config);

        let styledChars = SpriteTextUtils.splitIntoStyledChars(config.text ?? '');

        this.spriteTexts = this.addChildren(styledChars.map((line, j) => line.map((styledChar, i) => {
            let spriteTextConfig = config.spriteTextConfig ? OrFactory.resolve(config.spriteTextConfig) : {};
            let spriteTextFont = AssetCache.getFont(spriteTextConfig.font ?? SpriteText.DEFAULT_FONT);
            let charWidth = spriteTextFont?.charWidth ?? 8;
            let charHeight = spriteTextFont?.charHeight ?? 15;
            let spaceBetweenLines = spriteTextConfig.spaceBetweenLines ?? spriteTextFont?.spaceBetweenLines ?? 0;
    
            let scaleX = spriteTextConfig.scaleX ?? (spriteTextConfig.scale ?? 1);
            let scaleY = spriteTextConfig.scaleY ?? (spriteTextConfig.scale ?? 1);
            let spacingDx = config.spacingDx ?? charWidth;
            let spacingDy = config.spacingDy ?? (charHeight + spaceBetweenLines);
            let anchor = config.anchor ?? Anchor.CENTER;
    
            let startEntered = config.startEntered ?? false;

            return new SpriteText({
                ...spriteTextConfig,
                x: M.equidistantLine(0, spacingDx * scaleX, line.length, i) - (anchor.x - 0.5) * spacingDx * scaleX,
                y: M.equidistantLine(0, spacingDy * scaleY, styledChars.length, j) - (anchor.y - 0.5) * spacingDy * scaleY,
                text: styledChar,
                copyFromParent: ['layer'],
                visible: startEntered,
            })
        })).flat());

        if (config.wavy) {
            this.makeWavy(config.wavy.amplitude, config.wavy.cyclesPerSecond);
        }
    }

    enterInstant() {
        this.spriteTexts.forEach(st => st.setVisible(true));
    }

    exitInstant() {
        this.kill();
    }

    enterFade(duration: number) {
        let std = this;
        return this.runScript(function*() {
            yield std.spriteTexts.map(st => {
                let finalAlpha = st.alpha;
                st.alpha = 0;
                std.setVisible(true);
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
                std.setVisible(true);
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

    enterType(duration: number) {
        let std = this;
        return this.runScript(function*() {
            let timePerChar = duration / std.spriteTexts.length;
            std.setVisible(true);
            for (let st of std.spriteTexts) {
                st.setVisible(true);
                yield timePerChar;
            }
        });
    }

    exitType(duration: number) {
        let std = this;
        return this.runScript(function*() {
            let timePerChar = duration / std.spriteTexts.length;
            for (let i = std.spriteTexts.length-1; i >= 0; i--) {
                std.spriteTexts[i].setVisible(false);
                yield timePerChar;
            }
            std.kill();
        });
    }

    forEach(callback: (spriteText: SpriteText, i: number, spriteTexts: SpriteText[]) => void) {
        this.spriteTexts.forEach((s, i, ss) => callback(s, i, ss));
    }

    makeWavy(amplitude: number, cyclesPerSecond: number) {
        this.spriteTexts.forEach((s, i) => {
            s.addHook('onUpdate', function() {
                this.offsetY = M.lerp(Tween.Easing.OscillateSine(cyclesPerSecond)(this.life.time + i/10), -amplitude, amplitude);
            });
        });
        return this;
    }
}
