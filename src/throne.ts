class Throne extends Enemy {
    king: Sprite;
    shadow: Sprite;
    light: Sprite;

    private dinkSound: Sound;

    constructor(config: Sprite.Config) {
        super({
            texture: 'throne',
            bounds: new RectBounds(-15, -24, 30, 24),
            immovable: true,
            maxHealth: 1003,
            immuneTime: 1,
            weight: 10,
            speed: 0,
            damagableByHoop: false,
            ...config,
        });

        this.shadow = this.addChild(new Sprite({
            x: -15, y: -22,
            texture: Texture.filledRect(30, 24, 0x000000, 0.5),
            layer: 'king_shadow_start'
        }));

        let lightTexture = new AnchoredTexture(0, 0, Texture.filledRect(1024, 64, 0xFF0000, 0.5));
        lightTexture.anchorX = 1/32;
        lightTexture.anchorY = 1/2;

        this.light = this.addChild(new Sprite({
            x: 0, y: -12,
            texture: lightTexture,
            alpha: 0,
            layer: 'bg'
        }));

        this.king = this.addChild(new Sprite({
            x: 0, y: 0, z: 20,
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'king', textures: [0, 1, 2], frameRate: 4, count: -1 })
            ],
            defaultAnimation: 'idle',
            effects: { outline: { color: 0x000000 } },
            matchParentLayer: true
        }));

        this.stateMachine = new ThroneBehaviorSm(this);
    }

    update() {
        super.update();

        let player = this.world.select.type(Player);

        if (player.x < this.king.x) this.king.flipX = true;
        if (player.x > this.king.x) this.king.flipX = false;

        this.shadow.z = 0;

        this.king.effects.silhouette.color = this.effects.silhouette.color;
        this.king.effects.silhouette.enabled = this.effects.silhouette.enabled;

        if (this.health === 1001) {
            this.tint = 0xFF0000;
            this.king.tint = 0xFF0000;
            this.timeScale = 2;
        } else if (this.health === 1002) {
            this.tint = 0xFF8888;
            this.king.tint = 0xFF8888;
            this.timeScale = 1.5;
        } else if (this.health === 1003) {
            this.tint = 0xFFFFFF;
            this.king.tint = 0xFFFFFF;
            this.timeScale = 1;
        } else {
            this.timeScale = 1;
        }
    }

    damage(amount: number) {
        super.damage(amount);

        let loops = 8;
        if (this.health <= 1000) {
            loops = Infinity;
        }

        this.runScript(S.chain(
            S.call(() => {
                this.effects.addSilhouette.color = 0xFFFFFF;
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

        if (this.health <= 1000) {
            this.setState('defeat');
        } else {
            this.setState('idle');
        }
    }

    spawnBomb() {
        this.world.addWorldObject(new Bomb({
            x: this.x, y: this.y, z: 50,
            layer: this.layer,
            physicsGroup: 'bombs'
        }));
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if (other.physicsGroup === 'walls' && this.state === 'dash') {
            this.setState('vulnerable');
        }

        if (other instanceof Hoop && other.isStrongEnoughToDealDamage() && (!this.dinkSound || this.dinkSound.done)) {
            this.dinkSound = this.world.playSound('dink');
            this.dinkSound.volume = other.currentAttackStrength;
        }
    }
}