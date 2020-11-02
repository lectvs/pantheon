/// <reference path="./enemy.ts"/>

class Runner extends Enemy {

    private attacking: WorldObject;

    constructor() {
        super({
            maxHealth: 0.5,
            immuneTime: 0.5,
            weight: 1,
            speed: 50,
            deadTexture: 'runner_dead',
        });

        this.bounds = new CircleBounds(0, -4, 8, this);
        this.effects.updateFromConfig({
            outline: { color: 0xFFFFFF }
        });
        this.addAnimation(Animations.fromTextureList({ name: 'idle', texturePrefix: 'runner_', textures: [0, 1, 2], frameRate: 8, count: -1 }));
        this.addAnimation(Animations.fromTextureList({ name: 'run', texturePrefix: 'runner_', textures: [4, 5, 6, 7], frameRate: 8, count: -1,
                overrides: {
                    2: { callback: () => { this.world.playSound('walk'); }}
                }
        }));
        this.playAnimation('run');

        this.stateMachine.addState("idle", {
            script: S.wait(1),
            transitions: [{ toState: 'running' }],
        });
        this.stateMachine.addState("running", {});
        this.setState("idle");
    }

    update() {
        this.ai();

        if (this.state === 'running') {
            let v = { x: this.attacking.x - this.x, y: this.attacking.y - this.y };
            V.setMagnitude(v, this.speed);
            this.vx = v.x;
            this.vy = v.y;

            if (this.vx < 0) this.flipX = true;
            if (this.vx > 0) this.flipX = false;

            this.playAnimation('run');
        } else {
            this.playAnimation('idle')
        }

        super.update();
    }

    damage(amount: number) {
        super.damage(amount);
        this.setState('idle');

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

    private ai() {
        if (!this.attacking) this.attacking = this.world.select.type(Player);
    }
}