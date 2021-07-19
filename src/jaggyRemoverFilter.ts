class JaggyRemoverFilter extends TextureFilter {
    constructor() {
        super({
            code: `
                vec4 gcxp = getColor(x + 1.0, y);
                vec4 gcxn = getColor(x - 1.0, y);
                vec4 gcyp = getColor(x, y + 1.0);
                vec4 gcyn = getColor(x, y - 1.0);
                if (gcxp.a == 0.0 && gcxn.a == 0.0) {
                    outp.a = 0.0;
                }
                if (gcyp.a == 0.0 && gcyn.a == 0.0) {
                    outp.a = 0.0;
                }
            `,
        });
    }
}