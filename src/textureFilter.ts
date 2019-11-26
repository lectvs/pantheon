namespace TextureFilter {
    export type Config = {
        uniforms?: string[];
        defaultUniforms?: Dict<any>;
        code: string;
    }
}

class TextureFilter {
    private pixiFilter: PIXI.Filter;

    constructor(config: TextureFilter.Config) {
        let uniforms = (config.uniforms || []).map(uniform => `uniform ${uniform};`).join('');
        let vert = TextureFilter.vert;
        let frag = TextureFilter.fragPreUniforms + uniforms + TextureFilter.fragStartFunc + config.code + TextureFilter.fragEndFunc;
        this.pixiFilter = new PIXI.Filter(vert, frag, {});
        this.setUniforms(config.defaultUniforms);
    }

    getPixiFilter() {
        return this.pixiFilter;
    }

    getUniform(uniform: string) {
        return this.pixiFilter.uniforms[uniform];
    }

    setDimensions(width: number, height: number) { }

    setTexturePosition(posx: number, posy: number) {
        this.pixiFilter.uniforms['posx'] = posx;
        this.pixiFilter.uniforms['posy'] = posy;
    }

    setUniform(uniform: string, value: any) {
        this.pixiFilter.uniforms[uniform] = value;
    }

    setUniforms(uniforms: Dict<any>) {
        if (!uniforms) return;
        for (let key in uniforms) {
            this.pixiFilter.uniforms[key] = uniforms[key];
        }
    }

    private static vert = `
        attribute vec2 aVertexPosition;
        uniform mat3 projectionMatrix;
        varying vec2 vTextureCoord;
        uniform vec4 inputSize;
        uniform vec4 outputFrame;
        varying vec4 is;
        
        vec4 filterVertexPosition(void) {
            vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
            return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
        }
        
        vec2 filterTextureCoord(void) {
            return aVertexPosition * (outputFrame.zw * inputSize.zw);
        }
        
        void main(void) {
            gl_Position = filterVertexPosition();
            vTextureCoord = filterTextureCoord();
            is = inputSize;
        }
    `;

    private static fragPreUniforms = `
        varying vec2 vTextureCoord;
        varying vec4 is;
        uniform sampler2D uSampler;
        uniform float posx;
        uniform float posy;

        float width;
        float height;
    `;

    private static fragStartFunc = `
        vec4 getColor(float localx, float localy) {
            float tx = (localx + posx) / width;
            float ty = (localy + posy) / height;
            return texture2D(uSampler, vec2(tx, ty));
        }

        vec4 getWorldColor(float worldx, float worldy) {
            float tx = worldx / width;
            float ty = worldy / height;
            return texture2D(uSampler, vec2(tx, ty));
        }

        void main(void) {
            width = is.x;
            height = is.y;
            float worldx = vTextureCoord.x * width;
            float worldy = vTextureCoord.y * height;
            float x = worldx - posx;
            float y = worldy - posy;
            vec4 color = texture2D(uSampler, vTextureCoord);
            // Un-premultiply alpha before applying the color matrix. See PIXI issue #3539.
            if (color.a > 0.0) {
                color.rgb /= color.a;
            }
            vec4 result = vec4(color.r, color.g, color.b, color.a);
    `;

    private static fragEndFunc = `
            // Premultiply alpha again.
            result.rgb *= result.a;
            gl_FragColor = result;
        }
    `;
}

namespace TextureFilter {
    export class Static extends TextureFilter {
        constructor(code: string) {
            super({ code });
        }
    }

    export class Mask extends TextureFilter {
        private type: Mask.Type;
        private offsetX: number;
        private offsetY: number;

        get invert() { return this.getUniform('invert'); }
        set invert(value: boolean) { this.setUniform('invert', value); }

        constructor(config: Mask.Config) {
            super({
                uniforms: [ "sampler2D mask", "float maskWidth", "float maskHeight", "float maskX", "float maskY", "bool invert" ],
                code: `
                    vec2 vTextureCoordMask = vTextureCoord * is.xy / vec2(maskWidth, maskHeight) - vec2(maskX, maskY) / vec2(maskWidth, maskHeight);
                    if (vTextureCoordMask.x >= 0.0 && vTextureCoordMask.x < 1.0 && vTextureCoordMask.y >= 0.0 && vTextureCoordMask.y < 1.0) {
                        float a = texture2D(mask, vTextureCoordMask).a;
                        result *= invert ? 1.0-a : a;
                    } else {
                        result.a = invert ? color.a : 0.0;
                    }
                `
            });
            this.type = config.type;
            this.offsetX = O.getOrDefault(config.offsetX, 0);
            this.offsetY = O.getOrDefault(config.offsetY, 0);
            this.invert = O.getOrDefault(config.invert, false);
            this.setMask(config.mask);
        }

