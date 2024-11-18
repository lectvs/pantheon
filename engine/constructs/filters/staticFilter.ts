class StaticFilter extends TextureFilter {
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
    }
}