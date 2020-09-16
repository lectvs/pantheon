namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'none': {},
        'blank': {},

        // Debug
        'debug': {},

        // Fonts
        'deluxe16': {},

        // Tiles
        'tiles': {
            defaultAnchor: Anchor.CENTER,
            spritesheet: { frameWidth: 32, frameHeight: 32 },
        },

        'player': {
            anchor: Anchor.BOTTOM,
        },
        'platform': {},
        'circle': {
            anchor: Anchor.CENTER,
        },
        'slope': {},
        'bec': {
            anchor: Anchor.CENTER,
        },
        'gradient': {
            anchor: Anchor.CENTER,
        },
    }

    export const sounds: Dict<Preload.Sound> = {
        // Debug
        'debug': {},

        // SFX
        'click': {},
    }

    export const tilesets: Dict<Tilemap.Tileset> = {
        'tiles': {
            tiles: Preload.allTilesWithPrefix('tiles_'),
            tileWidth: 32,
            tileHeight: 32,
            collisionIndices: [0, 1, 2, 3, 4, 5],
        }
    }

    export const pyxelTilemaps: Dict<Preload.PyxelTilemap> = {
        'main_tilemap': {
            tileset: Assets.tilesets['tiles'],
            url: 'assets/tiles.json'
        }
    }

    export class fonts {
        static DELUXE16: SpriteText.Font = {
            texture: 'deluxe16',
            charWidth: 8,
            charHeight: 15,
            spaceWidth: 8,
            newlineHeight: 15,
        }
    }

    export const spriteTextTags: Dict<SpriteText.TagFunction> = {
    }
}
