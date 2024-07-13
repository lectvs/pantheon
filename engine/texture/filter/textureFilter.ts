///<reference path="../../utils/pool.ts"/>
///<reference path="../../utils/perlin.ts"/>

namespace TextureFilter {
    /**
     * Texture fragment filter config.
     * 
     * @property uniforms Map of uniform type+name => value to initialize the filter. Of the form {"float rx": 5, "vec2 position": [1,4]}
     * @property code The fragment shader code. Set the color in `outp`.
     *           Available for use are the following variables and methods:
     *              vec4 inp - the input color
     *              float width/height - the width and height of the source texture
     *              float x/y - the x/y coordinates in pixels
     *              float t - time in seconds
     *              float upscale - upscale ratio
     *              vec4 getColor(float x, float y) - get the color at x/y
     *              float pnoise(vec3 p) - perlin noise at a point, normalized to [-1, 1]
     *              float pnoise(float x, float y, float z) - perlin noise at a point, normalized to [-1, 1]
     *              float pnoise01(vec3 p) - perlin noise at a point, normalized to [0, 1]
     *              float pnoise01(float x, float y, float z) - perlin noise at a point, normalized to [0, 1]
     *              vec3 rgb2hsv(vec3 rgb) - converts RGB to HSV. all values are in the range [0, 1]
     *              vec3 hsv2rgb(vec3 hsv) - converts HSV to RGB. all values are in the range [0, 1]
     *              float map(float value, float min1, float max1, float min2, float max2) - linearly map a value between ranges
     *              float mapClamp(float value, float min1, float max1, float min2, float max2) - map and clamp a value between ranges
     *              float mod(float n, float mod) - float-wise modulo
     *              float distance(vecN A, vecN B) - distance between two vectors
     *              float length(vecN A) - magnitude of a vector
     */
    export type Config = {
        uniforms?: Dict<any>;
        helperMethods?: string;
        visualPadding?: number;
        code?: string;
    }
}

class TextureFilter extends PIXI.Filter {
    private visualPadding: number;
    private uniformCache: Dict<any>;

    constructor(config: TextureFilter.Config) {
        super(
            PIXI.Filter.defaultVertexSrc,
            TextureFilter.constructFragCode(TextureFilter.constructUniformCode(config.uniforms), config.helperMethods ?? '', config.code ?? ''),
            TextureFilter.constructUniformsMap(config.uniforms),
        );
        this.uniformCache = TextureFilter.constructUniformsMap(config.uniforms);  // Purposefully duplicated
        this.visualPadding = config.visualPadding ?? 0;
    }

    disable() {
        this.enabled = false;
        return this;
    }

    doesAffectRender() {
        return this.enabled;
    }

    getUniform(name: string) {
        return this.uniformCache[name];
    }

    getVisualPadding() {
        return this.visualPadding;
    }

    setOffset(offsetx: number, offsety: number) {
        this.setUniform('offsetx', offsetx);
        this.setUniform('offsety', offsety);
    }

    override setUpscale(scale: number): void {
        super.setUpscale(scale);
        this.setUniform('upscale', scale);
    }

    setTextureValues(width: number, height: number) {
        this.setUniform('width', width * global.upscale);
        this.setUniform('height', height * global.upscale);
    }

    setTextureValuesFromSprite(sprite: PIXI.Sprite) {
        this.setTextureValues(sprite.width, sprite.height);
    }

    setUniform(name: string, value: any) {
        if (this.uniformCache[name] === value) return;
        this.uniforms[name] = value;
        this.uniformCache[name] = value;
    }

    updateTime(delta: number) {
        this.setUniform('t', this.getUniform('t') + delta);
    }
}

namespace TextureFilter {
    export function constructFragCode(uniformCode: string, helperMethods: string, code: string) {
        return fragPrecision
            + fragCoreUniforms
            + uniformCode
            + fragCoreHelperMethods
            + helperMethods
            + fragStartMain
            + code
            + fragEndFunc;
    }

