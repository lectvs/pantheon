class Tree extends Sprite {
    private readonly maxhp = 3;

    private spawnsTorch: boolean;
    private hp: number;

    constructor(config: Sprite.Config) {
        super(config, {
            texture: Random.boolean() ? 'blacktree' : 'whitetree',
            flipX: Random.boolean(),
            bounds: { x: -4, y: -2, width: 8, height: 3 },
        });

        this.stateMachine.addState('normal', {});
        this.stateMachine.addState('hurt', {
            script: S.doOverTime(0.5, t => { this.angle = 30*Math.exp(5*-t)*Math.cos(5*t); }),
            transitions: [{ type: 'instant', toState: 'normal' }]
        });
        this.stateMachine.addState('die', {
            script: S.chain(
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
            )
        });

        this.hp = this.maxhp;
        this.spawnsTorch = O.getOrDefault(this.data.spawnsTorch, false);
    }

    hit() {
        if (this.state === 'die') return;

        this.hp--;
        if (this.hp > 0) {
            this.setState('hurt');
        } else {
            this.setState('die');
        }
    }

    heal() {
        this.hp = this.maxhp;
    }

    private spawnLog() {
        this.world.addWorldObject(<Item.Config>{
            constructor: Item,
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
            constructor: Item,
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