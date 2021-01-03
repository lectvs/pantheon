class Throne extends Enemy {
    king: Sprite;
    light: Sprite;

    private dinkSound: Sound;

    constructor(config: Sprite.Config) {
        super({
            texture: 'throne',
            bounds: new RectBounds(-15, -24, 30, 24),
            mass: 10000,
            maxHealth: 1003,
            immuneTime: 0.5,
            weight: 10,
            speed: 0,
            damagableByHoop: false,
            hasNormalShadow: false,
            ...config,
        });

        let throne = this;

        this.shadow = this.addChild(new Sprite({
            x: -15, y: -22,
            texture: Texture.filledRect(30, 24, 0x000000, 0.5),
            layer: 'king_shadow_start'
        }));

        let lightTexture = new AnchoredTexture(0, 0, Texture.filledRect(1024, 64, 0xFFFFFF));
        lightTexture.anchorX = 1/32;
        lightTexture.anchorY = 1/2;

        this.light = this.addChild(new Sprite({
            x: 0, y: -12,
            texture: lightTexture,
            tint: 0xFF0000,
            alpha: 0,
            layer: 'bg'
        }));

        this.king = this.addChild(new King(this, {
            x: 0, y: 0, z: 20,
            matchParentLayer: true
        }));

        this.stateMachine.addState('passive', {
            update: () => {
                this.colliding = false;
            },
            transitions: [
                { toState: 'big_jump', condition: () => this.controller.jump },
            ]
        });

        this.stateMachine.addState('idle', {
            update: () => {
                this.z = 0;
                this.colliding = true;
                this.light.alpha = 0;
            },
            transitions: [
                { toState: 'aim', condition: () => this.controller.attack },
                { toState: 'big_jump', condition: () => this.controller.jump },
                { toState: 'small_jump', condition: () => !V.isZero(this.controller.moveDirection) },
            ]
        });

        this.stateMachine.addState('small_jump', {
            script: function*() {
                let lastPos = pt(throne.x, throne.y);
                let targetPos = pt(throne.x + throne.controller.moveDirection.x, throne.y + throne.controller.moveDirection.y);

                let s = throne.world.playSound('dash');
                s.volume = 0.4;
                throne.colliding = false;

                yield S.simul(
                    S.tweenPt(1, throne, lastPos, targetPos),
                    S.jumpZ(throne, 100, 1),
                );

                s = throne.world.playSound('land');
                s.speed = 1.5;
                s.volume = 0.7;
                throne.colliding = true;
            },
            transitions: [
                { toState: 'idle' }
            ]
        });

        this.stateMachine.addState('big_jump', {
            script: function*() {
                let lastPos = pt(throne.x, throne.y);
                let targetPos = pt(throne.x + throne.controller.moveDirection.x, throne.y + throne.controller.moveDirection.y);

                let s = throne.world.playSound('dash');
                s.volume = 0.6;
                throne.colliding = false;

                yield S.tween(1, throne, 'z', 0, 500);
                yield S.tweenPt(1, throne, lastPos, targetPos);
                yield S.tween(1, throne, 'z', 500, 0);
                
                throne.world.playSound('land');
                throne.colliding = true;
            },
            transitions: [
                { toState: 'idle' }
            ]
        });

        this.stateMachine.addState('aim', {
            script: S.tween(1, this.light, 'alpha', 0, 1),
            update: () => {
                this.light.angle = M.radToDeg(Math.atan2(this.controller.aimDirection.y, this.controller.aimDirection.x));
                this.light.z = 0;
            },
            transitions: [
                { toState: 'dash', condition: () => !this.controller.attack }
            ]
        });

        this.stateMachine.addState('dash', {
            script: function*() {
                let lastPos = pt(throne.x, throne.y);
                let target = _.clone(throne.controller.aimDirection);
                if (V.magnitude(target) < 200) V.setMagnitude(target, 200);
                target.x += lastPos.x;
                target.y += lastPos.y;

                throne.light.alpha = 0;
                throne.world.playSound('dash');

                yield S.simul(
                    S.tweenPt(0.1, throne, lastPos, target),
                    S.chain(
                        S.wait(0.05),
                        S.call(() => throne.spawnBomb())
                    )
                );
            },
            transitions: [
                { toState: 'idle' }
            ]
        });

        this.setState('passive');
    }

    update() {
        super.update();

        let player = this.world.select.type(Player);

        if (player.x < this.king.x) this.king.flipX = true;
        if (player.x > this.king.x) this.king.flipX = false;

        this.shadow.z = 0;

        this.king.effects.silhouette.color = this.effects.silhouette.color;
        this.king.effects.silhouette.enabled = this.effects.silhouette.enabled;

        if (this.health === 1001) {
            this.tint = 0xFF0000;
            this.king.tint = 0xFF0000;
            this.timeScale = 2;
        } else if (this.health === 1002) {
            this.tint = 0xFF8888;
            this.king.tint = 0xFF8888;
            this.timeScale = 1.5;
        } else if (this.health === 1003) {
            this.tint = 0xFFFFFF;
            this.king.tint = 0xFFFFFF;
            this.timeScale = 1;
        } else {
            this.timeScale = 1;
        }
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if (other.physicsGroup === 'walls' && this.state === 'dash') {
            this.setState('idle');
            this.behavior.interrupt('dash');
        }

        if (other instanceof Hoop && other.isStrongEnoughToDealDamage() && (!this.dinkSound || this.dinkSound.done)) {
            this.dinkSound = this.world.playSound('dink');
            this.dinkSound.volume = other.currentAttackStrength;
        }
    }

    damage(amount: number) {
        super.damage(amount);

        let loops = 8;
        if (this.health <= 1000) {
            loops = Infinity;
        }

        this.runScript(S.chain(
            S.call(() => {
                this.effects.addSilhouette.color = 0xFFFFFF;
            }),
            S.loopFor(loops, S.chain(
                S.wait(this.immuneTime/8),
                S.call(() => {
                    this.effects.silhouette.enabled = !this.effects.silhouette.enabled;
                })
            )),
            S.call(() => {
                this.effects.silhouette.enabled = false;
            }),
        ));

        this.setState('idle');
    }

    activate() {
        this.behavior = new Throne.ThroneBehavior(this);
    }

    spawnBomb() {
        this.world.addWorldObject(new Bomb({
            x: this.x, y: this.y, z: 50,
            layer: this.layer,
            physicsGroup: 'bombs'
        }));
    }

    pickSmallJumpTargetPos() {
        let candidates = A.range(20).map(i => {
            let d = Random.inDisc(64, 128);
            d.x += this.x;
            d.y += this.y;
            return d;
        }).filter(pos => 64 <= pos.x && pos.x <= 706 && 338 <= pos.y && pos.y <= 704);

        if (!_.isEmpty(candidates)) {
            return Random.element(candidates);
        }

        return pt(384, 480);
    }

    pickBigJumpTargetPos() {
        return pt(Random.float(64, 706), Random.float(338, 704));
    }
}

