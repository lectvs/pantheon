class WallFilter extends TextureFilter {
    constructor() {
        super({
            uniforms: {
                'float camx': 0,
                'float camy': 0,
                'float camox': 0,
                'float camoy': 0,
            },
            code: `
                float n = cnoise(vec3((camx + camox + x)/8.0, (camy + camoy + y)/8.0, 0.0));
                if (n >= 0.0) {
                    vec4 gcxp = getColor(x + 1.0, y);
                    vec4 gcxn = getColor(x - 1.0, y);
                    vec4 gcyp = getColor(x, y + 1.0);
                    vec4 gcyn = getColor(x, y - 1.0);
                    if (gcxp.a > 0.0) {
                        outp = gcxp;
                    } else if (gcxn.a > 0.0) {
                        outp = gcxn;
                    } else if (gcyp.a > 0.0) {
                        outp = gcyp;
                    } else if (gcyn.a > 0.0) {
                        outp = gcyn;
                    }
                }
            `,
        });
    }

    update() {
        let cc = global.world.select.type(CameraController, false);
        if (!cc) return;
        this.setUniform('camx', cc.sector.x * global.gameWidth);
        this.setUniform('camy', cc.sector.y * global.gameHeight);

        this.setUniform('camox', global.world.camera.worldOffsetX - global.world.camera.x);
        this.setUniform('camoy', global.world.camera.worldOffsetY - global.world.camera.y);
    }
}