    const fragPrecision = `
        precision highp float;
    `;

    const fragCoreUniforms = `
        varying vec2 vTextureCoord;
        uniform vec4 inputSize;
        uniform sampler2D uSampler;

        uniform float width;
        uniform float height;
        uniform float t;
        uniform float upscale;
        uniform float offsetx;
        uniform float offsety;
    `;

    const fragCoreHelperMethods = `
        vec4 getColor(float localx, float localy) {
            float tx = localx / inputSize.x;
            float ty = localy / inputSize.y;
            vec4 color = texture2D(uSampler, vec2(tx, ty));
            if (color.a > 0.0) {
                // Un-premultiply alpha, like inp.
                color.rgb /= color.a;
            }
            return color;
        }

        bool isApprox(float x, float y) {
            return abs(x - y) < 0.0001;
        }

        float lerp(float a, float b, float t) {
            return a*(1.0-t) + b*t;
        }

        vec2 lerp(vec2 a, vec2 b, float t) {
            return a*(1.0-t) + b*t;
        }

        vec3 lerp(vec3 a, vec3 b, float t) {
            return a*(1.0-t) + b*t;
        }

        vec4 lerp(vec4 a, vec4 b, float t) {
            return a*(1.0-t) + b*t;
        }

        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        float mapClamp(float value, float min1, float max1, float min2, float max2) {
            return clamp(map(value, min1, max1, min2, max2), min2, max2);
        }

        // Source: https://stackoverflow.com/a/17897228
        // All components are in the range [0,1], including hue.
        vec3 rgb2hsv(vec3 c) {
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }

        // Source: https://stackoverflow.com/a/17897228
        // All components are in the range [0,1], including hue.
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        float round(float x) {
            return floor(x + 0.5);
        }

        vec2 round(vec2 x) {
            return vec2(round(x.x), round(x.y));
        }

        vec3 round(vec3 x) {
            return vec3(round(x.x), round(x.y), round(x.z));
        }

        vec4 round(vec4 x) {
            return vec4(round(x.x), round(x.y), round(x.z), round(x.w));
        }

        ${Perlin.SHADER_SOURCE}
    `;

    const fragStartMain = `
        void main(void) {
            #define PI 3.14159265358979
            #define TWOPI 6.28318530717958

            float x = vTextureCoord.x * inputSize.x + offsetx * upscale;
            float y = vTextureCoord.y * inputSize.y + offsety * upscale;
            vec4 inp = texture2D(uSampler, vTextureCoord);
            // Un-premultiply alpha before applying the color matrix. See PIXI issue #3539.
            if (inp.a > 0.0) {
                inp.rgb /= inp.a;
            }
            vec4 outp = vec4(inp.r, inp.g, inp.b, inp.a);
    `;

    const fragEndFunc = `
            // Clamp output to the interval [0,1] to avoid issues with alpha premultiplication.
            outp = clamp(outp, vec4(0.0, 0.0, 0.0, 0.0), vec4(1.0, 1.0, 1.0, 1.0));
            // Premultiply alpha again.
            outp.rgb *= outp.a;
            gl_FragColor = outp;
        }
    `;

    export function constructUniformCode(uniformDeclarations: Dict<any> | undefined) {
        if (O.isEmpty(uniformDeclarations)) return '';
        let uniformCode = '';
        for (let decl in uniformDeclarations) {
            uniformCode += `uniform ${decl};`;
        }
        return uniformCode;
    }

    export function constructUniformsMap(uniformDeclarations: Dict<any> | undefined) {
        let uniforms: Dict<any> = {};

        if (!O.isEmpty(uniformDeclarations)) {
            for (let decl in uniformDeclarations) {
                let uniformName = decl.trim().substring(decl.lastIndexOf(' ') + 1);
                uniforms[uniformName] = uniformDeclarations[decl];
            }
        }

        uniforms['width'] = 0;
        uniforms['height'] = 0;
        uniforms['t'] = 0;
        uniforms['upscale'] = 1;

        return uniforms;
    }
}