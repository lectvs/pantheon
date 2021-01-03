class Ball extends Sprite {
    private readonly maxSpeed = 300;

    private shadow: Sprite;

    makesExplosionSound: boolean;

    constructor(config: Sprite.Config = {}) {
        super({
            texture: 'ball',
            bounds: new CircleBounds(0, 0, 6),
            vangle: 90 * Random.sign(),
            gravityz: -100,
            mass: 1,
            effects: { silhouette: { color: 0xFFFFFF, enabled: false } },
            ...config
        });

        this.shadow = this.addChild(new Sprite({
            x: 0, y: 0,
            texture: 'shadow',
            tint: 0x000000,
            alpha: 0.5,
            layer: 'bg',
        }));

        this.makesExplosionSound = true;

        this.runScript(S.chain(
            S.wait(1),
            S.loopFor(8, S.chain(
                S.call(() => this.effects.silhouette.enabled = !this.effects.silhouette.enabled),
                S.wait(0.25),
            )),
            S.loopFor(20, S.chain(
                S.call(() => this.effects.silhouette.enabled = !this.effects.silhouette.enabled),
                S.wait(0.05),
            )),
            S.call(() => { this.explode(); }),
        ));
    }

    update() {
        this.v.x -= this.v.x * 30/80 * this.delta;
        this.v.y -= this.v.y * 30/80 * this.delta;

        super.update();

        if (this.z < 8) {
            this.z = 8;
            this.vz = -this.vz;
        }

        this.shadow.z = 0;

        V.clampMagnitude(this.v, this.maxSpeed);
    }

    render(texture: Texture, x: number, y: number) {
        super.render(texture, x, y);

        Draw.brush.color = 0x000000;
        Draw.brush.alpha = 1;
        Draw.brush.thickness = 1;
        Draw.circleOutline(texture, x, y, 8, Draw.ALIGNMENT_INNER);
    }

    explode() {
        this.world.addWorldObject(new Explosion({
            x: this.x,
            y: this.y - this.z,
            layer: 'fg',
            size: 0.5,
            soundVolume: this.makesExplosionSound ? 1 : 0,
            damageGroups: ['player']
        }));

        this.kill();
    }
}