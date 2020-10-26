class UI extends WorldObject {

    shields: Sprite[];

    constructor() {
        super();

        this.ignoreCamera = true;
        this.shields = [];
    }

    update() {
        super.update();
        this.updateHealth();
    }

    private updateHealth() {
        let player = this.world.select.type(Player);

        if (player.health > this.shields.length) {
            for (let i = 0; i < player.health - this.shields.length; i++) {
                let shield = this.addChild(new Sprite(), {
                    layer: this.layer
                });
                shield.localx = 20 + 36 * this.shields.length;
                shield.localy = 20;
                shield.setTexture('ui_shield');
                shield.effects.updateFromConfig({
                    silhouette: { color: 0x00FFFF, alpha: 0 }
                });
                this.shields.push(shield);

                this.world.runScript(S.chain(
                    S.doOverTime(0.3, t => shield.effects.silhouette.alpha = t),
                    S.doOverTime(0.3, t => shield.effects.silhouette.amount = 1-t),
                ));
            }
        }

        if (player.health < this.shields.length) {
            for (let i = 0; i < this.shields.length - player.health; i++) {
                let shield = this.shields.pop();
                shield.getTexture().subdivide(4, 4).forEach(subdivision => {
                    let shard = this.addChild(new Sprite());
                    shard.localx = shield.localx - 16 + subdivision.x;
                    shard.localy = shield.localy - 16 + subdivision.y;
                    shard.setTexture(subdivision.texture);
                    shard.vx = Random.float(-80, 80);
                    shard.vy = Random.float(-80, 80);
                    shard.gravityy = 200;
                    shard.data.vangle = Random.sign() * Random.float(1, 2) * 360;
                    shard.life.duration = 1;
                    shard.updateCallback = obj => {
                        obj.angle += obj.data.vangle*obj.delta;
                        obj.alpha = 1 - obj.life.progress**2;
                    };
                });
                shield.removeFromWorld();
            }
        }
    }

}