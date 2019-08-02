/// <reference path="./backWall.ts" />
/// <reference path="./room.ts" />
/// <reference path="./transition.ts" />
/// <reference path="./tilemap.ts" />

const stages: Dict<Stage> = {

    'main_with_backwall': {
        parent: MILOS_ROOM,
        entryPoints: {
            'room_middle': { x: 128, y: 96 },
        },
        worldObjects: [
            {
                name: 'backwall',
                constructor: BackWall,
                x: 64, y: 0,
                layer: 'room',
                physicsGroup: 'walls',
            },
            {
                name: 'cave_warp',
                data: {
                    stage: 'empty',
                    entryPoint: 'room_middle',
                    transition: Transition.FADE(0.5, 1, 0.5),
                }
            },
        ]
    },

    'empty': {
        layers: [
            { name: 'bg' },
            { name: 'main' },
        ],
        physicsGroups: {
            'player': {},
        },
        entryPoints: {
            'room_middle': { x: 40, y: 96 },
        },
        worldObjects: [
            {
                name: 'room',
                constructor: Sprite,
                x: -256, y: -192,
                texture: 'room_bg',
                layer: 'bg',
            },
            {
                name: 'backwall',
                constructor: BackWall,
                x: 64, y: 0,
                layer: 'bg',
            },
        ]
    }

}