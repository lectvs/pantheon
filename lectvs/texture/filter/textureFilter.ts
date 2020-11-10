///<reference path="../../utils/cache.ts"/>
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
        this.borrowedPixiFilter = TextureFilter.cache.borrow(this, this);
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
    export const cache = new SingleKeyCache(
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
            return texture2D(uSampler, vec2(tx, ty));
        }

        vec4 getDestColor(float destx, float desty) {
            float tx = destx / destWidth;
            float ty = desty / destHeight;
            return texture2D(uSampler, vec2(tx, ty));
        }

        ${Perlin.SHADER_SOURCE}

        void main(void) {
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
            // Premultiply alpha again.
            outp.rgb *= outp.a;
            gl_FragColor = outp;
        }
    `;

    var _sliceFilter: SliceFilter;
    export function SLICE_FILTER(rect: Rect) {
        if (!_sliceFilter) {
            _sliceFilter = new SliceFilter(rect);
        } else {
            _sliceFilter.setSlice(rect);
        }
        return _sliceFilter;
    }
}