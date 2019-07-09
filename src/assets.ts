/// <reference path="./preload.ts" />

namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'none': {},
        'blank': {},
        'debug': {},
        'dialogbox': {
            anchor: { x: 0.5, y: 0.5 },
        },
        'indicator': {},

        'room_bg': {},
        'room_backwall': {
            rect: { x: 0, y: 0, width: 128, height: 80 },
        },

        'milo_sprites': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 32, frameHeight: 36 },
        },

        'milo_demon_sprites': {

        },

        'angie_sprites': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 32, frameHeight: 36 },
        },

        'props': {
            defaultAnchor: { x: 0.5, y: 1 },
            frames: {
                'bed': {
                    rect: { x: 2, y: 2, width: 36, height: 27 },
                },
                'door_closed': {
                    rect: { x: 40, y: 2, width: 24, height: 36 },
                    anchor: { x: 0, y: 0 },
                },
                'door_open': {
                    rect: { x: 66, y: 2, width: 4, height: 45 },
                    anchor: { x: 0, y: 0 },
                },
                'window': {
                    rect: { x: 72, y: 2, width: 44, height: 35 },
                },
                'chair': {
                    rect: { x: 2, y: 31, width: 12, height: 17 },
                },
                'desk': {
                    rect: { x: 16, y: 40, width: 36, height: 34 },
                },
            }
        },

        'testtiles': {
            spritesheet: { frameWidth: 16, frameHeight: 16 },
        },

        'tilestest': {
            spritesheet: { frameWidth: 16, frameHeight: 16 },
        },

        'mainworld': {
            url: 'assets/tilemap/mainworld.png',
            spritesheet: { frameWidth: 16, frameHeight: 16 },
        },

        // Portraits
        'portraits/milo': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'milo/happy': {
                    rect: { x: 0, y: 0, width: 74, height: 54 },
                },
            }
        },

        // Fonts
        'deluxe16': {
            rect: { x: 0, y: 0, width: 8, height: 15 },
            anchor: { x: 0, y: 0 },
        },
    }

    export const pyxelTilemaps: Dict<Preload.PyxelTilemap> = {
        'mainworld': {
            url: 'assets/tilemap/mainworld.json',
        },
    }

    export class fonts {
        static DELUXE16: SpriteText.Font = {
            texture: 'deluxe16',
            charWidth: 8,
            charHeight: 15,
            spaceWidth: 8,
        }
    }

    export const tags: Dict<SpriteText.TagFunction> = {

    }
}
