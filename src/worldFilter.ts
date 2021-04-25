class WorldFilter extends TextureFilter {
    constructor() {
        super({
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
            `,
        });
    }
}