namespace Throne {
    export class ThroneBehavior extends ActionBehavior {
        constructor(throne: Throne) {
            super('small_jump_1', 3);
            let controller = this.controller;

            let getTarget = () => throne.world.select.type(Player);
            
            /* ACTIONS */

            this.addAction('small_jump_1', {
                script: S.call(() => {
                    let targetPos = throne.pickSmallJumpTargetPos();

                    controller.moveDirection.x = targetPos.x - throne.x;
                    controller.moveDirection.y = targetPos.y - throne.y;
                }),
                wait: 2,
                nextAction: 'small_jump_2'
            });

            this.addAction('small_jump_2', {
                script: S.call(() => {
                    let targetPos = throne.pickSmallJumpTargetPos();

                    controller.moveDirection.x = targetPos.x - throne.x;
                    controller.moveDirection.y = targetPos.y - throne.y;
                }),
                wait: 2,
                nextAction: 'big_jump'
            });

            this.addAction('big_jump', {
                script: S.call(() => {
                    let targetPos = throne.pickBigJumpTargetPos();

                    controller.moveDirection.x = targetPos.x - throne.x;
                    controller.moveDirection.y = targetPos.y - throne.y;
                    controller.jump = true;
                }),
                wait: 4,
                nextAction: 'dash'
            });

            this.addAction('dash', {
                script: function*() {
                    let target = getTarget();

                    controller.attack = true;

                    yield S.doOverTime(1, t => {
                        controller.aimDirection.x = target.x - throne.x;
                        controller.aimDirection.y = target.y - throne.y;
                    });

                    yield S.wait(1);

                    controller.attack = false;
                },
                interrupt: true,
                nextAction: 'vulnerable'
            });

            this.addAction('vulnerable', {
                script: S.chain(
                    S.wait(1),
                    S.waitUntil(() => _.isEmpty(throne.world.select.typeAll(Bomb))),
                ),
                wait: 3,
                nextAction: 'small_jump_1'
            })
        }
    }
}