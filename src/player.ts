class Player extends Sprite {
    static MAX_HP = 5;

    private readonly immuneTime = 1;

    speed: number = 128;
    radius: number = 6;

    health: number;

    private immunitySm: ImmunitySm;
    get immune() { return this.immunitySm.isImmune(); }

    constructor(config: Sprite.Config = {}) {
        super({
            bounds: new CircleBounds(0, -4, 8),
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'knight', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'knight', textures: [4, 5, 6, 7], frameRate: 12, count: -1,
                        overrides: {
                            2: { callback: () => { this.world.playSound('walk'); }}
                        }
                }),
            ],
            defaultAnimation: 'idle',
            effects: { outline: { color: 0x000000 } },
            ...config
        });

        this.behavior = new ControllerBehavior(function() {
            this.controller.left = Input.isDown('left');
            this.controller.right = Input.isDown('right');
            this.controller.up = Input.isDown('up');
            this.controller.down = Input.isDown('down');
        });

        this.immunitySm = new ImmunitySm(this.immuneTime);
        this.health = Player.MAX_HP;
    }

    update() {
        let haxis = (this.controller.left ? -1 : 0) + (this.controller.right ? 1: 0);
        let vaxis = (this.controller.up ? -1 : 0) + (this.controller.down ? 1: 0);

        this.v.x = haxis * this.speed;
        this.v.y = vaxis * this.speed;

        this.immunitySm.update(this.delta);

        super.update();

        if (haxis < 0) this.flipX = true;
        if (haxis > 0) this.flipX = false;

        if (haxis === 0 && vaxis == 0) {
            this.playAnimation('idle');
        } else {
            this.playAnimation('run');
        }
    }

    damage() {
        if (this.health <= 0) return;

        this.health -= 1;

        let loops = 8;
        if (this.health <= 0) {
            loops = Infinity;
        }
        this.immunitySm.setImmune();

        this.runScript(S.chain(
            S.call(() => {
                this.effects.silhouette.color = 0xFFFFFF;
                this.effects.silhouette.enabled = true;
            }),
            S.loopFor(loops, S.chain(
                S.wait(this.immuneTime/8),
                S.call(() => {
                    this.effects.silhouette.enabled = !this.effects.silhouette.enabled;
                })
            )),
            S.call(() => {
                this.effects.silhouette.enabled = false;
            }),
        ));

        this.world.playSound('hitplayer');
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if ((other instanceof Enemy || other instanceof Bullet) && !this.immune) {
            this.damage();
        }
    }
}