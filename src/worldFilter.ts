class WorldFilter extends TextureFilter {
    constructor() {
        super({
            uniforms: [],
            code: `
                if (inp.a == 1.0 && (
                       getColor(x-1.0, y).a == 0.0
                    || getColor(x+1.0, y).a == 0.0
                    || getColor(x, y-1.0).a == 0.0
                    || getColor(x, y+1.0).a == 0.0
                    || getColor(x+1.0, y+1.0).a == 0.0
                    || getColor(x+1.0, y-1.0).a == 0.0
                    || getColor(x-1.0, y+1.0).a == 0.0
                    || getColor(x-1.0, y-1.0).a == 0.0
                    )) {
                    outp = vec4(1.0, 1.0, 1.0, 1.0);
                }

                float amount = 1.0 / (1.0 + exp(-(y - 100.0)/20.0)) + (sin(5.0*y) + 1.0) / 4.0;
                if (amount < 0.5) {
                    outp.a = 0.0;
                }
            `,
        });
    }
}