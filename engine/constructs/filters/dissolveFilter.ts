/// <reference path="../../texture/filter/textureFilter.ts" />

class DissolveFilter extends TextureFilter {
    private _scaleX: number;
    get scaleX() { return this._scaleX; }
    set scaleX(v) {
        if (v === this._scaleX) return;
        this._scaleX = v;
        this.setUniform('scaleX', v);
    }

    private _scaleY: number;
    get scaleY() { return this._scaleY; }
    set scaleY(v) {
        if (v === this._scaleY) return;
        this._scaleY = v;
        this.setUniform('scaleY', v);
    }
    
    private _amount: number;
    get amount() { return this._amount; }
    set amount(v) {
        if (v === this._amount) return;
        this._amount = v;
        this.setUniform('amount', v);
    }
    
    constructor(scaleX: number = 1, scaleY: number = 1) {
        super({
            uniforms: { 'float scaleX': scaleX, 'float scaleY': scaleY, 'float amount': 0 },
            code: `
                float p = pnoise01(x / scaleX + 3.4, y / scaleY + 41.5, 0.3);
                outp.a *= step(amount, p);
            `
        });

        this._scaleX = scaleX;
        this._scaleY = scaleY;
        this._amount = 0;
    }
}