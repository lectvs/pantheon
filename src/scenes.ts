/// <reference path="./animations.ts" />
/// <reference path="./stages.ts" />

let scenes: Dict<Scene> = {
    'main': {
        stage: Stages.MILOS_ROOM,
        schema: {
            worldObjects: [
                { // Player
                    constructor: Player,
                    x: 128, y: 108,
                    layer: 'main',
                    physicsGroup: 'player',
                    animations: [
                        Animations.fromTextureList({ name: 'idle_side', texturePrefix: 'milo_sprites_', textures: [0, 1], frameRate: 1, count: -1 }),
                        Animations.fromTextureList({ name: 'idle_down', texturePrefix: 'milo_sprites_', textures: [8, 9], frameRate: 1, count: -1 }),
                        Animations.fromTextureList({ name: 'idle_up',   texturePrefix: 'milo_sprites_', textures: [16, 17], frameRate: 1, count: -1 }),
                        Animations.fromTextureList({ name: 'run_side',  texturePrefix: 'milo_sprites_', textures: [2, 3], frameRate: 8, count: -1 }),
                        Animations.fromTextureList({ name: 'run_down',  texturePrefix: 'milo_sprites_', textures: [10, 11], frameRate: 8, count: -1 }),
                        Animations.fromTextureList({ name: 'run_up',    texturePrefix: 'milo_sprites_', textures: [18, 19], frameRate: 8, count: -1 }),
                    ],
                },
            ]
        },
        entry: 'test',
        cutscenes: {
            'test': {
                condition: () => true,
                script: `
                    x = 5;
                    debug(x);
                `
            }
        },
    }
}