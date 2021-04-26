class Puff extends Sprite {

    private scale: number;

    constructor(scale: number, config: Sprite.Config) {
        super({
            texture: AnchoredTexture.fromBaseTexture(Texture.filledCircle(24, 0xFFFFFF), 0.55, 0.55),
            scaleX: scale,
            scaleY: scale,
            layer: 'puffs',
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
        let result: Puff[] = [];
        for (let i = 0; i < count; i++) {
            result.push(world.addWorldObject(new Puff(0.1, { x, y, v: v() })));
        }
        return result;
    }

    export function puffDirection(world: World, x: number, y: number, count: number, direction: Direction2D, speed: number, spread: number) {
        return puff(world, x, y, count, () => {
            let v = V.withMagnitude({ x: direction.h, y: direction.v }, speed);
            let spreadv = Random.inCircle(spread);
            v.x += spreadv.x;
            v.y += spreadv.y;
            return v;
        });
    }

    export function puffWater(world: World, x: number, y: number, direction: Direction2D) {
        let puffs = puffDirection(world, x, y, 20, direction, 50, 50);
        for (let puff of puffs) {
            puff.tint = 0x00C6FF;
            puff.alpha = 0.6;
        }
        return puffs;
    }
}