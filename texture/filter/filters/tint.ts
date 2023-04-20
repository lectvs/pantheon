namespace TextureFilters {
    export class Tint extends TextureFilter {
        private _tint: number;
        get tint() { return this._tint; }
        set tint(v) {
            if (v === this._tint) return;
            this._tint = v;
            this.setUniform('tint', M.colorToVec3(v));
        }

        constructor(tint: number) {
            super({
                uniforms: { 'vec3 tint': M.colorToVec3(tint) },
                code: `outp.rgb = inp.rgb * tint;`,
            });

            this._tint = tint;
        }
    }
}