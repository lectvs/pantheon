/// <reference path="./base.ts" />
/// <reference path="./tilemap.ts" />
/// <reference path="./warp.ts" />

const stages: Dict<Stage> = {

    'outside': {
        parent: BASE_STAGE,
        camera: {
            bounds: { left: 0, top: 0, right: 240, bottom: 180 },
            mode: {
                type: 'focus',
                point: { x: 120, y: 90 }
            }
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
            mode: {
                type: 'focus',
                point: { x: 120, y: 270 }
            }
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
                //bounds: { x: 108, y: 96, width: 24, height: 2 },
                data: {
                    stage: 'inside',
                    entryPoint: 'main',
                    transition: DEFAULT_SCREEN_TRANSITION
                }
            },
        ]
    },
}