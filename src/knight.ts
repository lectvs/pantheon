/// <reference path="./enemy.ts"/>

class Knight extends Enemy {
    light: Sprite;

    constructor(config: Sprite.Config) {
        super({
            bounds: new CircleBounds(0, -4, 8),
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight', textures: [0, 1, 2], frameRate: 8, count: Infinity }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'enemyknight', textures: [4, 5, 6, 7], frameRate: 8, count: Infinity,
                        overrides: {
                            2: { callback: () => { this.world.playSound('walk'); }}
                        }
                }),
                Animations.fromTextureList({ name: 'windup', texturePrefix: 'enemyknight', textures: [8], frameRate: 4, count: Infinity })
            ],
            defaultAnimation: 'idle',
            effects: { outline: { color: 0x000000 } },
            maxHealth: 1.5,
            immuneTime: 0.5,
            weight: 1,
            speed: 100,
            deadTexture: 'enemyknight_dead',
            ...config,
        });

        let knight = this;

        let lightTexture = new AnchoredTexture(0, 0, Texture.filledRect(1024, 16, 0xFFFFFF));
        lightTexture.anchorX = 1/128;
        lightTexture.anchorY = 1/2;

        this.light = this.addChild(new Sprite({
            x: 0, y: -4,
            texture: lightTexture,
            tint: this.tint === 0xFFFFFF ? 0x00FFFF : this.tint - 0xFF0000,
            alpha: 0,
            layer: 'bg'
        }));

        /* STATES */

        this.stateMachine.addState('idle', {
            update: () => {
                this.playAnimation('idle');
                this.light.alpha = 0;
            },
            transitions: [
                { toState: 'aim', condition: () => this.controller.attack },
                { toState: 'run', condition: () => !V.isZero(this.controller.moveDirection) }
            ]
        });

        this.stateMachine.addState('run', {
            update: () => {
                this.v = this.controller.moveDirection;
                this.setSpeed(this.speed);

                this.playAnimation('run');
                if (this.v.x < 0) this.flipX = true;
                if (this.v.x > 0) this.flipX = false;
                this.light.alpha = 0;
            },
            transitions: [
                { toState: 'aim', condition: () => this.controller.attack },
                { toState: 'idle', condition: () => V.isZero(this.controller.moveDirection) },
            ]
        });

        this.stateMachine.addState('aim', {
            script: S.simul(
                S.jumpZ(this, 16, 0.5),
                S.tween(1, this.light, 'alpha', 0, 1),
            ),
            update: () => {
                this.light.angle = M.radToDeg(Math.atan2(this.controller.aimDirection.y, this.controller.aimDirection.x));
                this.light.z = 0;
                this.playAnimation('windup');
                this.flipX = this.controller.aimDirection.x < 0;
            },
            transitions: [
                { toState: 'dash', condition: () => !this.controller.attack }
            ]
        });

        this.stateMachine.addState('dash', {
            script: function*() {
                let lastPos = pt(knight.x, knight.y);
                let target = _.clone(knight.controller.aimDirection);
                if (V.magnitude(target) < 300) V.setMagnitude(target, 300);
                target.x += lastPos.x;
                target.y += lastPos.y;
        
                knight.world.playSound('dash');
                yield* S.tweenPt(0.2, knight, lastPos, target)();
            },
            update: () => {
                this.playAnimation('windup');
                this.light.alpha = 0;
            },
            transitions: [
                { toState: 'idle' }
            ]
        });

        this.setState('idle');

        this.behavior = new Knight.KnightBehavior(this);
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

namespace Knight {
    export class KnightBehavior extends ActionBehavior {
        constructor(knight: Knight) {
            super('walk', 1);
            let controller = this.controller;

            let getTarget = () => knight.world.select.type(Player);

            /* ACTIONS */

            this.addAction('walk', {
                script: function*() {
                    let targetPos = knight.pickNextTargetPos(getTarget());

                    while (G.distance(knight, targetPos) > 4) {
                        controller.moveDirection.x = targetPos.x - knight.x;
                        controller.moveDirection.y = targetPos.y - knight.y;
                        yield;
                    }
                },
                interrupt: true,
                wait: () => Random.float(1, 2),
                nextAction: 'dash',
            });

            this.addAction('dash', {
                script: function*() {
                    let target = getTarget();

                    controller.attack = true;

                    yield* S.doOverTime(1.5, t => {
                        controller.aimDirection.x = target.x - knight.x;
                        controller.aimDirection.y = target.y - knight.y;
                    })();

                    yield* S.wait(1.5)();

                    controller.attack = false;
                },
                interrupt: true,
                wait: () => Random.float(1, 2),
                nextAction: 'walk',
            });
        }
    }
}