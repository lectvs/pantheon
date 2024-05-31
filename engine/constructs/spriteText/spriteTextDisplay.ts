/// <reference path="../../worldObject/worldObject.ts"/>

namespace SpriteTextDisplay {
    export type Config = WorldObject.Config<SpriteTextDisplay> & {
        text?: string;
        spacingDx?: number;
        spacingDy?: number;
        spriteTextConfig?: SpriteText.Config<SpriteText>;
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
    private spriteTexts: SpriteText[];

    constructor(config: SpriteTextDisplay.Config) {
        super(config);

        let spriteTextConfig = config.spriteTextConfig ?? {};
        let spriteTextFont = AssetCache.getFont(spriteTextConfig.font ?? SpriteText.DEFAULT_FONT);

        let scaleX = spriteTextConfig.scaleX ?? (spriteTextConfig.scale ?? 1);
        let scaleY = spriteTextConfig.scaleY ?? (spriteTextConfig.scale ?? 1);
        let spacingDx = config.spacingDx ?? (spriteTextFont?.charWidth ?? 8);
        let spacingDy = config.spacingDy ?? (spriteTextFont?.charHeight ?? 15);

        let startEntered = config.startEntered ?? false;

        let styledChars = SpriteTextUtils.splitIntoStyledChars(config.text ?? '');

        this.spriteTexts = this.addChildren(styledChars.map((line, j) => line.map((styledChar, i) => new SpriteText({
            justify: 'center',
            anchor: Anchor.CENTER,
            ...spriteTextConfig,
            x: M.equidistantLine(0, spacingDx * scaleX, line.length, i),
            y: M.equidistantLine(0, spacingDy * scaleY, styledChars.length, j),
            text: styledChar,
            copyFromParent: ['layer'],
            visible: startEntered,
        }))).flat());

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

    makeWavy(amplitude: number, cyclesPerSecond: number) {
        this.spriteTexts.forEach((s, i) => {
            s.addHook('onUpdate', function() {
                this.offsetY = M.lerp(Tween.Easing.OscillateSine(cyclesPerSecond)(this.life.time + i/10), -amplitude, amplitude);
            });
        });
        return this;
    }
}
