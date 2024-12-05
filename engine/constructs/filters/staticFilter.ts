class StaticFilter extends TextureFilter {
    private _amount: number;
    get amount() { return this._amount; }
    set amount(v) {
        if (v === this._amount) return;
        this._amount = v;
        this.setUniform('amount', v);
    }

    private _blend: number;
    get blend() { return this._blend; }
    set blend(v) {
        if (v === this._blend) return;
        this._blend = v;
        this.setUniform('blend', v);
    }

    constructor(color: number, blend: number = 0) {
        super({
            uniforms: { 'float alpha': 1, 'vec3 color': Color.colorToVec3(color), 'float amount': 1, 'float blend': blend },
            code: `
                if (x >= 0.0 && x < width && y >= 0.0 && y < height) {
                    float v = map(pnoise(x, y, 10.6 + 100.0*t), -1.0, 1.0, 0.0, 1.0);
                    float av = (1.0 - cos(PI*v)) / 2.0;
                    float aav = (1.0 - cos(PI*av)) / 2.0;
                    float al = lerp(alpha, outp.a, blend);
                    outp = lerp(outp, vec4(color * aav, al), amount);
                }
            `
        });

        this._amount = 1;
        this._blend = blend;
    }
}