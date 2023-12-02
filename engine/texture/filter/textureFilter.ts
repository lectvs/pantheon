///<reference path="../../utils/pool.ts"/>
///<reference path="../../utils/perlin.ts"/>

namespace TextureFilter {
    /**
     * Texture fragment filter config.
     * 
     * @property uniforms Map of uniform name => value to initialize the filter. Of the form {"rx": 5, "position": [1,4]}
     * @property code The fragment shader code. Set the color in `outp`.
     *           Available for use are the following variables and methods:
     *               vec4 inp - the input color
     *               float width/height - the width and height of the source texture
     *               float destWidth/destHeight - the width and height of the dest texture (filter, technically)
     *               float x/y - the local x/y coordinates in pixels
     *               float destx/y - the x/y coordinates in dest space
     *               float t - time in seconds
     *               vec4 getColor(float x, float y) - get the color at local x/y
     *               vec4 getDestColor(float destx, float desty) - get the color at x/y in dest space
     *               float pnoise(vec3 p) - perlin noise at a point, normalized to [-1, 1]
     *               float pnoise(float x, float y, float z) - perlin noise at a point, normalized to [-1, 1]
     *               float pnoisePos(vec3 p) - perlin noise at a point, normalized to [0, 1]
     *               float pnoisePos(float x, float y, float z) - perlin noise at a point, normalized to [0, 1]
     *               vec3 rgb2hsv(vec3 rgb) - converts RGB to HSV. all values are in the range [0, 1]
     *               vec3 hsv2rgb(vec3 hsv) - converts HSV to RGB. all values are in the range [0, 1]
     *               float map(float value, float min1, float max1, float min2, float max2) - linearly map a value between ranges
     *               float mapClamp(float value, float min1, float max1, float min2, float max2) - map and clamp a value between ranges
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

    getUniform(name: string) {
        return this.uniformCache[name];
    }

    getVisualPadding() {
        return this.visualPadding;
    }

    setTextureDimensions(dimx: number, dimy: number) {
        this.setUniform('dimx', dimx);
        this.setUniform('dimy', dimy);
    }

    setTexturePosition(posx: number, posy: number) {
        this.setUniform('posx', posx);
        this.setUniform('posy', posy);
    }

    setUniform(name: string, value: any) {
        if (this.uniformCache[name] === value) return;
        this.uniforms[name] = value;
        this.uniformCache[name] = value;
    }

    update() {
        
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

        uniform float posx;
        uniform float posy;
        uniform float dimx;
        uniform float dimy;
        uniform float t;

        float width;
        float height;
        float destWidth;
        float destHeight;
    `;

    const fragCoreHelperMethods = `
        vec4 getColor(float localx, float localy) {
            float tx = (localx + posx) / destWidth;
            float ty = (localy + posy) / destHeight;
            vec4 color = texture2D(uSampler, vec2(tx, ty));
            if (color.a > 0.0) {
                // Un-premultiply alpha, like inp.
                color.rgb /= color.a;
            }
            return color;
        }

        vec4 getDestColor(float destx, float desty) {
            float tx = destx / destWidth;
            float ty = desty / destHeight;
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

            width = dimx;
            height = dimy;
            destWidth = inputSize.x;
            destHeight = inputSize.y;
            float destx = vTextureCoord.x * destWidth;
            float desty = vTextureCoord.y * destHeight;
            float x = destx - posx;
            float y = desty - posy;
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
        if (O.isEmpty(uniformDeclarations)) return {};
        let uniforms: Dict<any> = {};
        for (let decl in uniformDeclarations) {
            let uniformName = decl.trim().substring(decl.lastIndexOf(' ') + 1);
            uniforms[uniformName] = uniformDeclarations[decl];
        }

        uniforms['posx'] = 0;
        uniforms['posy'] = 0;
        uniforms['dimx'] = 0;
        uniforms['dimy'] = 0;
        uniforms['t'] = 0;

        return uniforms;
    }
}