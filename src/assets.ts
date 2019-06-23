/// <reference path="./preload.ts" />

namespace Assets {
    export const textures: {[key: string]: Preload.Texture} = {
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
            anchor: { x: 0.5, y: 1 },
            frames: Preload.spritesheet({ prefix: 'milo_sprites_', frameWidth: 32, frameHeight: 36, numFramesX: 8, numFramesY: 4 }),
            // frames: {
            //     'milo_sprites_idle_0': {
            //         rect: { x: 0, y: 0, width: 32, height: 36 },
            //     },
            //     'milo_sprites_idle_1': {
            //         rect: { x: 32, y: 0, width: 32, height: 36 },
            //     },
            // }
        },

        'milo_demon_sprites': {

        },

        'angie_sprites': {

        },

        'props': {
            anchor: { x: 0.5, y: 1 },
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

        // Portraits
        'portraits/milo': {
            anchor: { x: 0.5, y: 0.5 },
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
        }
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
