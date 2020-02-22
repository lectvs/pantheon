/// <reference path="./preload.ts" />

namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'none': {},
        'blank': {},
        'dialogbox': {
            anchor: { x: 0.5, y: 0.5 },
        },

        // Debug
        'debug': {},

        // Character sprites
        'generic_sprites': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 32, frameHeight: 36 },
        },
        'generic_sprites_dark': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 32, frameHeight: 36 },
        },

        // Props
        'spotlight': {},

        // 'props': {
        //     defaultAnchor: { x: 0.5, y: 1 },
        //     frames: {
        //         'bed': {
        //             rect: { x: 2, y: 2, width: 36, height: 27 },
        //         },
        //         'door_closed': {
        //             rect: { x: 40, y: 2, width: 24, height: 36 },
        //         },
        //         'door_open': {
        //             rect: { x: 66, y: 2, width: 4, height: 45 },
        //         },
        //         'window': {
        //             rect: { x: 72, y: 2, width: 44, height: 35 },
        //         },
        //         'chair': {
        //             rect: { x: 2, y: 31, width: 12, height: 17 },
        //         },
        //         'desk': {
        //             rect: { x: 16, y: 40, width: 36, height: 34 },
        //         },
        //         'stone_frame': {
        //             rect: { x: 117, y: 2, width: 16, height: 72 },
        //             anchor: { x: 0, y: 1 },
        //         },
        //         'archway': {
        //             rect: { x: 174, y: 2, width: 80, height: 119 },
        //             anchor: { x: 1, y: 0 },
        //         },
        //         'archway_front': {
        //             rect: { x: 174, y: 2, width: 40, height: 119 },
        //             anchor: { x: 1, y: 1 },
        //         },
        //     }
        // },

        // Tilesets
        'outside': {
            url: 'assets/tilemap/outside.png',
            spritesheet: { frameWidth: 12, frameHeight: 12 },
        },
        'inside': {
            url: 'assets/tilemap/inside.png',
            spritesheet: { frameWidth: 12, frameHeight: 12 },
        },

        // Portraits
        'portraits/sai': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'sai/default': {
                    rect: { x: 0*74, y: 0*54, width: 74, height: 54 },
                },
            }
        },
        'portraits/dad': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'dad/default': {
                    rect: { x: 0*74, y: 0*54, width: 74, height: 54 },
                },
            }
        },
        'portraits/demon': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'demon/default': {
                    rect: { x: 0*74, y: 0*54, width: 74, height: 54 },
                },
            }
        },
        'portraits/guard1': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'guard1/default': {
                    rect: { x: 0*74, y: 0*54, width: 74, height: 54 },
                },
            }
        },
        'portraits/guard2': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            frames: {
                'guard2/default': {
                    rect: { x: 0*74, y: 0*54, width: 74, height: 54 },
                },
            }
        },

        // Fonts
        'deluxe16': {},
    }

    export const tilesets: Dict<Tilemap.Tileset> = {
        'outside': {
            tiles: Preload.allTilesWithPrefix('outside_'),
            tileWidth: 12,
            tileHeight: 12,
            collisionIndices: [ 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
        },
        'inside': {
            tiles: Preload.allTilesWithPrefix('inside_'),
            tileWidth: 12,
            tileHeight: 12,
            collisionIndices: [ -1, 0 ],
        },
    }

    export const pyxelTilemaps: Dict<Preload.PyxelTilemap> = {
        'outside': {
            url: 'assets/tilemap/outside.json',
            tileset: tilesets.outside,
        },
        'inside': {
            url: 'assets/tilemap/inside.json',
            tileset: tilesets.inside,
        },
        'hallway': {
            url: 'assets/tilemap/hallway.json',
            tileset: tilesets.inside,
        },
        'escaperoom': {
            url: 'assets/tilemap/escaperoom.json',
            tileset: tilesets.inside,
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
