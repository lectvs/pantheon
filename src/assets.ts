namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'blank': {},

        // Debug
        'debug': {},

        // Fonts
        'deluxe16': {
            spritesheet: { frameWidth: 8, frameHeight: 15 },
        },

        // Game

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

    }

    export const pyxelTilemaps: Dict<Preload.PyxelTilemap> = {

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
