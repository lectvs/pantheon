/// <reference path="./enemy.ts"/>

class Golbin extends Enemy {

    private readonly bulletSpeed = 100;

    private attacking: WorldObject;
    private targetPos: Pt;

    private willShootNext: boolean;

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
                Animations.fromTextureList({ name: 'drawback', texturePrefix: 'golbin', textures: [8, 9, 10, 11, 10, 11, 10, 11, 11, 11], frameRate: 6 })
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

        this.willShootNext = true;

        this.stateMachine.addState('start', {
            script: S.wait(Random.float(0, 1)),
            transitions: [
                { toState: 'idle' },
            ]
        })
        this.stateMachine.addState('idle', {
            script: S.chain(
                S.wait(Random.float(0.8, 1.2)),
                S.call(() => {
                    this.pickNextTargetPos();
                    this.willShootNext = !this.willShootNext;
                }),
            ),
            transitions: [
                { toState: 'shooting', condition: () => this.willShootNext },
                { toState: 'walking', condition: () => !this.willShootNext },
            ]
        });
        this.stateMachine.addState('walking', {
            transitions: [
                { toState: 'idle', condition: () => M.distance(this.x, this.y, this.targetPos.x, this.targetPos.y) < 4 },
            ]
        });
        this.stateMachine.addState('shooting', {
            script: S.chain(
                S.playAnimation(this, 'drawback'),
                S.call(() => {
                    this.shoot({ x: this.attacking.x - this.x, y: this.attacking.y - this.y });
                }),
            ),
            transitions: [
                { toState: 'idle' },
            ]
        })
        this.stateMachine.setState('start');

        this.targetPos = { x: 0, y: 0 };
    }

    update() {
        this.ai();

        if (this.state === 'idle') {
            this.playAnimation('idle');
        } else if (this.state === 'walking') {
            this.v = { x: this.targetPos.x - this.x, y: this.targetPos.y - this.y };
            this.setSpeed(this.speed);

            if (this.v.x < 0) this.flipX = true;
            if (this.v.x > 0) this.flipX = false;

            this.playAnimation('run');
        } else if (this.state === 'shooting') {
            let player = global.world.select.type(Player);
            if (player.x < this.x) this.flipX = true;
            if (player.x > this.x) this.flipX = false;
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

    shoot(d: Pt) {
        let bullet = this.world.addWorldObject(new Bullet({
            x: this.x,
            y: this.y - 4,
            vx: d.x, vy: d.y,
            name: 'bullet',
            layer: this.layer,
            physicsGroup: 'bullets',
        }));

        bullet.setSpeed(this.bulletSpeed);

        this.world.playSound('shoot');
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if (other.physicsGroup === 'walls') {
            this.setState('idle');
        }
    }

    private ai() {
        if (!this.attacking) this.attacking = this.world.select.type(Player);
    }

    private pickNextTargetPos() {

        if (this.x < 64 || this.x > 706 || this.y < 338 || this.y > 704) {
            // Too close to edge of room
            let candidates = A.range(20).map(i => {
                return { x: Random.float(64, 706), y: Random.float(338, 704) };
            });
            this.targetPos = M.argmin(candidates, pos => M.distance(this.x, this.y, pos.x, pos.y));
            return;
        }

        let candidates = A.range(3).map(i => {
            let d = Random.inDisc(50, 100);
            d.x += this.x;
            d.y += this.y;
            return d;
        });

        this.targetPos = M.argmin(candidates, pos => Math.abs(M.distance(this.attacking.x, this.attacking.y, pos.x, pos.y) - 150));
    }
}