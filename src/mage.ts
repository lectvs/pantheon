/// <reference path="./enemy.ts"/>

class Mage extends Enemy {

    private currentSpawn: WorldObject;

    constructor(config: Sprite.Config) {
        super({
            bounds: new CircleBounds(0, -4, 8),
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'mage', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                        Animations.fromTextureList({ name: 'run', texturePrefix: 'mage', textures: [4, 5], frameRate: 4, count: -1,
                        overrides: {
                            2: { callback: () => { this.world.playSound('walk'); }}
                        }
                }),
                Animations.fromTextureList({ name: 'wave', texturePrefix: 'mage', textures: [8, 9], frameRate: 2, count: -1 })
            ],
            defaultAnimation: 'idle',
            effects: { outline: { color: 0x000000 } },
            maxHealth: 1,
            immuneTime: 0.5,
            weight: 1,
            speed: 70,
            deadTexture: 'mage_dead',
            ...config,
        });

        /* STATES */

        this.stateMachine.addState('idle', {
            update: () => {
                this.effects.outline.color = 0x000000;
                this.playAnimation('idle');
            },
            transitions: [
                { toState: 'summon', condition: () => this.controller.attack },
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
                { toState: 'summon', condition: () => this.controller.attack },
                { toState: 'idle', condition: () => V.isZero(this.controller.moveDirection) },
            ]
        });

        this.stateMachine.addState('summon', {
            script: S.chain(
                S.call(() => {
                    let target_d = Random.inDisc(16, 32);
                    this.currentSpawn = this.world.addWorldObject(spawn(new Runner({
                        x: this.x + target_d.x, y: this.y + target_d.y,
                        layer: 'main',
                        physicsGroup: 'enemies'
                    })));
                }),
                S.doOverTime(1, t => this.effects.outline.color = M.vec3ToColor([0, t, t])),
                S.wait(1),
                S.doOverTime(0.2, t => this.effects.outline.color = M.vec3ToColor([0, 1-t, 1-t])),
            ),
            update: () => {
                this.playAnimation('wave');
            },
            transitions: [
                { toState: 'idle' },
            ]
        });

        this.stateMachine.setState('idle');

        this.behavior = new Mage.MageBehavior(this);
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

        if (this.currentSpawn) {
            this.currentSpawn.kill();
            this.currentSpawn = undefined;
        }
    }
}

namespace Mage {
    export class MageBehavior extends ActionBehavior {
        constructor(mage: Mage) {
            super('walk', 1);
            let controller = this.controller;

            let getTarget = () => mage.world.select.type(Player);

            /* ACTIONS */

            this.addAction('walk', {
                script: function*() {
                    let targetPos = mage.pickNextTargetPos(getTarget());

                    while (G.distance(mage, targetPos) > 4) {
                        controller.moveDirection.x = targetPos.x - mage.x;
                        controller.moveDirection.y = targetPos.y - mage.y;
                        yield;
                    }
                },
                interrupt: true,
                wait: () => Random.float(1, 2),
                nextAction: () => {
                    if (mage.world.select.typeAll(Runner).length >= MAX_RUNNERS) return 'walk';
                    return 'summon';
                },
            });

            this.addAction('summon', {
                script: function*() {
                    controller.attack = true;
                    yield; yield;
                    while (mage.state === 'summon') {
                        yield;
                    }
                    controller.attack = false;
                },
                wait: () => Random.float(2, 3),
                nextAction: 'walk',
            });
        }
    }

    const MAX_RUNNERS = 4;
}