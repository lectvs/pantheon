/// <reference path="./backWall.ts" />
/// <reference path="./baseStage.ts" />
/// <reference path="./utils/o_object.ts" />
/// <reference path="./transition.ts" />
/// <reference path="./tilemap.ts" />
/// <reference path="./warp.ts" />

let defaultScreenTransition = Transition.FADE(0.5, 1, 0.5);

let archway = [
    { // Archway
        name: 'archway',
        constructor: Sprite,
        texture: 'archway',
        x: 40, y: -119,
        layer: 'main',
        physicsGroup: 'props',
        bounds: { x: -57, y: 64, width: 57, height: 16 },
    },
    { // Archway front
        name: 'archway_front',
        constructor: Sprite,
        texture: 'archway_front',
        layer: 'main',
        physicsGroup: 'props',
        bounds: { x: -49, y: -7, width: 49, height: 16 },
    },
    { // Warp
        name: 'cave_warp',
        constructor: Warp,
        physicsGroup: 'props',
        bounds: { x: -49, y: -55, width: 32, height: 48 },
    },
];

var entrance_frame = [
    { // Frame
        name: 'frame',
        constructor: Sprite,
        layer: 'main',
        texture: 'stone_frame',
    },
    { // Warp
        name: 'warp',
        constructor: Warp,
        physicsGroup: 'props',
        bounds: { x: 12, y: -20, width: 4, height: 16 },
    },
];

