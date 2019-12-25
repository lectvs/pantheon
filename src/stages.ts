/// <reference path="./base.ts" />
/// <reference path="./tilemap.ts" />

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
            { // Fort walls
                name: 'fort_walls',
                constructor: Tilemap,
                x: 0, y: 0,
                layer: 'main',
                tilemap: 'outside',
                tilemapLayer: 0,
                collisionPhysicsGroup: 'walls',
            },
            { // Ground
                name: 'ground',
                constructor: Tilemap,
                x: 0, y: 0,
                layer: 'bg',
                tilemap: 'outside',
                tilemapLayer: 1,
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
}