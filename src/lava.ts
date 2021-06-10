class Lava extends Sprite {
    constructor(tx: number, ty: number, tw: number, th: number) {
        super({
            x: tx*16, y: ty*16,
            texture: Texture.filledRect(tw*16, th*16, 0xFF6A00),
            effects: { post: { filters: [new Lava.LavaFilter()] } },
            layer: 'water',
            physicsGroup: 'walls',
            bounds: new RectBounds(0, 0, tw*16, th*16),
            tags: ['deadly', 'no_grapple'],
        });
    }
}

namespace Lava {
    export class LavaFilter extends TextureFilter {
        constructor() {
            super({
                code: `
                    float xx = x + (sin(2.0*t+4.0) + 4.0) * cnoise(vec3(y/10.0 - t, 0.0, 0.0));
                    float yy = y + (sin(2.0*t) + 4.0) * cnoise(vec3(x/10.0, t, 0.0));
                    outp = getColor(xx, yy);
                `
            });
        }
    }
}