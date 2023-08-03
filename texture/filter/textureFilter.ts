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
     *               vec3 rgb2hsv(vec3 rgb) - converts RGB to HSV. all values are in the range [0, 1]
     *               vec3 hsv2rgb(vec3 hsv) - converts HSV to RGB. all values are in the range [0, 1]
     *               float map(float value, float min1, float max1, float min2, float max2) - linearly map a value between ranges
     *               float mapClamp(float value, float min1, float max1, float min2, float max2) - map and clamp a value between ranges
     */
    export type Config = {
        uniforms?: Dict<any>;
        code?: string;
    }
}

class TextureFilter {
    enabled: boolean;
    
    private code: string;
    private uniformCode: string;
    private uniforms: Dict<any>;

    private borrowedPixiFilter: PIXI.Filter;

    constructor(config: TextureFilter.Config) {
        this.code = config.code ?? '';
        this.uniformCode = this.constructUniformCode(config.uniforms);
        this.uniforms = this.constructUniforms(config.uniforms);

        this.setUniform('posx', 0);
        this.setUniform('posy', 0);
        this.setUniform('dimx', 0);
        this.setUniform('dimy', 0);
        this.setUniform('t', 0);

        this.enabled = true;
        this.borrowedPixiFilter = null;
    }

    borrowPixiFilter() {
        this.borrowedPixiFilter = TextureFilter.cache.borrow(this);
        for (let uniform in this.uniforms) {
            this.borrowedPixiFilter.uniforms[uniform] = this.uniforms[uniform];
        }
        return this.borrowedPixiFilter;
    }

    returnPixiFilter() {
        if (!this.borrowedPixiFilter) return;
        TextureFilter.cache.return(this, this.borrowedPixiFilter);
        this.borrowedPixiFilter = null;
    }

    constructPixiFilter(): PIXI.Filter {
        return new PIXI.Filter(PIXI.Filter.defaultVertexSrc, TextureFilter.constructFragCode(this.uniformCode, this.code), {});
    }

    getCacheCode() {
        return `TextureFilter:${this.uniformCode}${this.code}`;
    }

    getUniform(uniform: string) {
        return this.uniforms[uniform];
    }

    getUniformCode() {
        return this.uniformCode;
    }

    setTextureDimensions(dimx: number, dimy: number) {
        this.uniforms['dimx'] = dimx;
        this.uniforms['dimy'] = dimy;
    }

    setTexturePosition(posx: number, posy: number) {
        this.uniforms['posx'] = posx;
        this.uniforms['posy'] = posy;
    }

    setUniform(uniform: string, value: any) {
        this.uniforms[uniform] = value;
    }

    setUniforms(uniforms: Dict<any>) {
        if (!uniforms) return;
        for (let key in uniforms) {
            this.uniforms[key] = uniforms[key];
        }
    }

    update() {
        
    }

    updateTime(delta: number) {
        this.setUniform('t', this.getUniform('t') + delta);
    }

    private constructUniformCode(uniformDeclarations: Dict<any>) {
        if (_.isEmpty(uniformDeclarations)) return '';
        let uniformCode = '';
        for (let decl in uniformDeclarations) {
            uniformCode += `uniform ${decl};`;
        }
        return uniformCode;
    }

    protected constructUniforms(uniformDeclarations: Dict<any>) {
        if (_.isEmpty(uniformDeclarations)) return {};
        let uniformMap = {};
        for (let decl in uniformDeclarations) {
            let uniformName = decl.trim().substring(decl.lastIndexOf(' ') + 1);
            uniformMap[uniformName] = uniformDeclarations[decl];
        }
        return uniformMap;
    }
}

namespace TextureFilter {
    export const cache = new SingleKeyPool(
        (filter: TextureFilter) => filter.constructPixiFilter(),
        (filter: TextureFilter) => filter.getCacheCode(),
    );

    export function constructFragCode(uniformCode: string, code: string) {
        return fragPreUniforms + uniformCode + fragStartFunc + code + fragEndFunc;
    }

    const fragPreUniforms = `
        precision highp float;
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

    const fragStartFunc = `
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

        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        float mapClamp(float value, float min1, float max1, float min2, float max2) {
            return clamp(map(value, min1, max1, min2, max2), min2, max2);
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

        bool approx(float x, float y) {
            return abs(x - y) < 0.0001;
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

        bool convolute44(float x, float y, float p00, float p10, float p20, float p30, float p01, float p11, float p21, float p31, float p02, float p12, float p22, float p32, float p03, float p13, float p23, float p33) {
            return approx(getColor(x, y).a, p00) && approx(getColor(x+1.0, y).a, p10) && approx(getColor(x+2.0, y).a, p20) && approx(getColor(x+3.0, y).a, p30)
                && approx(getColor(x, y+1.0).a, p01) && approx(getColor(x+1.0, y+1.0).a, p11) && approx(getColor(x+2.0, y+1.0).a, p21) && approx(getColor(x+3.0, y+1.0).a, p31)
                && approx(getColor(x, y+2.0).a, p02) && approx(getColor(x+1.0, y+2.0).a, p12) && approx(getColor(x+2.0, y+2.0).a, p22) && approx(getColor(x+3.0, y+2.0).a, p32)
                && approx(getColor(x, y+3.0).a, p03) && approx(getColor(x+1.0, y+3.0).a, p13) && approx(getColor(x+2.0, y+3.0).a, p23) && approx(getColor(x+3.0, y+3.0).a, p33);
        }

        ${Perlin.SHADER_SOURCE}

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

    var _sliceFilter: TextureFilters.Slice;
    export function SLICE_FILTER(rect: Rect) {
        if (!_sliceFilter) {
            _sliceFilter = new TextureFilters.Slice(rect);
        } else {
            _sliceFilter.setSlice(rect);
        }
        return _sliceFilter;
    }
}