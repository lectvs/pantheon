/// <reference path="../texture/filter/textureFilter.ts" />

namespace Effects {
    export type Config = {
        pre?: TextureFilter[];
        silhouette?: SilhouetteConfig;
        outline?: OutlineConfig;
        invertColors?: InvertColorsConfig;
        glitch?: GlitchConfig;
        post?: TextureFilter[];
    }

    export type SilhouetteConfig = { color?: number, alpha?: number, amount?: number,  enabled?: boolean };
    export type OutlineConfig = { color?: number, alpha?: number, enabled?: boolean };
    export type InvertColorsConfig = { enabled?: boolean };
    export type GlitchConfig = { strength?: number, speed?: number, spread?: number, enabled?: boolean };
}


class Effects {
    private effects: [
        Effects.Filters.Silhouette | undefined,
        Effects.Filters.Outline | undefined,
        Effects.Filters.InvertColors | undefined,
        Effects.Filters.Glitch | undefined,
    ];
    private static SILHOUETTE_I: number = 0;
    private static OUTLINE_I: number = 1;
    private static INVERT_COLORS_I: number = 2;
    private static GLITCH_I: number = 3;

    pre: TextureFilter[];
    post: TextureFilter[];

    get silhouette(): Effects.Filters.Silhouette {
        if (!this.effects[Effects.SILHOUETTE_I]) {
            this.effects[Effects.SILHOUETTE_I] = new Effects.Filters.Silhouette(0x000000, 1);
            this.effects[Effects.SILHOUETTE_I]!.enabled = false;
        }
        return <Effects.Filters.Silhouette>this.effects[Effects.SILHOUETTE_I];
    }
    get outline(): Effects.Filters.Outline {
        if (!this.effects[Effects.OUTLINE_I]) {
            this.effects[Effects.OUTLINE_I] = new Effects.Filters.Outline(0x000000, 1);
            this.effects[Effects.OUTLINE_I]!.enabled = false;
        }
        return <Effects.Filters.Outline>this.effects[Effects.OUTLINE_I];
    }
    get invertColors(): Effects.Filters.InvertColors {
        if (!this.effects[Effects.INVERT_COLORS_I]) {
            this.effects[Effects.INVERT_COLORS_I] = new Effects.Filters.InvertColors();
            this.effects[Effects.INVERT_COLORS_I]!.enabled = false;
        }
        return <Effects.Filters.InvertColors>this.effects[Effects.INVERT_COLORS_I];
    }
    get glitch(): Effects.Filters.Glitch {
        if (!this.effects[Effects.GLITCH_I]) {
            this.effects[Effects.GLITCH_I] = new Effects.Filters.Glitch(2, 1, 2);
            this.effects[Effects.GLITCH_I]!.enabled = false;
        }
        return <Effects.Filters.Glitch>this.effects[Effects.GLITCH_I];
    }

    get addSilhouette(): Effects.Filters.Silhouette {
        this.silhouette.enabled = true;
        return this.silhouette;
    }

    get addOutline(): Effects.Filters.Outline {
        this.outline.enabled = true;
        return this.outline;
    }

    constructor(config: Effects.Config = {}) {
        this.effects = [undefined, undefined, undefined, undefined];
        this.pre = [];
        this.post = [];
        this.updateFromConfig(config);
    }

    getFilterList() {
        return this.pre.concat(this.effects.filter(e => e) as TextureFilter[]).concat(this.post);
    }

    hasEffects() {
        if (this.effects.some(effect => effect && effect.enabled)) return true;
        if (this.pre.some(filter => filter && filter.enabled)) return true;
        if (this.post.some(filter => filter && filter.enabled)) return true;
        return false;
    }

    updateEffects(delta: number) {
        this.effects[Effects.SILHOUETTE_I]?.updateTime(delta);
        this.effects[Effects.OUTLINE_I]?.updateTime(delta);
        this.effects[Effects.INVERT_COLORS_I]?.updateTime(delta);
        this.effects[Effects.GLITCH_I]?.updateTime(delta);
        for (let filter of this.pre) filter.updateTime(delta);
        for (let filter of this.post) filter.updateTime(delta);
    }

    updateFromConfig(config: Effects.Config | undefined) {
        if (!config) return;

        if (config.pre) {
            this.pre = config.pre;
        }

        if (config.silhouette) {
            this.silhouette.color = config.silhouette.color ?? 0x000000;
            this.silhouette.alpha = config.silhouette.alpha ?? 1;
            this.silhouette.amount = config.silhouette.amount ?? 1;
            this.silhouette.enabled = config.silhouette.enabled ?? true;
        }

        if (config.outline) {
            this.outline.color = config.outline.color ?? 0x000000;
            this.outline.alpha = config.outline.alpha ?? 1;
            this.outline.enabled = config.outline.enabled ?? true;
        }

        if (config.invertColors) {
            this.invertColors.enabled = config.invertColors.enabled ?? true;
        }

        if (config.glitch) {
            this.glitch.strength = config.glitch.strength ?? 2;
            this.glitch.speed = config.glitch.speed ?? 1;
            this.glitch.spread = config.glitch.spread ?? 2;
            this.glitch.enabled = config.glitch.enabled ?? true;
        }

        if (config.post) {
            this.post = config.post;
        }
    }
}

