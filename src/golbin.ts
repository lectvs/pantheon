/// <reference path="./enemy.ts"/>

class Golbin extends Enemy {
    private readonly bulletSpeed = 100;

    get aiming() { return this.getCurrentAnimationName() === 'aim' || this.getCurrentAnimationName() === 'aim_hold'; }

    constructor(config: Sprite.Config) {
        super({
            bounds: new CircleBounds(0, -4, 8),
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'golbin', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'golbin', textures: [4, 5, 6, 7], frameRate: 8, count: -1,
                        overrides: {
                            2: { callback: () => { this.world.playSound('walk'); }}
                        }
                }),
                Animations.fromTextureList({ name: 'aim', texturePrefix: 'golbin', textures: [8, 9, 10, 11, 10, 11, 10], frameRate: 6, nextFrameRef: 'aim_hold/0' }),
                Animations.fromTextureList({ name: 'aim_hold', texturePrefix: 'golbin', textures: [11], frameRate: 1, count: Infinity, }),
            ],
            defaultAnimation: 'idle',
            effects: { outline: { color: 0x000000 } },
            maxHealth: 1.2,
            immuneTime: 0.5,
            weight: 1,
            speed: 100,
            deadTexture: 'golbin_dead',
            ...config,
        });

        this.stateMachine = new Golbin.GolbinBehavior(this);
    }

    update() {
        super.update();

        if (this.controller.attack && !this.aiming) this.aim();
        if (!this.controller.attack && this.aiming) this.shoot();

        if (this.immune) {
            this.playAnimation('idle');
        } else if (!V.isZero(this.controller.moveDirection)) {
            this.v = this.controller.moveDirection;
            this.setSpeed(this.speed);

            this.playAnimation('run');
            if (this.v.x < 0) this.flipX = true;
            if (this.v.x > 0) this.flipX = false;
        } else if (this.aiming) {
            this.flipX = this.controller.aimDirection.x < 0;
        } else {
            this.playAnimation('idle');
        }
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if (other.physicsGroup === 'walls') {
            this.setState('idle1');
        }
    }

    damage(amount: number) {
        super.damage(amount);

        this.interruptShot();
        this.setState('idle1');

        this.runScript(S.chain(
            S.call(() => {
                this.effects.silhouette.color = 0xFFFFFF;
                this.effects.silhouette.enabled = true;
            }),
            S.loopFor(8, S.chain(
                S.wait(this.immuneTime/8),
                S.call(() => {
                    this.effects.silhouette.enabled = !this.effects.silhouette.enabled;
                })
            )),
            S.call(() => {
                this.effects.silhouette.enabled = false;
            }),
        ));
    }

    private aim() {
        this.playAnimation('aim', true);
    }

    private shoot() {
        let bullet = this.world.addWorldObject(new Bullet({
            x: this.x,
            y: this.y - 4,
            v: this.controller.aimDirection,
            name: 'bullet',
            layer: this.layer,
            physicsGroup: 'bullets',
        }));
        bullet.setSpeed(this.bulletSpeed);

        this.world.playSound('shoot');

        this.playAnimation('idle', true);
    }

    private interruptShot() {
        this.playAnimation('idle');
    }
}

namespace Golbin {
    export class GolbinBehavior extends StateMachine {
        private golbin: Golbin;

        constructor(golbin: Golbin) {
            super();

            this.golbin = golbin;

            let b = this;
            this.addState('start', { transitions: [{ delay: Random.float(0, 1), toState: 'idle1' }] });

            this.addState('idle1', {
                callback: () => {
                    golbin.controller.moveDirection.x = 0;
                    golbin.controller.moveDirection.y = 0;
                },
                transitions: [{ delay: Random.float(0.8, 1.2), toState: 'walk' }]
            });

            this.addState('walk', {
                script: function*() {
                    let targetPos = golbin.pickNextTargetPos(b.getTarget());

                    while (G.distance(b.golbin, targetPos) > 4) {
                        golbin.controller.moveDirection.x = targetPos.x - golbin.x;
                        golbin.controller.moveDirection.y = targetPos.y - golbin.y;
                        yield;
                    }
                },
                transitions: [{ toState: 'idle2' }]
            });

            this.addState('idle2', {
                callback: () => {
                    b.golbin.controller.moveDirection.x = 0;
                    b.golbin.controller.moveDirection.y = 0;
                },
                transitions: [{ delay: Random.float(0.8, 1.2), toState: 'shoot' }]
            });

            this.addState('shoot', {
                script: function*() {
                    let target = b.getTarget();
                    yield* S.doOverTime(2, t => {
                        golbin.controller.attack = true;
                        golbin.controller.aimDirection.x = target.x - golbin.x;
                        golbin.controller.aimDirection.y = target.y - golbin.y;
                    })();
                    golbin.controller.attack = false;
                    golbin.controller.aimDirection.x = target.x - golbin.x;
                    golbin.controller.aimDirection.y = target.y - golbin.y;
                },
                transitions: [{ toState: 'idle1' }]
            });

            this.setState('start');
        }

        private getTarget() {
            return this.golbin.world.select.type(Player);
        }
    }
}