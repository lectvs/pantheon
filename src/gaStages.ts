/// <reference path="./base.ts" />
/// <reference path="./raytracer.ts" />
/// <reference path="./tilemap.ts" />
/// <reference path="./warp.ts" />

const stages: Dict<Stage> = {

    'outside': {
        parent: BASE_STAGE,
        camera: {
            bounds: { left: 0, top: 0, right: 240, bottom: 180 },
        },
        entryPoints: {
            'main': { x: 120, y: 156 },
        },
        worldObjects: [
            ...WORLD_BOUNDS(0, 0, 240, 180),
            {
                name: 'fort_walls',
                constructor: Tilemap,
                layer: 'main',
                tilemap: 'outside',
                tilemapLayer: 0,
                collisionPhysicsGroup: 'walls',
            },
            {
                name: 'ground',
                constructor: Tilemap,
                layer: 'bg',
                tilemap: 'outside',
                tilemapLayer: 1,
            },
            {
                name: 'warp',
                constructor: Warp,
                physicsGroup: 'props',
                bounds: { x: 108, y: 96, width: 24, height: 2 },
                data: {
                    stage: 'inside',
                    entryPoint: 'main',
                    transition: DEFAULT_SCREEN_TRANSITION
                }
            },
            {
                name: 'guard1',
                parent: HUMAN_CHARACTER('generic_sprites'),
                x: 96, y: 100,
                flipX: true,
            },
            {
                name: 'guard2',
                parent: HUMAN_CHARACTER('generic_sprites'),
                x: 144, y: 100,
            },
        ]
    },
    'inside': {
        parent: BASE_STAGE,
        camera: {
            bounds: { left: 0, top: 0, right: 240, bottom: 360 },
        },
        entryPoints: {
            'main': { x: 120, y: 296 },
        },
        worldObjects: [
            ...WORLD_BOUNDS(0, 0, 240, 360),
            {
                name: 'ground',
                constructor: Tilemap,
                layer: 'main',
                tilemap: 'inside',
                tilemapLayer: 0,
                collisionPhysicsGroup: 'walls',
            },
            {
                name: 'warp',
                constructor: Warp,
                physicsGroup: 'props',
                bounds: { x: 180, y: 84, width: 12, height: 36 },
                data: {
                    stage: 'hallway',
                    entryPoint: 'main',
                    transition: DEFAULT_SCREEN_TRANSITION
                }
            },
        ]
    },
    'hallway': {
        parent: BASE_STAGE,
        camera: {
            bounds: { left: 0, top: 0, right: 240, bottom: 540 },
        },
        entryPoints: {
            'main': { x: 64, y: 438 },
        },
        worldObjects: [
            ...WORLD_BOUNDS(0, 0, 240, 540),
            {
                name: 'ground',
                constructor: Tilemap,
                layer: 'main',
                tilemap: 'hallway',
                tilemapLayer: 0,
                collisionPhysicsGroup: 'walls',
            },
            {
                name: 'demon1',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 72, y: 408,
                flipX: true,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon2',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 168, y: 408,
                flipX: false,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon3',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 72, y: 300,
                flipX: true,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon4',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 168, y: 300,
                flipX: false,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon5',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 72, y: 192,
                flipX: true,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon6',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 168, y: 192,
                flipX: false,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon7',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 72, y: 84,
                flipX: true,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'demon8',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 168, y: 84,
                flipX: false,
                effects: {
                    outline: { color: 0xFFFFFF }
                },
                physicsGroup: 'props',
            },
            {
                name: 'warp',
                constructor: Warp,
                physicsGroup: 'props',
                bounds: { x: 96, y: 48, width: 48, height: 12 },
                data: {
                    stage: 'escaperoom',
                    entryPoint: 'main',
                    transition: DEFAULT_SCREEN_TRANSITION
                }
            },
        ]
    },
    'escaperoom': {
        parent: BASE_STAGE,
        camera: {
            bounds: { left: 0, top: 0, right: 240, bottom: 180 },
        },
        entryPoints: {
            'main': { x: 120, y: 130 },
        },
        worldObjects: [
            ...WORLD_BOUNDS(0, 0, 240, 180),
            {
                name: 'ground',
                constructor: Tilemap,
                layer: 'main',
                tilemap: 'escaperoom',
                tilemapLayer: 0,
                collisionPhysicsGroup: 'walls',
            },
        ]
    },
}