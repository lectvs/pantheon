/// <reference path="./enemy.ts"/>

class Bomb extends Enemy {
    constructor() {
        super({
            maxHealth: Infinity,
            immuneTime: 0.01,
            weight: 0.3,
            speed: 0,
        });

        this.setTexture('bomb');
        this.effects.silhouette.color = 0xFFFFFF;
        this.effects.silhouette.enabled = false;

        this.bounds = new CircleBounds(0, -12, 12, this);

        this.gravityz = -100;
        this.mass = 1000;
        this.colliding = false;

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

        let explosion = this.world.addWorldObject(new Explosion(), {
            layer: 'fg'
        });
        explosion.x = this.x;
        explosion.y = this.y - 12;
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if (other instanceof Throne) {
            this.explode();
        }
    }
}