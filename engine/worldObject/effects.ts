/// <reference path="../texture/filter/textureFilter.ts" />

namespace Effects {
    export type Config = {
        pre?: TextureFilter[];
        silhouette?: SilhouetteConfig;
        outline?: OutlineConfig;
        invertColors?: InvertColorsConfig;
        glitch?: GlitchConfig;
        dropShadow?: DropShadowConfig;
        post?: TextureFilter[];
    }

    export type SilhouetteConfig = { color?: number, alpha?: number, amount?: number,  enabled?: boolean };
    export type OutlineConfig = { color?: number, alpha?: number, matchAlpha?: boolean, fillCorners?: boolean, enabled?: boolean };
    export type InvertColorsConfig = { enabled?: boolean };
    export type GlitchConfig = { strength?: number, speed?: number, spread?: number, enabled?: boolean };
    export type DropShadowConfig = { distance?: number, color?: number, alpha?: number, enabled?: boolean };
}


class Effects {
    private _silhouetteLazy = new LazyValue(() => new Effects.Filters.Silhouette(0x000000, 1).disable());
    private _outlineLazy = new LazyValue(() => new Effects.Filters.Outline(0x000000, 1).disable());
    private _invertColorsLazy = new LazyValue(() => new Effects.Filters.InvertColors().disable());
    private _glitchLazy = new LazyValue(() => new Effects.Filters.Glitch(2, 1, 2).disable());
    private _dropShadowLazy = new LazyValue(() => new Effects.Filters.DropShadow(1, 0x000000, 0.5).disable());

    get silhouette() { return this._silhouetteLazy.get(); }
    get outline() { return this._outlineLazy.get(); }
    get invertColors() { return this._invertColorsLazy.get(); }
    get glitch() { return this._glitchLazy.get(); }
    get dropShadow() { return this._dropShadowLazy.get(); }

    pre: TextureFilter[];
    post: TextureFilter[];

    constructor(config: Effects.Config = {}) {
        this.pre = [];
        this.post = [];
        this.updateFromConfig(config);
    }

    getFilterList$(): TextureFilter[] {
        return this.getAllEffects$().filterInPlace(e => e.doesAffectRender());
    }

    hasEffects() {
        return this.getAllEffects$().some(e => e.doesAffectRender());
    }

    removeFromPost(filter: TextureFilter) {
        A.removeAll(this.post, filter);
    }

    removeFromPre(filter: TextureFilter) {
        A.removeAll(this.pre, filter);
    }

    setOnPost(filter: TextureFilter) {
        if (this.post.includes(filter)) return;
        this.post.push(filter);
    }

    setOnPre(filter: TextureFilter) {
        if (this.pre.includes(filter)) return;
        this.pre.push(filter);
    }

    updateEffects(delta: number) {
        let allEffects = this.getAllEffects$();
        for (let effect of allEffects) {
            effect.updateTime(delta);
        }
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
            this.outline.matchAlpha = config.outline.matchAlpha ?? true;
            this.outline.fillCorners = config.outline.fillCorners ?? false;
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

        if (config.dropShadow) {
            this.dropShadow.distance = config.dropShadow.distance ?? 1;
            this.dropShadow.color = config.dropShadow.color ?? 0x000000;
            this.dropShadow.alpha = config.dropShadow.alpha ?? 0.5;
            this.dropShadow.enabled = config.dropShadow.enabled ?? true;
        }

        if (config.post) {
            this.post = config.post;
        }
    }

    private getAllEffects$() {
        let result: TextureFilter[] = FrameCache.array();

        result.pushAll(this.pre);

        if (this._silhouetteLazy.has()) result.push(this._silhouetteLazy.get());
        if (this._outlineLazy.has()) result.push(this._outlineLazy.get());
        if (this._invertColorsLazy.has()) result.push(this._invertColorsLazy.get());
        if (this._glitchLazy.has()) result.push(this._glitchLazy.get());
        if (this._dropShadowLazy.has()) result.push(this._dropShadowLazy.get());

        result.pushAll(this.post);

        return result;
    }
}

namespace Effects {
    export namespace Filters {
        export class Silhouette extends TextureFilter {
            private _color: number;
            get color() { return this._color; }
            set color(value: number) {
                if (value === this._color) return;
                this.setUniform('color', Color.colorToVec3(value));
                this._color = value;
            }

            private _alpha: number;
            get alpha() { return this._alpha; }
            set alpha(value: number) {
                if (value === this._alpha) return;
                this.setUniform('alpha', value);
                this._alpha = value;
            }

            private _amount: number = 1;
            get amount() { return this._amount; }
            set amount(value: number) {
                if (value === this._amount) return;
                this.setUniform('amount', value);
                this._amount = value;
            }

            constructor(color: number, alpha: number) {
                super({
                    uniforms: {
                        'vec3 color': Color.colorToVec3(color),
                        'float alpha': alpha,
                        'float amount': 1.0
                    },
                    code: `
                        if (inp.a > 0.0) {
                            outp = inp * (1.0 - amount) + vec4(color, alpha) * amount;
                        }
                    `
                });

                this._color = color;
                this._alpha = alpha;
            }

