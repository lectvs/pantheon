/// <reference path="./humanCharacter.ts" />
/// <reference path="./transition.ts" />

const DEFAULT_SCREEN_TRANSITION = Transition.FADE(0.2, 0.5, 0.2);

const BASE_STAGE: Stage = {
    layers: [
        { name: 'bg' },
        { name: 'room' },
        { name: 'main', sortKey: 'y' },
        { name: 'fg' },
        { name: 'spotlight' },
    ],
    physicsGroups: {
        'player': {},
        'props': {},
        'walls': {},
    },
    collisionOrder: [
        { move: 'player', from: ['props', 'walls'], callback: true },
    ],
}

function HUMAN_CHARACTER(texture: string): Sprite.Config {
    return {
        constructor: HumanCharacter,
        layer: 'main',
        physicsGroup: 'player',
        bounds: { x: -5, y: -2, width: 10, height: 2 },
        animations: [ 
            Animations.fromTextureList({ name: 'idle_side',   texturePrefix: texture + '_', textures: [0, 1], frameRate: 1, count: -1 }),
            Animations.fromTextureList({ name: 'idle_down',   texturePrefix: texture + '_', textures: [8, 9], frameRate: 1, count: -1 }),
            Animations.fromTextureList({ name: 'idle_up',     texturePrefix: texture + '_', textures: [16, 17], frameRate: 1, count: -1 }),
            Animations.fromTextureList({ name: 'run_side',    texturePrefix: texture + '_', textures: [2, 3], frameRate: 8, count: -1 }),
            Animations.fromTextureList({ name: 'run_down',    texturePrefix: texture + '_', textures: [10, 11], frameRate: 8, count: -1 }),
            Animations.fromTextureList({ name: 'run_up',      texturePrefix: texture + '_', textures: [18, 19], frameRate: 8, count: -1 }),
        ],
        defaultAnimation: 'idle_side',
    }
}

function WORLD_BOUNDS(left: number, top: number, right: number, bottom: number): PhysicsWorldObject.Config[] {
    let thickness = 12;
    let width = right-left;
    let height = bottom-top;
    return [
        {
            constructor: PhysicsWorldObject,
            bounds: { x: left-thickness, y: top-thickness, width: thickness, height: height+2*thickness },
            physicsGroup: 'walls',
        },
        {
            constructor: PhysicsWorldObject,
            bounds: { x: right, y: top-thickness, width: thickness, height: height+2*thickness },
            physicsGroup: 'walls',
        },
        {
            constructor: PhysicsWorldObject,
            bounds: { x: left, y: top-thickness, width: width, height: thickness },
            physicsGroup: 'walls',
        },
        {
            constructor: PhysicsWorldObject,
            bounds: { x: left, y: bottom, width: width, height: thickness },
            physicsGroup: 'walls',
        },
    ];
}