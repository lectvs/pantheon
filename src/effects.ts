type Effects = {
    silhouette: Effects.Base & {
        color: number;
    };
    outline: Effects.Base & {
        color: number;
    };
}

namespace Effects {
    export type Base = {
        enabled: boolean;
    }

    export function empty(): Effects {
        return {
            silhouette: {
                enabled: false,
                color: 0xFFFFFF,
            },
            outline: {
                enabled: false,
                color: 0x000000,
            },
        }
    }

    export function partial(effects: any) {
        let result = empty();
        O.deepOverride(result, effects);
        return result;
    }

    export class Filter extends PIXI.Filter {
        effects: Effects;

        constructor(effects: Effects) {
            super(Filter.vertSource, Filter.fragSource, {});
            this.effects = effects;
            this.update();
        }

        update() {
            this.uniforms.filterDimensions = [Main.width, Main.height];
            this.uniforms.silhouetteEnabled = this.effects.silhouette.enabled;
            this.uniforms.silhouetteColor = this.colorToVec3(this.effects.silhouette.color);

            this.uniforms.outlineEnabled = this.effects.outline.enabled;
            this.uniforms.outlineColor = this.colorToVec3(this.effects.outline.color);
        }

        private colorToVec3(color: number) {
            let r = (color >> 16) & 255;
            let g = (color >> 8) & 255;
            let b = color & 255;
            return [r/255, g/255, b/255];
        }
    }

    export namespace Filter {
        export const vertSource = `
            attribute vec2 aVertexPosition;
            uniform mat3 projectionMatrix;
            varying vec2 vTextureCoord;
            uniform vec4 inputSize;
            uniform vec4 outputFrame;
            
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
            }
        `;

        export const fragSource = `
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform vec2 filterDimensions;

            uniform bool silhouetteEnabled;
            uniform vec3 silhouetteColor;

            uniform bool outlineEnabled;
            uniform vec3 outlineColor;
            
            void main(void) {
                vec2 px = vec2(1.0/filterDimensions.x, 1.0/filterDimensions.y);
                vec4 c = texture2D(uSampler, vTextureCoord);
                
                // Un-premultiply alpha before applying the color matrix. See PIXI issue #3539.
                if (c.a > 0.0) {
                    c.rgb /= c.a;
                }
                
                vec4 result = vec4(c);

                if (silhouetteEnabled) {
                    result.r = silhouetteColor.r;
                    result.g = silhouetteColor.g;
                    result.b = silhouetteColor.b;
                }

                if (outlineEnabled) {
                    vec4 cup = texture2D(uSampler, vTextureCoord + vec2(0.0, -px.y));
                    vec4 cdown = texture2D(uSampler, vTextureCoord + vec2(0.0, px.y));
                    vec4 cleft = texture2D(uSampler, vTextureCoord + vec2(-px.x, 0.0));
                    vec4 cright = texture2D(uSampler, vTextureCoord + vec2(px.x, 0.0));
                    if (c.a == 0. && (cup.a > 0. || cdown.a > 0. || cleft.a > 0. || cright.a > 0.)) {
                        result.r = outlineColor.r;
                        result.g = outlineColor.g;
                        result.b = outlineColor.b;
                        result.a = 1.0;
                    }
                }
                
                // Premultiply alpha again.
                result.rgb *= result.a;

                gl_FragColor = result;
            }
        `;
    }
}
