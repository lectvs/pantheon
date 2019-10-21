/// <reference path="./party.ts"/>

var HUMAN_CHARACTER: Sprite.StageConfig = {
    constructor: HumanCharacter,
    layer: 'main',
    physicsGroup: 'player',
    bounds: { x: -5, y: -2, width: 10, height: 2 },
}

const party: Party = new Party({
    leader: 'angie',
    activeMembers: ['angie'],
    members: {
        'angie': {
            config: {
                name: 'angie',
                parent: HUMAN_CHARACTER,
                animations: [ 
                    Animations.fromTextureList({ name: 'idle_side',   texturePrefix: 'angie_sprites_', textures: [0, 1], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'idle_down',   texturePrefix: 'angie_sprites_', textures: [8, 9], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'idle_up',     texturePrefix: 'angie_sprites_', textures: [16, 17], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'run_side',    texturePrefix: 'angie_sprites_', textures: [2, 3], frameRate: 8, count: -1 }),
                    Animations.fromTextureList({ name: 'run_down',    texturePrefix: 'angie_sprites_', textures: [10, 11], frameRate: 8, count: -1 }),
                    Animations.fromTextureList({ name: 'run_up',      texturePrefix: 'angie_sprites_', textures: [18, 19], frameRate: 8, count: -1 }),
                    Animations.fromTextureList({ name: 'throw_start', texturePrefix: 'angie_sprites_', textures: [4], frameRate: 1, count: -1, forceRequired: true }),
                    Animations.fromTextureList({ name: 'throw_end',   texturePrefix: 'angie_sprites_', textures: [5], frameRate: 1, count: -1, forceRequired: true }),
                ],
                defaultAnimation: 'idle_side',
                controllable: true,
            },
        },

        'milo': {
            config: {
                name: 'milo',
                parent: HUMAN_CHARACTER,
                animations: [
                    Animations.fromTextureList({ name: 'idle_side', texturePrefix: 'milo_sprites_', textures: [0, 1], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'idle_down', texturePrefix: 'milo_sprites_', textures: [8, 9], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'idle_up',   texturePrefix: 'milo_sprites_', textures: [16, 17], frameRate: 1, count: -1 }),
                    Animations.fromTextureList({ name: 'run_side',  texturePrefix: 'milo_sprites_', textures: [2, 3], frameRate: 8, count: -1 }),
                    Animations.fromTextureList({ name: 'run_down',  texturePrefix: 'milo_sprites_', textures: [10, 11], frameRate: 8, count: -1 }),
                    Animations.fromTextureList({ name: 'run_up',    texturePrefix: 'milo_sprites_', textures: [18, 19], frameRate: 8, count: -1 }),
                    Animations.fromTextureList({ name: 'flop_lay',  texturePrefix: 'milo_sprites_', textures: [4], frameRate: 1, count: -1, forceRequired: true }),
                ],
                defaultAnimation: 'idle_side'
            },
        },
    }
});