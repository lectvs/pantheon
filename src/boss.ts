/// <reference path="./player.ts" />

class Boss extends Player {
    private readonly SHOT_SPEED = 200;
    private readonly KNOCKBACK_SPEED = 200;

    get startedFighting() { return this.dead || this.behavior instanceof Boss.BossBehavior; }

    health: number = 4;
    
    private glitchFilter: Boss.BossGlitchFilter;

    constructor(tx: number, ty: number) {
        super(tx, ty);

        this.layer = 'entities';
        this.physicsGroup = 'enemies';

        this.glitchFilter = new Boss.BossGlitchFilter();
        this.effects.updateFromConfig({ post: { filters: [new Boss.BossFilter(), this.glitchFilter] } });

        this.behavior = new NullBehavior();

        this.grappleColor = 0x00FF00;
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
        console.log('shoot')
        let dir = V.normalized(this.controller.aimDirection);
        let off = 10;
        this.world.addWorldObject(new Cannonball(this.x + dir.x*off, this.y + dir.y*off, V.withMagnitude(dir, this.SHOT_SPEED)));
        this.v = V.withMagnitude(V.scaled(dir, -1), this.KNOCKBACK_SPEED);
    }

    damage(direction: Direction2D) {
        this.v.x += direction.h * this.KNOCKBACK_SPEED;
        this.v.y += direction.v * this.KNOCKBACK_SPEED;
        let oppdir = { h: -direction.h, v: -direction.v };
        Puff.puffDirection(this.world, this.x, this.y, 5, oppdir, 50, 50);
        this.behavior.interrupt();

        this.health--;
        if (this.health <= 0) {
            this.dead = true;
            this.behavior = new NullBehavior();
        }

        let boss = this;
        this.runScript(function*() {
            boss.glitchFilter.amount = 1;
            yield S.wait(0.5);
            if (!boss.dead) boss.glitchFilter.amount = 0;
        })
    }
}

namespace Boss {
    export class BossBehavior extends ActionBehavior {
        constructor(boss: Boss) {
            super('grappleright', 1);
            let controller = this.controller;

            let nextAction = () => {
                if (boss.x < boss.world.width/2) {
                    return Random.element(['grappleright', 'attackright']);
                } else {
                    return Random.element(['grappleleft', 'attackleft']);
                }
            };

            this.addAction('interrupt', {
                interrupt: 'interrupt',
                wait: 1,
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