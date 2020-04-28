namespace Tree {
    export type Config = Sprite.Config & {
        spawnsTorch?: boolean;
    }
}

class Tree extends Sprite {
    private spawnsTorch: boolean;
    private hitScript: Script;
    hp: number;

    constructor(config: Tree.Config) {
        super(config, {
            texture: Random.boolean() ? 'blacktree' : 'whitetree',
            flipX: Random.boolean(),
            bounds: { x: -4, y: -2, width: 8, height: 3 },
        });
        this.hp = 3;
        this.spawnsTorch = O.getOrDefault(config.spawnsTorch, false);
    }

    hit() {
        if (this.hp <= 0) return;

        if (this.hitScript) {
            this.hitScript.done = true;
        }

        this.hp--;
        if (this.hp > 0) {
            this.hitScript = this.world.runScript(S.doOverTime(0.5, t => { this.angle = 30*Math.exp(5*-t)*Math.cos(5*t); }));
        } else {
            this.hitScript = this.world.runScript(S.chain(
                S.doOverTime(0.5, t => { this.angle = 30*Math.exp(5*-t)*Math.cos(5*t); }),
                S.call(() => {
                    this.colliding = false;
                }),
                S.doOverTime(1, t => { this.angle = 90 * (t + t*t)/2; }),
                S.call(() => {
                    this.spawnLog();
                    if (this.spawnsTorch) this.spawnTorch();
                    this.kill();
                })
            ));
        }
    }

    private spawnLog() {
        this.world.addWorldObject(<Item.Config>{
            constructor: ItemGround,
            x: this.x + 16, y: this.y,
            layer: 'main',
            offset: { x: 0, y: -8 },
            physicsGroup: 'items',
            type: Item.Type.LOG,
        });
    }

    private spawnTorch() {
        this.world.addWorldObject(<Item.Config>{
            name: 'torch',
            constructor: ItemGround,
            x: this.x, y: this.y,
            layer: 'main',
            offset: { x: 0, y: -12 },
            physicsGroup: 'items',
            type: Item.Type.TORCH,
            children: [{
                name: 'torchFire',
                parent: fireSpriteConfig(),
                layer: 'main'
            }],
        });
    }
}