        setMask(mask: Texture) {
            this.setUniform('mask', mask.toMaskTexture());
            this.setUniform('maskWidth', mask.width);
            this.setUniform('maskHeight', mask.height);
            this.setMaskPosition(0, 0);
        }

        setTexturePosition(posx: number, posy: number) {
            super.setTexturePosition(posx, posy);
            this.setMaskPosition(posx, posy);
        }

        private setMaskPosition(textureX: number, textureY: number) {
            if (this.type === Mask.Type.GLOBAL) {
                this.setUniform('maskX', this.offsetX);
                this.setUniform('maskY', this.offsetY);
            } else if (this.type === Mask.Type.LOCAL) {
                this.setUniform('maskX', textureX + this.offsetX);
                this.setUniform('maskY', textureY + this.offsetY);
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

        export enum Type {
            GLOBAL = 'global', LOCAL = 'local',
        }
    }

    export class LocalMask extends TextureFilter {
        private mask: Texture;
        private currentMaskTexture: Texture;
        private currentMaskWidth: number;
        private currentMaskHeight: number;
        private currentMaskX: number;
        private currentMaskY: number;

        constructor(mask: Texture) {
            super({
                uniforms: [ "sampler2D mask" ],
                defaultUniforms: {},
                code: `
                    result *= texture2D(mask, vTextureCoord).a;
                `
            });
            this.setMask(mask);
        }

        setDimensions(width: number, height: number) {
            super.setDimensions(width, height);
            if (this.currentMaskWidth !== width || this.currentMaskHeight !== height) {
                this.currentMaskWidth = width;
                this.currentMaskHeight = height;
                this.refreshMask();
            }
        }

        setTexturePosition(posx: number, posy: number) {
            super.setTexturePosition(posx, posy);
            if (this.currentMaskX !== posx || this.currentMaskY !== posy) {
                this.currentMaskX = posx;
                this.currentMaskY = posy;
                this.refreshMask();
            }
        }

        setMask(mask: Texture) {
            this.mask = mask;
            this.currentMaskTexture = mask;
            this.setDimensions(this.currentMaskTexture.width, this.currentMaskTexture.height);
            this.setTexturePosition(0, 0);
            this.refreshMask();
        }

        private refreshMask() {
            if (this.currentMaskTexture !== this.mask) this.currentMaskTexture.free();
            this.currentMaskTexture = new Texture(
                M.minPowerOf2(this.currentMaskWidth), 
                M.minPowerOf2(this.currentMaskHeight)
            );
            this.currentMaskTexture.render(this.mask, { x: this.currentMaskX, y: this.currentMaskY });
            this.setUniform('mask', this.currentMaskTexture.toMaskTexture());
        }
    }

    export class Slice extends TextureFilter {
        constructor(rect: Rect) {
            super({
                uniforms: [ "float sliceX", "float sliceY", "float sliceWidth", "float sliceHeight" ],
                defaultUniforms: {
                    'sliceX': rect.x,
                    'sliceY': rect.y,
                    'sliceWidth': rect.width,
                    'sliceHeight': rect.height,
                },
                code: `
                    if (x < sliceX || x >= sliceX + sliceWidth || y < sliceY || y >= sliceY + sliceHeight) {
                        result.a = 0.0;
                    }
                `
            });
        }

        setSlice(rect: Rect) {
            this.setUniforms({
                'sliceX': rect.x,
                'sliceY': rect.y,
                'sliceWidth': rect.width,
                'sliceHeight': rect.height,
            });
        }
    }

    const _sliceFilter: Slice = new Slice({ x: 0, y: 0, width: 0, height: 0 });
    export function SLICE(rect: Rect) {
        _sliceFilter.setSlice(rect);
        return _sliceFilter;
    }

    export class Outline extends TextureFilter {
        constructor(color: number, alpha: number) {
            super({
                uniforms: [ "vec3 outlineColor", "float outlineAlpha" ],
                defaultUniforms: {
                    'outlineColor': Outline.colorToVec3(color),
                    'outlineAlpha': alpha,
                },
                code: `
                    if (color.a == 0.0 && (getColor(x-1.0, y).a > 0.0 || getColor(x+1.0, y).a > 0.0 || getColor(x, y-1.0).a > 0.0 || getColor(x, y+1.0).a > 0.0)) {
                        result = vec4(outlineColor, outlineAlpha);
                    }
                `
            })
        }

        private static colorToVec3(color: number) {
            let r = (color >> 16) & 255;
            let g = (color >> 8) & 255;
            let b = color & 255;
            return [r/255, g/255, b/255];
        }
    }
}