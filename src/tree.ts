class Tree extends Sprite {
    private readonly maxhp = 3;

    private spawnsTorch: boolean;
    private hp: number;
    private hitDir: number;

    constructor(config: Sprite.Config) {
        super(config, {
            flipX: Random.boolean(),
            bounds: { x: -4, y: -2, width: 8, height: 3 },
            animations: [
                Animations.fromTextureList({ name: 'black', texturePrefix: 'trees_', textures: [0, 1, 2], frameRate: 3, count: -1 }),
                Animations.fromTextureList({ name: 'white', texturePrefix: 'trees_', textures: [3, 4, 5], frameRate: 3, count: -1 }),
            ],
            defaultAnimation: Random.boolean() ? 'black' : 'white',
        });

        this.effects.post.filters.push(
            new TextureFilter({
                uniforms: [],
                defaultUniforms: {},
                vertCode: `
                    float tt = t*3.0;
                    float amount = (2.7 - 2.0*sin(tt+2.4) - cos(tt)*cos(tt))/4.5;
                    outp.x -= 2.6 * (1.0 - inp.y/52.0) * amount;
                    outp.y -= 1.0 * (inp.x/32.0 * 2.0 - 1.0) * amount;
                `
            })
        );
        this.effects.post.filters[0].setUniform('t', Random.float(0, 100));

        this.stateMachine.addState('normal', {
            transitions: [
                { type: 'condition', condition: () => this.hp <= 0, toState: 'die' },
            ]
        });
        this.stateMachine.addState('hurt', {
            script: S.doOverTime(0.5, t => { this.angle = this.hitDir * 30*Math.exp(5*-t)*Math.cos(5*t); }),
            transitions: [
                { type: 'instant', toState: 'normal' }
            ]
        });
        this.stateMachine.addState('die', {
            callback: () => { this.colliding = false },
            script: S.chain(
                S.doOverTime(1, t => { this.angle = this.hitDir * 90 * (t + t*t)/2; }),
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

    hit(dir: number) {
        if (this.hp <= 0) return;

        this.hitDir = Math.sign(dir);
        if (this.hitDir === 0) {
            this.hitDir = Random.sign();
        }

        this.hp--;
        this.setState('hurt');
    }

    heal() {
        this.hp = this.maxhp;
    }

    private spawnLog() {
        this.world.addWorldObject(<Item.Config>{
            constructor: Item,
            x: this.x + 16*this.hitDir, y: this.y,
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