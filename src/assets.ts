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
        'props': {
            defaultAnchor: { x: 0.5, y: 1 },
            frames: {
                'door_closed': {
                    rect: { x: 0, y: 0, width: 24, height: 36 },
                    anchor: { x: 0, y: 0 },
                },
                'door_open': {
                    rect: { x: 24, y: 0, width: 4, height: 48 },
                    anchor: { x: 0, y: 0 },
                },
                'keypad': {
                    rect: { x: 28, y: 0, width: 9, height: 12 },
                    anchor: { x: 0, y: 0 },
                },
            }
        },

        // Tilesets
        'outside': {
            url: 'assets/tilemap/outside.png',
            spritesheet: { frameWidth: 12, frameHeight: 12 },
        },
        'inside': {
            url: 'assets/tilemap/inside.png',
            spritesheet: { frameWidth: 12, frameHeight: 12 },
        },
        'cave': {
            url: 'assets/tilemap/cave.png',
            spritesheet: { frameWidth: 16, frameHeight: 16 },
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
        'cave': {
            tiles: Preload.allTilesWithPrefix('cave_'),
            tileWidth: 16,
            tileHeight: 16,
            collisionIndices: [ 16 ],
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
        'cave': {
            url: 'assets/tilemap/cave.json',
            tileset: tilesets.cave,
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