namespace Effects {
    export namespace Filters {
        export class Silhouette extends TextureFilter {
            get color() { return Color.vec3ToColor(this.getUniform('color')); }
            set color(value: number) { this.setUniform('color', Color.colorToVec3(value)); }
            get alpha() { return this.getUniform('alpha'); }
            set alpha(value: number) { this.setUniform('alpha', value); }
            get amount() { return this.getUniform('amount'); }
            set amount(value: number) { this.setUniform('amount', value); }

            constructor(color: number, alpha: number) {
                super({
                    uniforms: {
                        "vec3 color": Color.colorToVec3(0x000000),
                        "float alpha": 1.0,
                        "float amount": 1.0
                    },
                    code: `
                        if (inp.a > 0.0) {
                            outp = inp * (1.0 - amount) + vec4(color, alpha) * amount;
                        }
                    `
                });
                this.color = color;
                this.alpha = alpha;
            }

            enable(color: number, alpha: number, amount: number) {
                this.color = color;
                this.alpha = alpha;
                this.amount = amount;
                this.enabled = true;
            }
        }

        export class Outline extends TextureFilter {
            get color() { return Color.vec3ToColor(this.getUniform('color')); }
            set color(value: number) { this.setUniform('color', Color.colorToVec3(value)); }
            get alpha() { return this.getUniform('alpha'); }
            set alpha(value: number) { this.setUniform('alpha', value); }
            get matchAlpha() { return this.getUniform('matchAlpha') > 0; }
            set matchAlpha(value: boolean) { this.setUniform('matchAlpha', value ? 1 : 0); }

            constructor(color: number, alpha: number, matchAlpha: boolean = true) {
                super({
                    uniforms: {
                        "vec3 color": Color.colorToVec3(0x000000),
                        "float alpha": 1.0,
                        "int matchAlpha": 1,
                    },
                    code: `
                        float maxAlpha = max(max(getColor(x-1.0, y).a, getColor(x, y-1.0).a), max(getColor(x+1.0, y).a, getColor(x, y+1.0).a));
                        if (inp.a == 0.0 && maxAlpha > 0.0) {
                            if (matchAlpha == 0) {
                                outp = vec4(color, alpha);
                            } else {
                                outp = vec4(color, alpha * maxAlpha);
                            }
                        }
                    `
                });
                this.color = color;
                this.alpha = alpha;
                this.matchAlpha = matchAlpha;
            }

            enable(color: number, alpha: number, matchAlpha: boolean = true) {
                this.color = color;
                this.alpha = alpha;
                this.matchAlpha = matchAlpha;
                this.enabled = true;
            }
        }

        export class InvertColors extends TextureFilter {
            constructor() {
                super({
                    code: `
                        outp.r = 1.0 - inp.r;
                        outp.g = 1.0 - inp.g;
                        outp.b = 1.0 - inp.b;
                    `
                });
            }

            enable() {
                this.enabled = true;
            }
        }

        export class Glitch extends TextureFilter {
            private _strength: number;
            get strength() { return this._strength; }
            set strength(value: number) {
                this._strength = value;
                this.setUniform('strength', value);
            }

            private _speed: number;
            get speed() { return this._speed; }
            set speed(value: number) {
                this._speed = value;
                this.setUniform('speed', value);
            }

            private _spread: number;
            get spread() { return this._spread; }
            set spread(value: number) {
                this._spread = value;
                this.setUniform('spread', value);
            }

            /**
             * @param strength - the amplitude of the offset
             * @param speed - the speed at which the offset cycles
             * @param spread - the average length of the bands
             */
            constructor(strength: number, speed: number, spread: number) {
                super({
                    uniforms: { 'float strength': strength, 'float speed': speed, 'float spread': spread },
                    code: `
                        float tt = floor(5.4 + t * speed);
                        float yy = floor(y / spread) * spread;
                        float offset = pnoise(0.0, yy*1.1, tt*5.1) * strength;
                        outp = getColor(x + offset, y);
                    `
                });

                this._strength = strength;
                this._speed = speed;
                this._spread = spread;
            }

            enable(strength: number, speed: number, spread: number) {
                this.strength = strength;
                this.speed = speed;
                this.spread = spread;
                this.enabled = true;
            }
        }
    }
}