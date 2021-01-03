/// <reference path="../lectvs/worldObject/behavior/actionBehavior.ts"/>
/// <reference path="./enemy.ts"/>

class Jester extends Enemy {
    private readonly ballSpeed = 70;

    private leg: boolean;

    constructor(config: Sprite.Config) {
        super({
            bounds: new CircleBounds(0, -4, 8),
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'jester', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'jump_right', texturePrefix: 'jester', textures: [5], frameRate: 4, count: -1 }),
                Animations.fromTextureList({ name: 'jump_left', texturePrefix: 'jester', textures: [7], frameRate: 4, count: -1 }),
                Animations.fromTextureList({ name: 'aim', texturePrefix: 'jester', textures: [8, 9], frameRate: 4, count: 3, nextFrameRef: 'aim/1' }),
                Animations.fromTextureList({ name: 'throw', texturePrefix: 'jester', textures: [10, 10, 10, 10], frameRate: 4 }),
            ],
            defaultAnimation: 'idle',
            effects: { outline: { color: 0x000000 } },
            maxHealth: 1.2,
            immuneTime: 0.5,
            weight: 1,
            speed: 100,
            deadTexture: 'jester_dead',
            ...config,
        });

        this.leg = false;

        /* STATES */
        let jester = this;

        this.stateMachine.addState('idle', {
            update: () => {
                this.playAnimation('idle');
                this.z = 0;
            },
            transitions: [
                { toState: 'aim', condition: () => this.controller.attack },
                { toState: 'run', condition: () => !V.isZero(this.controller.moveDirection) },
            ]
        });

        this.stateMachine.addState('run', {
            update: () => {
                let flipped = this.leg !== this.flipX; // !== is xor
                this.playAnimation(`jump_${flipped ? 'right': 'left'}`);
            },
            script: function*() {
                jester.leg = !jester.leg;

                let lastPos = pt(jester.x, jester.y);
                let dir = pt(jester.controller.moveDirection);
                V.clampMagnitude(dir, 16);
                let targetPos = pt(jester.x + dir.x, jester.y + dir.y);

                jester.flipX = targetPos.x - lastPos.x < 0;

                let jumpTime = 0.5;
                yield S.simul(
                    S.tweenPt(jumpTime, jester, lastPos, targetPos),
                    S.jumpZ(jester, 16, jumpTime),
                );
            },
            transitions: [
                { toState: 'idle' },
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
                for (let angle = -1; angle <= 1; angle++) {
                    let ball = this.world.addWorldObject(new Ball({
                        x: this.x,
                        y: this.y,
                        v: V.rotated(this.controller.aimDirection, Math.PI/6 * angle),
                        z: 8,
                        vz: 60,
                        name: 'ball',
                        layer: this.layer,
                        physicsGroup: 'balls',
                    }));
                    ball.setSpeed(this.ballSpeed);
                    ball.makesExplosionSound = (angle === 0);
                }
        
                this.world.playSound('shoot');
            },
            script: S.playAnimation(this, 'throw'),
            transitions: [
                { toState: 'idle' }
            ]
        });

        this.stateMachine.setState('idle');

        this.behavior = new Jester.JesterBehavior(this);
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
    }
}

namespace Jester {
    export class JesterBehavior extends ActionBehavior {
        constructor(jester: Jester) {
            super('walk', 1);
            let controller = this.controller;

            let getTarget = () => jester.world.select.type(Player);

            /* ACTIONS */

            this.addAction('walk', {
                script: function*() {
                    let targetPos = jester.pickNextTargetPos(getTarget());

                    while (G.distance(jester, targetPos) > 8) {
                        controller.moveDirection.x = targetPos.x - jester.x;
                        controller.moveDirection.y = targetPos.y - jester.y;
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

                    controller.attack = true;

                    yield S.doOverTime(1, t => {
                        controller.aimDirection.x = target.x - jester.x;
                        controller.aimDirection.y = target.y - jester.y;
                    });

                    controller.attack = false;
                },
                interrupt: true,
                wait: () => Random.float(1, 2),
                nextAction: 'walk',
            });
        }
    }
}