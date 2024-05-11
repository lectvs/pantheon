/// <reference path="../../texture/filter/textureFilter.ts" />
/// <reference path="../../worldObject/sprite/sprite.ts" />

namespace LoadingRing {
    export type Config = Sprite.Config<LoadingRing> & {
        outerRadius: number;
        thickness: number;
    }
}

class LoadingRing extends Sprite {
    private outerRadius: number;
    private thickness: number;
    progress = 0;

    constructor(config: LoadingRing.Config) {
        super(config);
        this.outerRadius = config.outerRadius;
        this.thickness = config.thickness;
        this.updateTexture();
    }

    override render(): [PIXI.Sprite, ...PIXI.DisplayObject[]] {
        this.updateTexture();
        return super.render();
    }

    protected updateTexture() {
        let progress = M.clamp(this.progress, 0, 1);
        this.setTexture(LoadingRing.getTexture(this.outerRadius, this.thickness, progress));
    }

    static getTexture(outerRadius: number, thickness: number, progress: number) {
        let roundedProgress = Math.floor(progress * 100) / 100;
        let roundedRadius = Math.ceil(outerRadius);
        return lazy(`LoadingRing(${outerRadius}, ${thickness},${roundedProgress})`, () => {
            let texture = newPixiRenderTexture(roundedRadius*2, roundedRadius*2, 'LoadingRing');
            let sprite = new PIXI.Sprite(Textures.NOOP);
            sprite.x = outerRadius;
            sprite.y = outerRadius;
            sprite.filters = [new LoadingRing.Filter(outerRadius, thickness, roundedProgress)];
            sprite.filterArea = new PIXI.Rectangle(0, 0, roundedRadius*2, roundedRadius*2);
            renderToRenderTexture(sprite, texture, 'clearTextureFirst');
            TextureUtils.setImmutable(texture);
            texture.defaultAnchor.set(0.5, 0.5);
            return texture;
        });
    }
}

namespace LoadingRing {
    export class Filter extends TextureFilter {
        private _progress: number = 1;
        get progress() { return this._progress; }
        set progress(value: number) {
            if (value === this._progress) return;
            this.setUniform('progress', value);
            this._progress = value;
        }

        constructor(outerRadius: number, thickness: number, progress: number) {
            super({
                uniforms: { 'float progress': progress, 'float innerRadius': outerRadius - thickness, 'float outerRadius': outerRadius },
                code: `
                    float l = length(vec2(x - outerRadius, y - outerRadius));
                    float angle = atan(-(y - outerRadius), -(x - outerRadius)) * 180.0 / PI + 180.0;
                    if (innerRadius <= l && l <= outerRadius && angle <= 360.0 * progress) {
                        outp = vec4(1.0, 1.0, 1.0, 1.0);
                    } else {
                        outp.a = 0.0;
                    }
                `,
            });
        }
    }
}