/// <reference path="./enemy.ts"/>

class Bomb extends Enemy {
    constructor(config: Sprite.Config) {
        super({
            texture: 'bomb',
            effects: { silhouette: { color: 0xFFFFFF, enabled: false } },
            bounds: new CircleBounds(0, -12, 12),
            gravityz: -100,
            mass: 1000,
            colliding: false,
            maxHealth: Infinity,
            immuneTime: 0.01,
            weight: 0.3,
            speed: 0,
            ...config,
        });

        this.runScript(S.chain(
            S.wait(0.1),
            S.call(() => this.colliding = true),
            S.loopFor(24, S.chain(
                S.call(() => this.effects.silhouette.enabled = !this.effects.silhouette.enabled),
                S.wait(0.25),
            )),
            S.loopFor(60, S.chain(
                S.call(() => this.effects.silhouette.enabled = !this.effects.silhouette.enabled),
                S.wait(0.05),
            )),
            S.call(() => this.explode()),
        ));
    }

    update() {
        super.update();

        if (this.z < 0) {
            this.z = 0;
            this.vz = -0.5 * this.vz;
        }
    }

    explode() {
        this.alive = false;

        this.world.addWorldObject(new Explosion({
            x: this.x,
            y: this.y - 12,
            layer: 'fg'
        }));
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if (other instanceof Throne) {
            this.explode();
        }
    }
}