/// <reference path="../texture/filter/textureFilter.ts" />

namespace Effects {
    export type Config = {
        pre?: PreConfig;
        silhouette?: SilhouetteConfig;
        outline?: OutlineConfig;
        invertColors?: InvertColorsConfig;
        post?: PostConfig;
    }

    export type PreConfig = { filters?: TextureFilter[], enabled?: boolean };
    export type SilhouetteConfig = { color?: number, alpha?: number, amount?: number,  enabled?: boolean };
    export type OutlineConfig = { color?: number, alpha?: number, enabled?: boolean };
    export type InvertColorsConfig = { enabled?: boolean };
    export type PostConfig = { filters?: TextureFilter[], enabled?: boolean };
}


class Effects {
    private effects: [Effects.Filters.Silhouette, Effects.Filters.Outline, Effects.Filters.InvertColors];
    private static SILHOUETTE_I: number = 0;
    private static OUTLINE_I: number = 1;
    private static INVERT_COLORS_I: number = 2;

    pre: Effects.FilterList;
    post: Effects.FilterList;

    get silhouette(): Effects.Filters.Silhouette {
        if (!this.effects[Effects.SILHOUETTE_I]) {
            this.effects[Effects.SILHOUETTE_I] = new Effects.Filters.Silhouette(0x000000, 1);
            this.effects[Effects.SILHOUETTE_I].enabled = false;
        }
        return <Effects.Filters.Silhouette>this.effects[Effects.SILHOUETTE_I];
    }
    get outline(): Effects.Filters.Outline {
        if (!this.effects[Effects.OUTLINE_I]) {
            this.effects[Effects.OUTLINE_I] = new Effects.Filters.Outline(0x000000, 1);
            this.effects[Effects.OUTLINE_I].enabled = false;
        }
        return <Effects.Filters.Outline>this.effects[Effects.OUTLINE_I];
    }
    get invertColors(): Effects.Filters.Outline {
        if (!this.effects[Effects.INVERT_COLORS_I]) {
            this.effects[Effects.INVERT_COLORS_I] = new Effects.Filters.InvertColors();
            this.effects[Effects.INVERT_COLORS_I].enabled = false;
        }
        return <Effects.Filters.Outline>this.effects[Effects.INVERT_COLORS_I];
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
        this.effects = [undefined, undefined, undefined];
        this.pre = { filters: [], enabled: true };
        this.post = { filters: [], enabled: true };
        this.updateFromConfig(config);
    }

    getFilterList() {
        return this.pre.filters.concat(this.effects).concat(this.post.filters);
    }

    hasEffects() {
        if (this.effects.some(effect => effect && effect.enabled)) return true;
        if (this.pre.enabled && this.pre.filters.some(filter => filter && filter.enabled)) return true;
        if (this.post.enabled && this.post.filters.some(filter => filter && filter.enabled)) return true;
        return false;
    }

    updateEffects(delta: number) {
        if (this.effects[Effects.SILHOUETTE_I]) this.effects[Effects.SILHOUETTE_I].updateTime(delta);
        if (this.effects[Effects.OUTLINE_I]) this.effects[Effects.OUTLINE_I].updateTime(delta);
        if (this.effects[Effects.INVERT_COLORS_I]) this.effects[Effects.INVERT_COLORS_I].updateTime(delta);
        for (let filter of this.pre.filters) filter.updateTime(delta);
        for (let filter of this.post.filters) filter.updateTime(delta);
    }

    updateFromConfig(config: Effects.Config) {
        if (!config) return;

        if (config.pre) {
            this.pre.filters = config.pre.filters ?? [];
            this.pre.enabled = config.pre.enabled ?? true;
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

        if (config.post) {
            this.post.filters = config.post.filters ?? [];
            this.post.enabled = config.post.enabled ?? true;
        }
    }
}

namespace Effects {
    export type FilterList = { filters: TextureFilter[], enabled: boolean };
    export namespace Filters {
        export class Silhouette extends TextureFilter {
            get color() { return M.vec3ToColor(this.getUniform('color')); }
            set color(value: number) { this.setUniform('color', M.colorToVec3(value)); }
            get alpha() { return this.getUniform('alpha'); }
            set alpha(value: number) { this.setUniform('alpha', value); }
            get amount() { return this.getUniform('amount'); }
            set amount(value: number) { this.setUniform('amount', value); }

            constructor(color: number, alpha: number) {
                super({
                    uniforms: {
                        "vec3 color": M.colorToVec3(0x000000),
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
        }

        export class Outline extends TextureFilter {
            get color() { return M.vec3ToColor(this.getUniform('color')); }
            set color(value: number) { this.setUniform('color', M.colorToVec3(value)); }
            get alpha() { return this.getUniform('alpha'); }
            set alpha(value: number) { this.setUniform('alpha', value); }

            constructor(color: number, alpha: number) {
                super({
                    uniforms: {
                        "vec3 color": M.colorToVec3(0x000000),
                        "float alpha": 1.0
                    },
                    code: `
                        if (inp.a == 0.0 && (getColor(x-1.0, y).a > 0.0 || getColor(x+1.0, y).a > 0.0 || getColor(x, y-1.0).a > 0.0 || getColor(x, y+1.0).a > 0.0)) {
                            outp = vec4(color, alpha);
                        }
                    `
                });
                this.color = color;
                this.alpha = alpha;
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
        }
    }
}