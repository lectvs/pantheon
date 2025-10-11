class Outline2pxFilter extends TextureFilter {
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

    constructor(color: number = 0x000000, alpha: number = 1, matchAlpha: boolean = true) {
        super({
            uniforms: {
                'vec3 color': Color.colorToVec3(color),
                'float alpha': alpha,
                'int matchAlpha': matchAlpha ? 1 : 0,
            },
            visualPadding: 2,
            code: `
                float maxAlphaInner = max(
                    max(
                        getColor(x-upscale, y).a,
                        getColor(x, y-upscale).a
                    ),
                    max(
                        getColor(x+upscale, y).a,
                        getColor(x, y+upscale).a
                    )
                );

                float maxAlphaOuter = max(
                    max(
                        getColor(x-upscale*2.0, y).a,
                        getColor(x, y-upscale*2.0).a
                    ),
                    max(
                        getColor(x+upscale*2.0, y).a,
                        getColor(x, y+upscale*2.0).a
                    )
                );

                float maxAlphaCornersInner = max(
                    max(
                        getColor(x+upscale, y+upscale).a,
                        getColor(x+upscale, y-upscale).a
                    ),
                    max(
                        getColor(x-upscale, y+upscale).a,
                        getColor(x-upscale, y-upscale).a
                    )
                );

                float maxAlphaCornersOuterX = max(
                    max(
                        getColor(x+upscale*2.0, y+upscale).a,
                        getColor(x+upscale*2.0, y-upscale).a
                    ),
                    max(
                        getColor(x-upscale*2.0, y+upscale).a,
                        getColor(x-upscale*2.0, y-upscale).a
                    )
                );

                float maxAlphaCornersOuterY = max(
                    max(
                        getColor(x+upscale, y+upscale*2.0).a,
                        getColor(x+upscale, y-upscale*2.0).a
                    ),
                    max(
                        getColor(x-upscale, y+upscale*2.0).a,
                        getColor(x-upscale, y-upscale*2.0).a
                    )
                );

                float maxAlpha = max(
                    max(
                        max(
                            maxAlphaInner,
                            maxAlphaOuter
                        ),
                        maxAlphaCornersInner
                    ),
                    max(
                        maxAlphaCornersOuterX,
                        maxAlphaCornersOuterY
                    )
                );

                float matchedAlpha = alpha * map(float(matchAlpha), 0.0, 1.0, 1.0, maxAlpha);
                outp = lerp(outp, vec4(color, matchedAlpha), float(inp.a == 0.0 && maxAlpha > 0.0));
            `
        });

        this._color = color;
        this._alpha = alpha;
        this._matchAlpha = matchAlpha;
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