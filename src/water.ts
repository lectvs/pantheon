class Water extends Sprite {
    constructor(tx: number, ty: number, tw: number, th: number) {
        super({
            x: tx*16, y: ty*16,
            texture: Texture.filledRect(tw*16, th*16, 0x00C6FF),
            alpha: 0.6,
            effects: { post: { filters: [new Water.WaterFilter()] } },
            layer: 'water',
            physicsGroup: 'water',
            bounds: new RectBounds(0, 0, tw*16, th*16),
        });
    }
}

namespace Water {
    export class WaterFilter extends TextureFilter {
        constructor() {
            super({
                code: `
                    outp = getColor(x, y + (sin(2.0*t) + 4.0) * cnoise(vec3(x/10.0, t, 0.0)));
                `
            });
        }
    }
}