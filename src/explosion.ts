class Explosion extends Sprite {
    constructor(config: Sprite.Config = {}) {
        super({
            texture: 'explosion',
            tint: 0x000000,
            bounds: new CircleBounds(0, 0, 50),
            ...config
        });

        this.runScript(S.chain(
            S.wait(0.05),
            S.call(() => this.tint = 0xFFFFFF),
            S.wait(0.05),
            S.call(() => this.kill()),
        ));
    }

    onAdd() {
        super.onAdd();

        let toDamages = this.world.select.overlap(this.bounds, ['player', 'enemies']);

        for (let toDamage of toDamages) {
            if (toDamage instanceof Player && !toDamage.immune) {
                toDamage.damage();
            }
            if (toDamage instanceof Enemy && !toDamage.immune) {
                toDamage.damage(1);
            }
        }

        this.world.playSound('explode');
    }
}