class UI extends WorldObject {

    shields: Sprite[];

    constructor(config: WorldObject.Config) {
        super(config, {
            ignoreCamera: true,
        });

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
                let shield = this.addChild<Sprite>(<Sprite.Config>{
                    constructor: Sprite,
                    x: 20 + 36 * this.shields.length, y: 20,
                    effects: {
                        silhouette: { color: 0x00FFFF, alpha: 0 },
                    },
                    texture: 'ui_shield',
                    layer: this.layer,
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
                    this.addChild(<Sprite.Config>{
                        constructor: Sprite,
                        x: shield.x - 16 + subdivision.x, y: shield.y - 16 + subdivision.y,
                        texture: subdivision.texture,
                        vx: Random.float(-80, 80),
                        vy: Random.float(-80, 80),
                        gravityy: 200,
                        data: {
                            vangle: Random.sign() * Random.float(1,2) * 360,
                        },
                        life: 1,
                        updateCallback: (obj: Sprite) => {
                            obj.angle += obj.data.vangle*obj.delta;
                            obj.alpha = 1 - obj.life.progress**2;
                        },
                    });
                });
                shield.removeFromWorld();
            }
        }
    }

}