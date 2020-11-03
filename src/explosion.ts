class Explosion extends Sprite {
    hasTriggered: boolean;

    constructor() {
        super();

        this.setTexture('explosion');
        this.tint = 0x000000;
        this.bounds = new CircleBounds(0, 0, 50);

        this.runScript(S.chain(
            S.wait(0.05),
            S.call(() => this.tint = 0xFFFFFF),
            S.wait(0.05),
            S.call(() => this.kill()),
        ));

        this.hasTriggered = false;
    }

    update() {
        super.update();

        if (!this.hasTriggered) {
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

            this.hasTriggered = true;
        }
    }
}