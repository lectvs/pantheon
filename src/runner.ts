/// <reference path="./enemy.ts"/>

class Runner extends Enemy {

    constructor(config: Sprite.Config) {
        super({
            bounds: new CircleBounds(0, -4, 8),
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'runner', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'runner', textures: [4, 5, 6, 7], frameRate: 8, count: -1,
                        overrides: {
                            2: { callback: () => { this.world.playSound('walk'); }}
                        }
                }),
            ],
            defaultAnimation: 'idle',
            effects: { outline: { color: 0xFFFFFF } },
            maxHealth: 0.5,
            immuneTime: 0.5,
            weight: 1,
            speed: 50,
            deadTexture: 'runner_dead',
            ...config,
        });

        /* STATES */

        this.stateMachine.addState('idle', {
            update: () => {
                this.playAnimation('idle');
            },
            transitions: [
                { toState: 'run', condition: () => !V.isZero(this.controller.moveDirection) }
            ],
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
                { toState: 'idle', condition: () => V.isZero(this.controller.moveDirection) }
            ],
        });

        this.setState('idle');

        this.behavior = new Runner.RunnerBehavior(this);
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

namespace Runner {
    export class RunnerBehavior extends ActionBehavior {
        constructor(runner: Runner) {
            super('walk', 2);
            let controller = this.controller;

            let getTarget = () => runner.world.select.type(Player);

            /* ACTIONS */

            this.addAction('walk', {
                script: function*() {
                    while (true) {
                        let target = getTarget();
                        controller.moveDirection.x = target.x - runner.x;
                        controller.moveDirection.y = target.y - runner.y;
                        yield;
                    }
                },
                interrupt: true,
                wait: 2,
                nextAction: 'walk',
            });
        }
    }
}