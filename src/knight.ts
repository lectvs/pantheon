/// <reference path="./enemy.ts"/>

class Knight extends Enemy {
    light: Sprite;

    private attacking: WorldObject;
    private lastPos: Pt;
    private targetPos: Pt;

    private willDashNext: boolean;

    constructor(config: Sprite.Config) {
        super({
            bounds: new CircleBounds(0, -4, 8),
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'enemyknight', textures: [4, 5, 6, 7], frameRate: 8, count: -1,
                        overrides: {
                            2: { callback: () => { this.world.playSound('walk'); }}
                        }
                }),
                Animations.fromTextureList({ name: 'windup', texturePrefix: 'enemyknight', textures: [8], frameRate: 4, count: -1 })
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

        let lightTint = this.tint === 0xFFFFFF ? 0x00FFFF : this.tint - 0xFF0000;
        let lightTexture = new AnchoredTexture(0, 0, Texture.filledRect(1024, 16, lightTint, 0.5));
        lightTexture.anchorX = 1/128;
        lightTexture.anchorY = 1/2;

        this.light = this.addChild(new Sprite({
            x: 0, y: -4,
            texture: lightTexture,
            alpha: 0,
            layer: 'bg'
        }));

        this.willDashNext = true;

        this.stateMachine.addState('start', {
            script: S.wait(Random.float(0, 1)),
            transitions: [
                { toState: 'idle' },
            ]
        })
        this.stateMachine.addState('idle', {
            callback: () => {
                this.light.alpha = 0;
            },
            script: S.chain(
                S.wait(Random.float(0.8, 1.2)),
                S.call(() => {
                    this.pickNextTargetPos();
                    this.willDashNext = !this.willDashNext;
                }),
            ),
            transitions: [
                { toState: 'dash', condition: () => this.willDashNext },
                { toState: 'walking', condition: () => !this.willDashNext },
            ]
        });
        this.stateMachine.addState('walking', {
            transitions: [
                { toState: 'idle', condition: () => M.distance(this.x, this.y, this.targetPos.x, this.targetPos.y) < 4 },
            ]
        });
        this.stateMachine.addState('dash', {
            script: S.chain(
                S.call(() => {
                    this.playAnimation('windup');
                }),
                S.jumpZ(this, 16, 0.5),
                S.doOverTime(1, t => {
                    this.pickNextTargetPosForDash();
                    this.light.angle = M.radToDeg(Math.atan2(this.targetPos.y - this.y, this.targetPos.x - this.x));
                    this.light.alpha = t;

                    this.flipX = (this.attacking.x < this.x);
                }),
                S.wait(1.5),
                S.call(() => {
                    this.lastPos.x = this.x;
                    this.lastPos.y = this.y;
                    this.light.alpha = 0;
                    this.world.playSound('dash');
                }),
                S.doOverTime(0.3, t => {
                    this.x = M.lerp(this.lastPos.x, this.targetPos.x, t);
                    this.y = M.lerp(this.lastPos.y, this.targetPos.y, t);
                }),
            ),
            transitions: [
                { toState: 'idle' },
            ]
        })
        this.stateMachine.setState('start');

        this.lastPos = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
    }

    update() {
        this.ai();

        if (this.state === 'idle') {
            this.playAnimation('idle');
        } else if (this.state === 'walking') {
            this.v = { x: this.targetPos.x - this.x, y: this.targetPos.y - this.y };
            V.setMagnitude(this.v, this.speed);

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

    private pickNextTargetPosForDash() {
        let d = { x: this.attacking.x - this.x, y: this.attacking.y - this.y };
        if (V.magnitude(d) < 300) V.setMagnitude(d, 300);
        this.targetPos.x = this.x + d.x;
        this.targetPos.y = this.y + d.y;
    }
}