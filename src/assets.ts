namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'blank': {},

        // Debug
        'debug': {},

        // Fonts
        'deluxe16': { spritesheet: { frameWidth: 8, frameHeight: 15 } },

        // Game
        'player': { anchor: Anchor.BOTTOM },
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