const stages: Dict<Stage> = {

    'main': {
        parent: BASE_STAGE,
        camera: {
            bounds: {
                left: 0,
                top: 0,
                right: 256,
                bottom: 192
            }
        },
        entryPoints: {
            'entrance': { x: 128, y: 96 },
            'exit': { x: -342, y: -416 },
        },
        worldObjects: [
            // ROOM //
            { // Left Wall
                constructor: PhysicsWorldObject,
                bounds: { x: 48, y: -128, width: 16, height: 304 },
                physicsGroup: 'walls',
            },
            { // Right Wall
                constructor: PhysicsWorldObject,
                bounds: { x: 192, y: -128, width: 16, height: 304 },
                physicsGroup: 'walls',
            },
            { // Bottom Wall
                constructor: PhysicsWorldObject,
                bounds: { x: 64, y: 160, width: 128, height: 16 },
                physicsGroup: 'walls',
            },
            { // Background
                constructor: Sprite,
                texture: 'room_bg',
                x: -256, y: -192,
                layer: 'room',
            },
            { // Back wall
                name: 'backwall',
                constructor: BackWall,
                x: 64, y: 0,
                layer: 'room',
                physicsGroup: 'walls',
            },
            { // Bed
                name: 'bed',
                constructor: Sprite,
                texture: 'bed',
                x: 84, y: 158,
                layer: 'main',
                physicsGroup: 'props',
                bounds: { x: -18, y: -20, width: 36, height: 20 },
            },
            { // Chair
                name: 'chair',
                constructor: Sprite,
                texture: 'chair',
                x: 172, y: 134,
                layer: 'main',
            },
            { // Desk
                name: 'desk',
                constructor: Sprite,
                texture: 'desk',
                x: 172, y: 158,
                layer: 'main',
                physicsGroup: 'props',
                bounds: { x: -18, y: -23, width: 36, height: 23 },
            },
            { // Door
                name: 'door',
                constructor: Sprite,
                texture: 'door_closed',
                x: 84, y: 80,
                layer: 'main',
                offset: { x: 0, y: -36 },
                animations: [
                    { name: 'open',   frames: [{ texture: 'door_open' }] },
                    { name: 'closed', frames: [{ texture: 'door_closed' }] },
                ],
                defaultAnimation: 'closed',
            },
            { // Window
                name: 'window',
                constructor: Sprite,
                texture: 'window',
                x: 156, y: 80,
                layer: 'main',
                offset: { x: 0, y: -7 },
                physicsGroup: 'props',
                bounds: { x: -22, y: -3, width: 43, height: 3 },
            },
    
            // WORLD //
            { // Tilemap
                name: 'tilemap',
                constructor: Tilemap,
                x: -720, y: -768,
                layer: 'bg',
                tilemap: 'mainworld',
                collisionPhysicsGroup: 'walls',
            },
            ...group({ // Archway
                worldObjects: archway,
                x: -351, y: -393,
                overrides: [
                    {
                        name: 'cave_warp',
                        data: {
                            stage: 'connector',
                            entryPoint: 'entrance',
                            transition: defaultScreenTransition,
                        }
                    },
                ]
            }),
        ]
    },

    'cave': {
        parent: BASE_STAGE,
        entryPoints: {
            'entrance': { x: 656, y: 626 },
            'exit': { x: 656, y: 626 },
        },
        worldObjects: [
            { // Spotlight
                name: 'spotlight',
                constructor: Sprite,
                x: 0, y: 0,
                layer: 'spotlight',
                texture: 'spotlight',
                ignoreCamera: true,
                visible: false,
            },
            { // Tilemap
                name: 'tilemap',
                constructor: Tilemap,
                x: 0, y: 0,
                layer: 'bg',
                tilemap: 'cave',
                tilemapLayer: 1,
                collisionPhysicsGroup: 'walls',
            },
            { // Tilemap walls
                name: 'tilemap_walls',
                constructor: Tilemap,
                x: 0, y: 0,
                layer: 'fg',
                tilemap: 'cave',
                tilemapLayer: 0,
            },
            ...group({ // Entrance frame
                prefix: 'entrance_',
                worldObjects: entrance_frame,
                x: 656, y: 636,
                overrides: [
                    {
                        name: 'warp',
                        data: {
                            stage: 'main',
                            entryPoint: 'exit',
                            transition: defaultScreenTransition,
                        },
                    }
                ]
            }),
            ...group({ // Exit frame
                prefix: 'exit_',
                worldObjects: entrance_frame,
                x: 656, y: 416,
                overrides: [
                    {
                        name: 'warp',
                        data: {
                            stage: 'connector',
                            entryPoint: 'entrance',
                            transition: defaultScreenTransition,
                        }
                    },
                ]
            }),
        ]
    },

    'connector': {
        parent: BASE_STAGE,
        backgroundColor: 0x000000,
        layers: [
            {
                name: 'bg',
                effects: Effects.partial({
                    silhouette: {
                        color: 0x000000,
                        enabled: true
                    },
                    outline: {
                        color: 0xFFFFFF,
                        enabled: true
                    },
                })
            },
            {
                name: 'main',
                effects: Effects.partial({
                    silhouette: {
                        color: 0x000000,
                        enabled: true
                    },
                    outline: {
                        color: 0xFFFFFF,
                        enabled: true
                    },
                })
            }
        ],
        entryPoints: {
            'entrance': { x: 372, y: 256 },
            'exit': { x: 976, y: 32 },
        },
        camera: {
            bounds: { top: 0 }
        },
        worldObjects: [
            { // Tilemap
                name: 'tilemap',
                constructor: Tilemap,
                x: 0, y: 0,
                layer: 'bg',
                tilemap: 'connector',
                collisionPhysicsGroup: 'walls',
            },
            ...group({ // Archway
                worldObjects: archway,
                x: 369, y: 280,
                overrides: [
                    {
                        name: 'cave_warp',
                        data: {
                            stage: 'cave',
                            entryPoint: 'exit',
                            transition: defaultScreenTransition,
                        }
                    },
                ]
            }),
            { // Exit warp
                constructor: Warp,
                physicsGroup: 'props',
                bounds: { x: 944, y: -16, width: 64, height: 16 },
                data: {
                    stage: 'upper',
                    entryPoint: 'entrance',
                    transition: defaultScreenTransition,
                }
            },
        ]
    },

    'upper': {
        parent: BASE_STAGE,
        entryPoints: {
            'entrance': { x: 224, y: 680 },
        },
        camera: {
            bounds: { bottom: 688 }
        },
        worldObjects: [
            { // Tilemap
                name: 'tilemap',
                constructor: Tilemap,
                x: 0, y: 0,
                layer: 'bg',
                tilemap: 'upper',
                collisionPhysicsGroup: 'walls',
            },
            { // Entrance warp
                constructor: Warp,
                physicsGroup: 'props',
                bounds: { x: 192, y: 704, width: 64, height: 16 },
                data: {
                    stage: 'connector',
                    entryPoint: 'exit',
                    transition: defaultScreenTransition,
                }
            },
        ]
    },
}