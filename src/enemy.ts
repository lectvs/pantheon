/// <reference path="../lectvs/worldObject/behavior/controllerBehavior.ts" />

namespace Enemy {
    export type Config = Sprite.Config & {
        maxHealth: number;
        immuneTime: number;
        weight: number;
        speed: number;
        damagableByHoop?: boolean;
        deadTexture?: string;
        hasNormalShadow?: boolean;
    }
}

class Enemy extends Sprite {
    health: number;
    immuneTime: number;
    weight: number;
    speed: number;
    damagableByHoop: boolean;
    deadTexture: string;

    private immunitySm: ImmunitySm;
    get immune() { return this.immunitySm.isImmune(); }

    shadow: Sprite;

    constructor(config: Enemy.Config) {
        super(config);

        this.health = config.maxHealth;
        this.immuneTime = config.immuneTime;
        this.weight = config.weight;
        this.speed = config.speed;
        this.damagableByHoop = config.damagableByHoop ?? true;
        this.deadTexture = config.deadTexture;

        if (config.hasNormalShadow ?? true) {
            this.shadow = this.addChild(new Sprite({
                x: 0, y: 0,
                texture: 'shadow',
                tint: 0x000000,
                alpha: 0.5,
                layer: 'bg',
            }));
        }

        this.immunitySm = new ImmunitySm(this.immuneTime);
    }

    update() {
        this.immunitySm.update(this.delta);

        super.update();

        this.v.x = M.lerpTime(this.v.x, 0, 10, this.delta);
        this.v.y = M.lerpTime(this.v.y, 0, 10, this.delta);

        if (this.shadow) this.shadow.z = 0;
    }

    damage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.kill();
        }
        
        this.world.playSound('hitenemy');

        this.immunitySm.setImmune();
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

    kill() {
        if (this.deadTexture) {
            this.world.addWorldObject(deadBody(this, this.deadTexture));
        }
        super.kill();
    }

    pickNextTargetPos(target: Pt) {
        if (this.x < 64 || this.x > 706 || this.y < 338 || this.y > 704) {
            // Too close to edge of room
            let candidates = A.range(20).map(i => {
                return { x: Random.float(64, 706), y: Random.float(338, 704) };
            });
            return M.argmin(candidates, pos => M.distance(this.x, this.y, pos.x, pos.y));
        }

        let candidates = A.range(3).map(i => {
            let d = Random.inDisc(50, 100);
            d.x += this.x;
            d.y += this.y;
            return d;
        });

        return M.argmin(candidates, pos => Math.abs(M.distance(target.x, target.y, pos.x, pos.y) - 150));
    }
}

namespace Enemy {
    export class EnemyControllerBehavior extends ControllerBehavior {
        constructor(enemy: Enemy) {
            super(function() {
                if (Input.isDown('rmb')) {
                    this.controller.moveDirection.x = enemy.world.getWorldMouseX() - enemy.x;
                    this.controller.moveDirection.y = enemy.world.getWorldMouseY() - enemy.y;
                } else {
                    this.controller.moveDirection.x = 0;
                    this.controller.moveDirection.y = 0;
                }
    
                this.controller.aimDirection.x = enemy.world.getWorldMouseX() - enemy.x;
                this.controller.aimDirection.y = enemy.world.getWorldMouseY() - enemy.y;
    
                this.controller.attack = Input.isDown('lmb');
                this.controller.jump = Input.isDown('3');
            });
        }
    }
}