            override doesAffectRender(): boolean {
                if (this.amount === 0) return false;
                return super.doesAffectRender();
            }

            enable(color: number = this.color, alpha: number = this.alpha, amount: number = this.amount) {
                this.color = color;
                this.alpha = alpha;
                this.amount = amount;
                this.enabled = true;
                return this;
            }
        }

        export class Outline extends TextureFilter {
            private _color: number;
            get color() { return this._color; }
            set color(value: number) {
                if (value === this._color) return;
                this.setUniform('color', Color.colorToVec3(value));
                this._color = value;
            }

            private _alpha: number;
            get alpha() { return this._alpha; }
            set alpha(value: number) {
                if (value === this._alpha) return;
                this.setUniform('alpha', value);
                this._alpha = value;
            }

            private _matchAlpha: boolean;
            get matchAlpha() { return this._matchAlpha; }
            set matchAlpha(value: boolean) {
                if (value === this._matchAlpha) return;
                this.setUniform('matchAlpha', value ? 1 : 0);
                this._matchAlpha = value;
            }

            private _fillCorners: boolean;
            get fillCorners() { return this._fillCorners; }
            set fillCorners(value: boolean) {
                if (value === this._fillCorners) return;
                this.setUniform('fillCorners', value ? 1 : 0);
                this._fillCorners = value;
            }

            constructor(color: number, alpha: number, matchAlpha: boolean = true, fillCorners: boolean = false) {
                super({
                    uniforms: {
                        'vec3 color': Color.colorToVec3(color),
                        'float alpha': alpha,
                        'int matchAlpha': matchAlpha ? 1 : 0,
                        'int fillCorners': fillCorners ? 1 : 0,
                    },
                    visualPadding: 1,
                    code: `
                        float maxAlpha = max(max(getColor(x-upscale, y).a, getColor(x, y-upscale).a), max(getColor(x+upscale, y).a, getColor(x, y+upscale).a));
                        if (fillCorners == 1) {
                            float maxAlphaCorners = max(max(getColor(x-upscale, y-upscale).a, getColor(x+upscale, y-upscale).a), max(getColor(x-upscale, y+upscale).a, getColor(x+upscale, y+upscale).a));
                            maxAlpha = max(maxAlpha, maxAlphaCorners);
                        }
                        if (inp.a == 0.0 && maxAlpha > 0.0) {
                            if (matchAlpha == 0) {
                                outp = vec4(color, alpha);
                            } else {
                                outp = vec4(color, alpha * maxAlpha);
                            }
                        }
                    `
                });

                this._color = color;
                this._alpha = alpha;
                this._matchAlpha = matchAlpha;
                this._fillCorners = fillCorners;
            }

            override doesAffectRender(): boolean {
                if (this.alpha <= 0) return false;
                return super.doesAffectRender();
            }

            enable(color: number = this.color, alpha: number = this.alpha, matchAlpha: boolean = this.matchAlpha) {
                this.color = color;
                this.alpha = alpha;
                this.matchAlpha = matchAlpha;
                this.enabled = true;
                return this;
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
                return this;
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
                    uniforms: {
                        'float strength': strength,
                        'float speed': speed,
                        'float spread': spread,
                    },
                    code: `
                        float tt = floor(5.4 + t * speed);
                        float yy = floor(y / spread / upscale) * spread * upscale;
                        float offset = pnoise(0.0, yy*1.1, tt*5.1) * strength * upscale;
                        outp = getColor(x + offset, y);
                    `
                });

                this._strength = strength;
                this._speed = speed;
                this._spread = spread;
            }

            enable(strength: number = this.strength, speed: number = this.speed, spread: number = this.spread) {
                this.strength = strength;
                this.speed = speed;
                this.spread = spread;
                this.enabled = true;
                return this;
            }

            override getVisualPadding(): number {
                return this._strength;
            }
        }

        export class DropShadow extends TextureFilter {
            private _distance: number;
            get distance() { return this._distance; }
            set distance(value: number) {
                this._distance = value;
                this.setUniform('distance', value);
            }

            private _color: number;
            get color() { return this._color; }
            set color(value: number) {
                if (value === this._color) return;
                this.setUniform('color', Color.colorToVec3(value));
                this._color = value;
            }

            private _alpha: number;
            get alpha() { return this._alpha; }
            set alpha(value: number) {
                this._alpha = value;
                this.setUniform('alpha', value);
            }

            constructor(distance: number, color: number, alpha: number = 1) {
                super({
                    uniforms: {
                        'float distance': distance,
                        'vec3 color': Color.colorToVec3(color),
                        'float alpha': alpha,
                    },
                    code: `
                        float maxAlpha = getColor(x - distance*upscale, y - distance*upscale).a;
                        if (x/upscale >= distance && y/upscale >= distance && inp.a == 0.0 && maxAlpha > 0.0) {
                            outp = vec4(color, alpha * maxAlpha);
                        }
                    `
                });

                this._distance = distance;
                this._color = color;
                this._alpha = alpha;
            }

            override getVisualPadding(): number {
                return this._distance;
            }
        }
    }
}