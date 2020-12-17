class King extends Sprite {
    private throne: Throne;

    constructor(throne: Throne, config: Sprite.Config) {
        super({
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'king', textures: [0, 1, 2], frameRate: 4, count: -1 }),
                Animations.fromTextureList({ name: 'laugh', texturePrefix: 'king', textures: [4, 5], frameRate: 3, count: -1 }),
                Animations.fromTextureList({ name: 'cry', texturePrefix: 'king', textures: [8, 9], frameRate: 4, count: -1 }),
            ],
            defaultAnimation: 'idle',
            effects: { outline: { color: 0x000000 } },
            ...config
        });

        this.throne = throne;

        this.stateMachine.addState('idle', {
            update: () => {
                this.playAnimation('idle');
            },
            transitions: [
                { toState: 'laugh', condition: () => !_.isEmpty(throne.world.select.typeAll(Bomb)) },
                { toState: 'cry', condition: () => this.throne.immune }
            ]
        });
        this.stateMachine.addState('laugh', {
            update: () => {
                this.playAnimation('laugh');
            },
            transitions: [ { toState: 'idle', condition: () => _.isEmpty(throne.world.select.typeAll(Bomb)) } ]
        });
        this.stateMachine.addState('cry', {
            update: () => {
                this.playAnimation('cry');
            },
            transitions: [ { toState: 'idle', delay: 1, condition: () => this.throne.health > 1000 && !this.throne.immune } ]
        });
        this.stateMachine.setState('idle');
    }
}