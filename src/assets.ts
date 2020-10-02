namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'none': {},
        'blank': {},

        // Debug
        'debug': {},

        // Fonts
        'deluxe16': {},
    }

    export const sounds: Dict<Preload.Sound> = {
        // Debug
        'debug': {},

        // SFX
        'click': {},
    }

    export const tilesets: Dict<Tilemap.Tileset> = {

    }

    export const pyxelTilemaps: Dict<Preload.PyxelTilemap> = {

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
