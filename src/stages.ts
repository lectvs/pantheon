/// <reference path="./backWall.ts" />
/// <reference path="./transition.ts" />
/// <reference path="./tilemap.ts" />
/// <reference path="./warp.ts" />

namespace Stages{
    export const MILOS_ROOM: Stage = {
        layers: [
            { name: 'bg' },
            { name: 'room' },
            { name: 'main', sortKey: 'y' },
            { name: 'fg' },
        ],
        physicsGroups: {
            'player': {},
            'props': {},
            'walls': {},
        },
        collisionOrder: [
            { move: 'player', from: ['props', 'walls'], callback: true },
        ],
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
            {
                name: 'backwall',
                constructor: BackWall,
                x: 64, y: 0,
                layer: 'room',
                physicsGroup: 'walls',
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

            // WORLD //
            {
                name: 'tilemap',
                constructor: Tilemap,
                x: -720, y: -768,
                layer: 'bg',
                tileset: Assets.tilesets.mainworld,
                tilemap: 'mainworld',
                collisionPhysicsGroup: 'walls',
            },
            { // Archway
                constructor: Sprite,
                texture: 'archway',
                x: -311, y: -512,
                layer: 'main',
                physicsGroup: 'props',
                bounds: { x: -57, y: 64, width: 57, height: 16 },
            },
            { // Archway Front
                constructor: Sprite,
                texture: 'archway_front',
                x: -351, y: -393,
                layer: 'main',
                physicsGroup: 'props',
                bounds: { x: -49, y: -7, width: 49, height: 16 },
            },
            { // Cave warp
                name: 'warp',
                constructor: Warp,
                physicsGroup: 'props',
                bounds: { x: -400, y: -448, width: 32, height: 48 },
                data: {
                    scene: 'empty',
                    transition: Transition.FADE(0.5, 1, 0.5),
                }
            },
        ]
    }
}