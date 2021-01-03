namespace Explosion {
    export type Config = Sprite.Config & {
        size?: number;
        soundVolume?: number;
        damageGroups?: string[];
    }
}

class Explosion extends Sprite {
    private soundVolume: number;
    private damageGroups: string[];

    constructor(config: Explosion.Config = {}) {
        let size = config.size ?? 1;
        super({
            texture: 'explosion',
            tint: 0x000000,
            bounds: new CircleBounds(0, 0, 50*size),
            ...config
        });

        this.scaleX *= size;
        this.scaleY *= size;

        this.soundVolume = config.soundVolume ?? 1;
        this.damageGroups = config.damageGroups ?? ['player', 'enemies'];

        this.runScript(S.chain(
            S.wait(0.05),
            S.call(() => this.tint = 0xFFFFFF),
            S.wait(0.05),
            S.call(() => this.kill()),
        ));
    }

    onAdd() {
        super.onAdd();

        let toDamages = this.world.select.overlap(this.bounds, this.damageGroups);

        for (let toDamage of toDamages) {
            if (toDamage instanceof Player && !toDamage.immune) {
                toDamage.damage();
            }
            if (toDamage instanceof Enemy && !toDamage.immune) {
                toDamage.damage(1);
            }
        }

        let sound = this.world.playSound('explode');
        sound.volume = this.soundVolume;
    }
}