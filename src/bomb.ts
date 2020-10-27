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

        this.stateMachine.addState('start', {
            script: S.wait(0.1),
            transitions: [{ type: 'instant', toState: 'slowdet' }],
        });

        this.stateMachine.addState('slowdet', {
            callback: () => {
                this.colliding = true;
            },
            script: S.loopFor(24, S.chain(
                S.call(() => {
                    this.effects.silhouette.enabled = !this.effects.silhouette.enabled;
                }),
                S.wait(0.25),
            )),
            transitions: [{ type: 'instant', toState: 'quickdet' }],
        });

        this.stateMachine.addState('quickdet', {
            script: S.loopFor(60, S.chain(
                S.call(() => {
                    this.effects.silhouette.enabled = !this.effects.silhouette.enabled;
                }),
                S.wait(0.05),
            )),
            transitions: [{ type: 'instant', toState: 'explode' }],
        });

        this.stateMachine.addState('explode', {
            callback: () => this.explode(),
        });

        this.setState('start');
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

        let explosion = this.world.addWorldObject(new Explosion());
        explosion.x = this.x;
        explosion.y = this.y - 12;
        World.Actions.setLayer(explosion, 'fg');

        this.world.playSound('explode').volume;
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if (other instanceof Throne) {
            this.explode();
        }
    }
}