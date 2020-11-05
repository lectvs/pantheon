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
                let shield = this.addChild(new Sprite({
                    x: 20 + 36*this.shields.length, y: 20,
                    texture: 'ui_shield',
                    effects: { silhouette: { color: 0x00FFFF, alpha: 0 }},
                    layer: this.layer
                }));
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
                    let shard = this.addChild(new Sprite({
                        x: shield.localx-16 + subdivision.x,
                        y: shield.localy-16 + subdivision.y,
                        texture: subdivision.texture,
                        gravityy: 200,
                        vangle: Random.sign() * Random.float(1, 2) * 360,
                        life: 1,
                    }));
                    shard.v = Random.inCircle(80);
                    shard.updateCallback = obj => {
                        obj.alpha = 1 - obj.life.progress**2;
                    };
                });
                shield.removeFromWorld();
            }
        }
    }

}