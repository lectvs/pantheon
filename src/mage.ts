/// <reference path="./enemy.ts"/>

class Mage extends Enemy {

    private static readonly MAX_RUNNERS = 4;

    private attacking: WorldObject;
    private targetPos: Pt;

    private willSpawnNext: boolean;

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

        this.willSpawnNext = true;

        this.stateMachine.addState('start', {
            script: S.wait(Random.float(0, 1)),
            transitions: [
                { toState: 'idle' },
            ]
        })
        this.stateMachine.addState('idle', {
            script: S.chain(
                S.wait(Random.float(1.4, 2)),
                S.call(() => {
                    this.pickNextTargetPos(this.attacking);
                    this.willSpawnNext = !this.willSpawnNext;
                    if (this.world.select.typeAll(Runner).length >= Mage.MAX_RUNNERS) {
                        this.willSpawnNext = false;
                    }
                }),
            ),
            transitions: [
                { toState: 'spawn', condition: () => this.willSpawnNext },
                { toState: 'walking', condition: () => !this.willSpawnNext },
            ]
        });
        this.stateMachine.addState('walking', {
            transitions: [
                { toState: 'idle', condition: () => M.distance(this.x, this.y, this.targetPos.x, this.targetPos.y) < 4 },
            ]
        });
        this.stateMachine.addState('spawn', {
            script: S.chain(
                S.wait(1),
                S.call(() => {
                    this.pickNextSpawnTargetPos();
                    this.spawn();
                }),
                S.doOverTime(1, t => this.effects.outline.color = M.vec3ToColor([0, t, t])),
                S.wait(1),
                S.doOverTime(0.2, t => this.effects.outline.color = M.vec3ToColor([0, 1-t, 1-t])),
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
            V.setMagnitude(this.v, this.speed);

            if (this.v.x < 0) this.flipX = true;
            if (this.v.x > 0) this.flipX = false;

            this.playAnimation('run');
        } else if (this.state === 'spawn') {
            this.playAnimation('wave');
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

    spawn() {
        this.world.addWorldObject(spawn(new Runner({
            x: this.targetPos.x, y: this.targetPos.y,
            layer: 'main',
            physicsGroup: 'enemies'
        })));
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

    private pickNextSpawnTargetPos() {
        this.targetPos = Random.inDisc(16, 32);
        this.targetPos.x += this.x;
        this.targetPos.y += this.y;
    }
}