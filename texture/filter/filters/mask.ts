namespace TextureFilters {
    export class Mask extends TextureFilter {
        type: Mask.Type;
        offsetX: number;
        offsetY: number;

        get invert() { return this.getUniform('invert'); }
        set invert(value: boolean) { this.setUniform('invert', value); }

        private maskOffsetX: number;
        private maskOffsetY: number;

        constructor(config: Mask.Config) {
            super({
                uniforms: {
                    "sampler2D mask": undefined,
                    "float maskWidth": 0,
                    "float maskHeight": 0,
                    "float maskX": 0,
                    "float maskY": 0,
                    "bool invert": false
                },
                code: `
                    vec2 vTextureCoordMask = vTextureCoord * inputSize.xy / vec2(maskWidth, maskHeight) - vec2(maskX, maskY) / vec2(maskWidth, maskHeight);
                    if (vTextureCoordMask.x >= 0.0 && vTextureCoordMask.x < 1.0 && vTextureCoordMask.y >= 0.0 && vTextureCoordMask.y < 1.0) {
                        float a = texture2D(mask, vTextureCoordMask).a;
                        outp *= invert ? 1.0-a : a;
                    } else {
                        outp.a = invert ? inp.a : 0.0;
                    }
                `
            });
            this.type = config.type;
            this.offsetX = config.offsetX ?? 0;
            this.offsetY = config.offsetY ?? 0;
            this.invert = config.invert ?? false;
            this.setMask(config.mask);
        }

        setMask(texture: Texture) {
            let mask = texture.toMask();
            this.setUniform('mask', mask.renderTexture);
            this.setUniform('maskWidth', mask.renderTexture.width);
            this.setUniform('maskHeight', mask.renderTexture.height);
            this.maskOffsetX = mask.offsetx;
            this.maskOffsetY = mask.offsety;
        }

        // Used by Texture in render
        setTexturePosition(posx: number, posy: number) {
            super.setTexturePosition(posx, posy);
            this.setMaskPosition(posx, posy);
        }

        private setMaskPosition(textureX: number, textureY: number) {
            let totalOffsetX = this.offsetX + this.maskOffsetX;
            let totalOffsetY = this.offsetY + this.maskOffsetY;

            if (this.type === 'global') {
                this.setUniform('maskX', totalOffsetX);
                this.setUniform('maskY', totalOffsetY);
            } else if (this.type === 'local') {
                this.setUniform('maskX', textureX + totalOffsetX);
                this.setUniform('maskY', textureY + totalOffsetY);
            }
        }
    }

    export namespace Mask {
        export type Config = {
            mask: Texture;
            type: Mask.Type;
            offsetX?: number;
            offsetY?: number;
            invert?: boolean;
        }

        export type Type = 'global' | 'local';

        var _maskFilter: Mask;
        export function SHARED(mask: Texture, type: Mask.Type = 'global', offsetX: number = 0, offsetY: number = 0, invert: boolean = false) {
            if (!_maskFilter) {
                _maskFilter = new Mask({ mask, type, offsetX, offsetY, invert });
            } else {
                _maskFilter.setMask(mask);
                _maskFilter.type = type;
                _maskFilter.offsetX = offsetX;
                _maskFilter.offsetY = offsetY;
                _maskFilter.invert = invert;
            }
            return _maskFilter;
        }

        export type WorldObjectMaskConfig = {
            texture: Texture;
            type: 'local' | 'screen' | 'world';
            offsetx: number;
            offsety: number;
            invert?: boolean;
        }

        export type WorldMaskConfig = {
            texture: Texture;
            offsetx: number;
            offsety: number;
            invert?: boolean;
        }

        export type WorldObjectMaskType = 'local' | 'screen' | 'world';

        export function getTextureMaskForWorldObject(mask: WorldObjectMaskConfig, worldObject: WorldObject, renderX: number, renderY: number): Texture.MaskProperties {
            if (!mask || !mask.texture) return undefined;

            let x = 0;
            let y = 0;
            if (mask.type === 'screen') {
                x = mask.offsetx;
                y = mask.offsety;
            } else if (mask.type === 'local') {
                x = renderX + mask.offsetx;
                y = renderY + mask.offsety;
            } else if (mask.type === 'world') {
                let worldx = worldObject.world ? -Math.round(worldObject.world.camera.worldOffsetX) : 0;
                let worldy = worldObject.world ? -Math.round(worldObject.world.camera.worldOffsetY) : 0;
                x = worldx + mask.offsetx;
                y = worldy + mask.offsety;
            }

            return {
                texture: mask.texture,
                x: x, y: y,
                invert: mask.invert ?? false,
            };
        }

        export function getTextureMaskForWorld(mask: WorldMaskConfig): Texture.MaskProperties {
            if (!mask || !mask.texture) return undefined;

            return {
                texture: mask.texture,
                x: mask.offsetx, y: mask.offsety,
                invert: mask.invert ?? false,
            };
        }
    }
}