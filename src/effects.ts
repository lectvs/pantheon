namespace Effects {
    export type Config = {
        silhouette?: SilhouetteConfig;
        outline?: OutlineConfig;
    }

    export type SilhouetteConfig = { color?: number, alpha?: number, enabled?: boolean };
    export type OutlineConfig = { color?: number, alpha?: number, enabled?: boolean };
}

class Effects {
    private effects: [Effects.Filters.Silhouette, Effects.Filters.Outline];
    private static SILHOUETTE_I: number = 0;
    private static OUTLINE_I: number = 1;

    get silhouette(): Effects.Filters.Silhouette {
        if (!this.effects[Effects.SILHOUETTE_I]) {
            this.effects[Effects.SILHOUETTE_I] = new Effects.Filters.Silhouette(0x000000, 1);
            this.effects[Effects.SILHOUETTE_I].enabled = false;
        }
        return this.effects[Effects.SILHOUETTE_I];
    }
    get outline(): Effects.Filters.Outline {
        if (!this.effects[Effects.OUTLINE_I]) {
            this.effects[Effects.OUTLINE_I] = new Effects.Filters.Outline(0x000000, 1);
            this.effects[Effects.OUTLINE_I].enabled = false;
        }
        return this.effects[Effects.OUTLINE_I];
    }

    constructor(config: Effects.Config = {}) {
        this.effects = [undefined, undefined];
        this.updateFromConfig(config);
    }

    getFilterList() {
        return this.effects;
    }

    updateFromConfig(config: Effects.Config) {
        if (!config) return;

        if (config.silhouette) {
            this.silhouette.color = O.getOrDefault(config.silhouette.color, 0x000000);
            this.silhouette.alpha = O.getOrDefault(config.silhouette.alpha, 1);
            this.silhouette.enabled = O.getOrDefault(config.silhouette.enabled, true);
        }

        if (config.outline) {
            this.outline.color = O.getOrDefault(config.outline.color, 0x000000);
            this.outline.alpha = O.getOrDefault(config.outline.alpha, 1);
            this.outline.enabled = O.getOrDefault(config.outline.enabled, true);;
        }
    }
}

namespace Effects {
    export namespace Filters {
        export class Outline extends TextureFilter {
            get color() { return M.vec3ToColor(this.getUniform('color')); }
            set color(value: number) { this.setUniform('color', M.colorToVec3(value)); }
            get alpha() { return this.getUniform('alpha'); }
            set alpha(value: number) { this.setUniform('alpha', value); }

            constructor(color: number, alpha: number) {
                super({
                    uniforms: [ "vec3 color", "float alpha" ],
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

        export class Silhouette extends TextureFilter {
            get color() { return M.vec3ToColor(this.getUniform('color')); }
            set color(value: number) { this.setUniform('color', M.colorToVec3(value)); }
            get alpha() { return this.getUniform('alpha'); }
            set alpha(value: number) { this.setUniform('alpha', value); }

            constructor(color: number, alpha: number) {
                super({
                    uniforms: [ "vec3 color", "float alpha" ],
                    code: `
                        if (inp.a > 0.0) {
                            outp = vec4(color, alpha);
                        }
                    `
                });
                this.color = color;
                this.alpha = alpha;
            }
        }
    }
}