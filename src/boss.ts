/// <reference path="./player.ts" />

class Boss extends Player {
    private readonly SHOT_SPEED = 200;
    private readonly KNOCKBACK_SPEED = 200;

    get startedFighting() { return this.dead || this.behavior instanceof Boss.BossBehavior; }

    health: number = 5;
    
    private glitchFilter: Boss.BossGlitchFilter;

    constructor(tx: number, ty: number) {
        super(tx, ty);

        this.layer = 'entities';
        this.physicsGroup = 'enemies';

        this.glitchFilter = new Boss.BossGlitchFilter();
        this.effects.updateFromConfig({ post: { filters: [new Boss.BossFilter(), this.glitchFilter] } });

        this.behavior = new NullBehavior();

        this.grappleColor = 0x00FF00;

        this.tags.push('deadly');
    }

    startFighting() {
        this.behavior = new Boss.BossBehavior(this);
    }

    update() {
        super.update();

        if (this.controller.attack) {
            this.shoot();
        }
    }

    shoot() {
        let dir = this.controller.aimDirection.normalized();
        let off = 10;
        this.world.addWorldObject(new Cannonball(this.x + dir.x*off, this.y + dir.y*off, dir.withMagnitude(this.SHOT_SPEED)));
        this.world.playSound('cannonshoot');
        this.v = dir.scaled(-1).withMagnitude(this.KNOCKBACK_SPEED);
    }

    damage(direction: Vector2) {
        this.v.x += direction.x * this.KNOCKBACK_SPEED;
        this.v.y += direction.y * this.KNOCKBACK_SPEED;
        let oppdir = new Vector2(-direction.x, -direction.y);
        Puff.puffDirection(this.world, this.x, this.y, 5, oppdir, 50, 50);
        this.behavior.interrupt();

        this.health--;
        if (this.health <= 0) {
            this.dead = true;
            this.removeTag('deadly');
            this.behavior = new NullBehavior();
        }

        let boss = this;
        if (this.dead) {
            this.runScript(function*() {
                boss.playGlitchSound(0.5);
                boss.glitchFilter.amount = 1;
                yield S.wait(0.5);

                while (true) {
                    boss.playGlitchSound(Random.float(0.1, 0.5));
                    yield S.wait(Random.float(0.2, 0.35));
                }
            })
        } else {
            this.runScript(function*() {
                boss.playGlitchSound(0.5);
                boss.glitchFilter.amount = 1;
                yield S.wait(0.5);
                boss.glitchFilter.amount = 0;
            })
        }
    }
}

namespace Boss {
    export class BossBehavior extends ActionBehavior {
        constructor(boss: Boss) {
            super('start', 0);
            let controller = this.controller;

            let nextAction = () => {
                if (boss.x < boss.world.width/2) {
                    return Random.element(['grappleright', 'attackright']);
                } else {
                    return Random.element(['grappleleft', 'attackleft']);
                }
            };

            this.addAction('start', {
                interrupt: 'interrupt',
                wait: 0.5,
                nextAction: 'grappleright'
            });

            this.addAction('interrupt', {
                script: function*() {
                    controller.up = true;
                    yield S.wait(1);
                    controller.up = false;
                    yield S.wait(0.5);

                    if (boss.x < boss.world.width/2) {
                        controller.right = true;
                        yield S.wait(0.3);
                        controller.right = false;
                    } else {
                        controller.left = true;
                        yield S.wait(0.3);
                        controller.left = false;
                    }
                },
                interrupt: 'interrupt',
                wait: 0.5,
                nextAction: nextAction
            })

            this.addAction('grappleleft', {
                script: function*() {
                    controller.left = true;
                    yield S.wait(0.7);
                    controller.left = false;
                },
                interrupt: 'interrupt',
                wait: 1,
                nextAction: nextAction
            });

            this.addAction('grappleright', {
                script: function*() {
                    yield S.wait(0.5);
                    controller.right = true;
                    yield S.wait(0.7);
                    controller.right = false;
                },
                interrupt: 'interrupt',
                wait: 1,
                nextAction: nextAction
            });

            this.addAction('attackright', {
                script: function*() {
                    controller.keys.runRight = true;
                    yield S.wait(0.25);
                    controller.jump = true;
                    yield;
                    controller.jump = false;
                    yield S.wait(0.25);
                    controller.keys.runRight = false;

                    controller.up = true;
                    yield S.wait(1);
                    controller.up = false;
                    yield S.wait(0.5);
                    controller.right = true;
                    yield S.wait(0.3);
                    controller.right = false;

                    let player = boss.world.select.name<Player>('player');
                    if (!player) return;
                    controller.aimDirection.x = player.x - boss.x;
                    controller.aimDirection.y = player.y - boss.y;
                    controller.attack = true;
                    yield;
                    controller.attack = false;
                },
                interrupt: 'interrupt',
                wait: 0.5,
                nextAction: nextAction
            });

            this.addAction('attackleft', {
                script: function*() {
                    controller.keys.runLeft = true;
                    yield S.wait(0.25);
                    controller.jump = true;
                    yield;
                    controller.jump = false;
                    yield S.wait(0.25);
                    controller.keys.runLeft = false;

                    controller.up = true;
                    yield S.wait(1);
                    controller.up = false;
                    yield S.wait(0.5);
                    controller.left = true;
                    yield S.wait(0.3);
                    controller.left = false;

                    let player = boss.world.select.name<Player>('player');
                    if (!player) return;
                    controller.aimDirection.x = player.x - boss.x;
                    controller.aimDirection.y = player.y - boss.y;
                    controller.attack = true;
                    yield;
                    controller.attack = false;
                },
                interrupt: 'interrupt',
                wait: 0.5,
                nextAction: nextAction
            });
        }
    }

    export class BossFilter extends TextureFilter {
        constructor() {
            super({
                code: `
                    if (inp.rgb == vec3(1.0, 0.0, 0.0)) {
                        outp.rgb = vec3(0.0, 1.0, 0.0);
                    }
                `
            });
        }
    }

    export class BossGlitchFilter extends TextureFilter {

        set amount(value: number) { this.setUniform('amount', value); }

        constructor() {
            super({
                uniforms: {
                    'float amount': 0
                },
                code: `
                    if (y > 8.0) {
                        outp = getColor(x + amount * 16.0 * cnoise(vec3(t*100.0, 0.0, 0.0)), y);
                    } else {
                        outp = getColor(x + amount * 16.0 * cnoise(vec3(t*100.0, 100.0, 0.0)), y);
                    }
                `
            });
        }
    }
}