namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'blank': {},

        // Debug
        'debug': {},

        // Fonts
        'deluxe16': { spritesheet: { frameWidth: 8, frameHeight: 15 } },

        // Game
        'player': { anchor: Anchor.BOTTOM },
        'splotches': {
            anchor: Anchor.CENTER,
            frames: {
                'splotch_0': { rect: rect(0, 0, 11, 8) },
                'splotch_1': { rect: rect(12, 0, 12, 9), anchor: pt(2/12, 7/9) },
                'splotch_2': { rect: rect(25, 0, 9, 9), anchor: pt(8/9, 7/9) },
                'splotch_3': { rect: rect(35, 0, 5, 5) },
                'splotch_4': { rect: rect(41, 0, 7, 8) },
                'splotch_5': { rect: rect(49, 0, 4, 4) },
            }
        },
        'world': {
            anchor: Anchor.CENTER,
            spritesheet: { frameWidth: 16, frameHeight: 16 }
        },
        'base_tiles': {
            anchor: Anchor.CENTER,
            spritesheet: { frameWidth: 16, frameHeight: 16 }
        },

        // UI
        'dialogbox': { anchor: Anchor.CENTER },
    }

    export const sounds: Dict<Preload.Sound> = {
        // Debug
        'debug': {},

        // Menu
        'click': {},

        // Game
        'dialogstart': { url: 'assets/click.wav', volume: 0.5 },
        'dialogspeak': { volume: 0.25 },

        // Music
    }

    export const tilesets: Dict<Tilemap.Tileset> = {
        'world': {
            tileWidth: 16,
            tileHeight: 16,
            tiles: Preload.allTilesWithPrefix('world_'),
            collisionIndices: [0],
        },
        'base': {
            tileWidth: 16,
            tileHeight: 16,
            tiles: Preload.allTilesWithPrefix('base_tiles_'),
        },
    }

    export const pyxelTilemaps: Dict<Preload.PyxelTilemap> = {
        'world': {
            tileset: tilesets.world,
        },
    }

    export class fonts {
        static DELUXE16: SpriteText.Font = {
            texturePrefix: 'deluxe16',
            charWidth: 8,
            charHeight: 15,
            spaceWidth: 8,
            newlineHeight: 15,
        }
    }

    export const spriteTextTags: Dict<SpriteText.TagFunction> = {
    }
}
