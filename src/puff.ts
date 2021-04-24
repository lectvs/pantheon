class Puff extends Sprite {

    private scale: number;

    constructor(scale: number, config: Sprite.Config) {
        super({
            texture: AnchoredTexture.fromBaseTexture(Texture.filledCircle(24, 0xFFFFFF), 0.55, 0.55),
            scaleX: scale,
            scaleY: scale,
            life: 0.5,
            ...config
        });
        this.scale = scale;
    }

    update() {
        super.update();
        this.scaleX = this.scaleY = this.scale * (1 - Math.pow(this.life.progress, 2));
    }
}

namespace Puff {
    export function puff(world: World, x: number, y: number, count: number, v: Factory<Pt>) {
        for (let i = 0; i < count; i++) {
            world.addWorldObject(new Puff(0.1, { x, y, v: v() }))
        }
    }
}