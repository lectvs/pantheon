namespace Stages{
    export const MILOS_ROOM: Stage = {
        layers: [
            { name: 'bg' },
            { name: 'room' },
            { name: 'main', sortKey: 'y', },
            { name: 'fg' },
        ],
        physicsGroups: {
            'player': {},
            'props': {},
            'walls': {},
        },
        collisionOrder: [
            { move: 'player', from: ['props', 'walls'] },
        ],
        worldObjects: [
            { // Left Wall
                constructor: PhysicsWorldObject,
                bounds: { x: 48, y: 64, width: 16, height: 112 },
                physicsGroup: 'walls',
            },
            { // Right Wall
                constructor: PhysicsWorldObject,
                bounds: { x: 192, y: 64, width: 16, height: 112 },
                physicsGroup: 'walls',
            },
            // { // Top Wall
            //     constructor: PhysicsWorldObject,
            //     bounds: { x: 64, y: 64, width: 128, height: 16 },
            //     physicsGroup: 'walls',
            // },
            { // Bottom Wall
                constructor: PhysicsWorldObject,
                bounds: { x: 64, y: 160, width: 128, height: 16 },
                physicsGroup: 'walls',
            },
            { // Background
                constructor: Sprite,
                texture: 'room_bg',
                layer: 'room',
            },
            {
                name: 'backwall',
                constructor: Sprite,
                texture: 'room_backwall',
                x: 64, y: 0,
                layer: 'room',
            },
            {
                name: 'bed',
                constructor: Sprite,
                texture: 'bed',
                x: 84, y: 158,
                layer: 'main',
                physicsGroup: 'props',
                bounds: { x: -18, y: -20, width: 36, height: 20 },
            },
            {
                name: 'chair',
                constructor: Sprite,
                texture: 'chair',
                x: 172, y: 134,
                layer: 'main',
            },
            {
                name: 'desk',
                constructor: Sprite,
                texture: 'desk',
                x: 172, y: 158,
                layer: 'main',
                physicsGroup: 'props',
                bounds: { x: -18, y: -23, width: 36, height: 23 },
            },
            {
                name: 'door',
                constructor: Sprite,
                texture: 'door_closed',
                x: 84, y: 80,
                layer: 'main',
                offset: { x: 0, y: -36 },
            },
            {
                name: 'window',
                constructor: Sprite,
                texture: 'window',
                x: 156, y: 80,
                layer: 'main',
                offset: { x: 0, y: -7 },
                physicsGroup: 'props',
                bounds: { x: -22, y: -3, width: 43, height: 3 },
            },
        ]
    }
}