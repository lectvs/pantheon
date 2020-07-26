///<reference path="../../utils/cache.ts"/>
///<reference path="../../utils/perlin.ts"/>

namespace TextureFilter {
    /**
     * Texture filter config.
     * 
     * @property uniforms Uniform definitions for the filter. Of the form ["float rx", "vec2 position"]
     * @property defaultUniforms Map of uniform name => value to initialize the filter. Of the form {"rx": 5, "position": [1,4]}
     * @property code The fragment shader code. Set the color in `outp`.
     *           Available for use are the following variables and methods:
     *               vec4 inp - the input color
     *               float width/height - the width and height of the filter
     *               float x/y - the local x/y coordinates in pixels
     *               float worldx/y - the x/y coordinates in world/screenspace(?)
     *               float t - time in seconds
     *               vec4 getColor(float x, float y) - get the color at local x/y
     *               vec4 getWorldColor(float worldx, float worldy) - get the color at world x/y
     * @property vertCode The vertex shader code. Set the vertex in `outp`.
*                Available for use are the following variables and methods:
*                    vec2 inp - the input vertex
*                    float width/height - the width and height of the filter(?)
*                    float t - time in seconds
     */
    export type Config = {
        uniforms?: Dict<any>;
        code?: string;
        vertCode?: string;
    }
}

class TextureFilter {
    enabled: boolean;

    private code: string;
    private vertCode: string;
    private uniformCode: string;
    private uniforms: Dict<any>;

    private borrowedPixiFilter: PIXI.Filter;

    constructor(config: TextureFilter.Config) {
        this.code = config.code ?? '';
        this.vertCode = config.vertCode ?? '';
        this.uniformCode = this.constructUniformCode(config.uniforms);
        this.uniforms = this.constructUniforms(config.uniforms);

        this.setUniform('posx', 0);
        this.setUniform('posy', 0);
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

    getCode() {
        return this.code;
    }

    getUniform(uniform: string) {
        return this.uniforms[uniform];
    }

    getUniformCode() {
        return this.uniformCode;
    }

    getVertCode() {
        return this.vertCode;
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

    private constructUniforms(uniformDeclarations: Dict<any>) {
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
        (filter: TextureFilter) => {
            let vert = vertPreUniforms + filter.getUniformCode() + vertStartFunc + filter.getVertCode() + vertEndFunc;
            let frag = fragPreUniforms + filter.getUniformCode() + fragStartFunc + filter.getCode() + fragEndFunc;
            return new PIXI.Filter(vert, frag, {});
        },
        (filter: TextureFilter) => {
            return filter.getUniformCode() + filter.getVertCode() + filter.getCode();
        }
    );

    export class Slice extends TextureFilter {
        constructor(rect: Rect) {
            super({
                uniforms: {
                    'float sliceX': rect.x,
                    'float sliceY': rect.y,
                    'float sliceWidth': rect.width,
                    'float sliceHeight': rect.height,
                },
                code: `
                    if (x < sliceX || x >= sliceX + sliceWidth || y < sliceY || y >= sliceY + sliceHeight) {
                        outp.a = 0.0;
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

    var _sliceFilter: Slice;
    export function SLICE(rect: Rect) {
        if (!_sliceFilter) {
            _sliceFilter = new Slice(rect);
        } else {
            _sliceFilter.setSlice(rect);
        }
        return _sliceFilter;
    }

    const vertPreUniforms = `
        precision highp float;
        attribute vec2 aVertexPosition;
        uniform mat3 projectionMatrix;
        varying vec2 vTextureCoord;
        uniform vec4 inputSize;
        uniform vec4 outputFrame;

        uniform float posx;
        uniform float posy;
        uniform float t;

        float width;
        float height;
    `;

    const vertStartFunc = `
        vec4 filterVertexPosition(void) {
            width = inputSize.x;
            height = inputSize.y;
            vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
            vec2 inp = position - vec2(posx, posy);
            vec2 outp = vec2(inp.x, inp.y);
    `;

    const vertEndFunc = `
            position = outp + vec2(posx, posy);
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

    const fragPreUniforms = `
        precision highp float;
        varying vec2 vTextureCoord;
        uniform vec4 inputSize;
        uniform sampler2D uSampler;

        uniform float posx;
        uniform float posy;
        uniform float t;

        float width;
        float height;
    `;

    const fragStartFunc = `
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

        ${Perlin.SHADER_SOURCE}

        void main(void) {
            width = inputSize.x;
            height = inputSize.y;
            float worldx = vTextureCoord.x * width;
            float worldy = vTextureCoord.y * height;
            float x = worldx - posx;
            float y = worldy - posy;
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
}