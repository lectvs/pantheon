/// <reference path="../../worldObject/sprite/sprite.ts" />

class Explosion extends Sprite {
    constructor(x: number, y: number, radius: number) {
        super({
            x, y,
            texture: Textures.filledCircle(radius, 0xFFFFFF),
            tint: 0x000000,
        });

        let explosion = this;
        this.runScript(function*() {
            yield 0.1;
            explosion.tint = 0xFFFFFF;
            yield 0.2;
            explosion.kill();
        });
    }
}