/// <reference path="./enemy.ts"/>

class Bomb extends Enemy {
    private dinkSound: Sound;

    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'bomb',
            effects: {
                silhouette: { enabled: false, color: 0xFFFFFF },
            },
            bounds: { type: 'circle', x: 0, y: -12, radius: 12 },
            gravityz: -100,
            mass: 1000,
            colliding: false,

            maxHealth: Infinity,
            immuneTime: 0.01,
            weight: 0.3,
        });

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
        this.world.addWorldObject(<Sprite.Config>{
            constructor: Explosion,
            x: this.x, y: this.y - 12,
            layer: 'fg',
        });
        this.world.playSound('explode').volume = 0.5;
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if (other instanceof Throne) {
            this.explode();
        }
    }
}