/// <reference path="../lectvs/worldObject/behavior/actionBehavior.ts"/>
/// <reference path="./enemy.ts"/>

class Golbin extends Enemy {
    private readonly bulletSpeed = 100;

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
                Animations.fromTextureList({ name: 'aim', texturePrefix: 'golbin', textures: [8, 9, 10, 11, 10, 11, 10, 11], frameRate: 6, nextFrameRef: 'aim/7' }),
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

        /* STATES */

        this.stateMachine.addState('idle', {
            update: () => {
                this.playAnimation('idle');
            },
            transitions: [
                { toState: 'aim', condition: () => this.controller.attack },
                { toState: 'run', condition: () => !V.isZero(this.controller.moveDirection) },
            ]
        });

        this.stateMachine.addState('run', {
            update: () => {
                this.v = this.controller.moveDirection;
                this.setSpeed(this.speed);
    
                this.playAnimation('run');
                if (this.v.x < 0) this.flipX = true;
                if (this.v.x > 0) this.flipX = false;
            },
            transitions: [
                { toState: 'aim', condition: () => this.controller.attack },
                { toState: 'idle', condition: () => V.isZero(this.controller.moveDirection) },
            ]
        });

        this.stateMachine.addState('aim', {
            update: () => {
                this.playAnimation('aim');
                this.flipX = this.controller.aimDirection.x < 0;
            },
            transitions: [
                { toState: 'shoot', condition: () => !this.controller.attack },
            ]
        });

        this.stateMachine.addState('shoot', {
            callback: () => {
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
            },
            transitions: [
                { toState: 'idle' }
            ]
        });

        this.stateMachine.setState('idle');

        this.behavior = new Golbin.GolbinBehavior(this);
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if (other.physicsGroup === 'walls') {
            this.setState('idle');
            this.behavior.interrupt('walk');
        }
    }

    damage(amount: number) {
        super.damage(amount);

        this.setState('idle');
        this.behavior.interrupt();

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
}

namespace Golbin {
    export class GolbinBehavior extends ActionBehavior {
        constructor(golbin: Golbin) {
            super('walk', 1);
            let controller = this.controller;

            let getTarget = () => golbin.world.select.type(Player);

            /* ACTIONS */

            this.addAction('walk', {
                script: function*() {
                    let targetPos = golbin.pickNextTargetPos(getTarget());

                    while (G.distance(golbin, targetPos) > 4) {
                        controller.moveDirection.x = targetPos.x - golbin.x;
                        controller.moveDirection.y = targetPos.y - golbin.y;
                        yield;
                    }
                },
                interrupt: true,
                wait: () => Random.float(1, 2),
                nextAction: 'shoot',
            });

            this.addAction('shoot', {
                script: function*() {
                    let target = getTarget();

                    yield* S.simul(
                        S.doOverTime(2, t => controller.attack = true),
                        S.doOverTime(2.1, t => {
                            controller.aimDirection.x = target.x - golbin.x;
                            controller.aimDirection.y = target.y - golbin.y;
                        })
                    )();
                },
                interrupt: true,
                wait: () => Random.float(1, 2),
                nextAction: 'walk',
            });
        }
    }
}