namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'none': {},
        'blank': {},

        // Debug
        'debug': {},

        // Fonts
        'deluxe16': {},

        // Game
        'knight': {
            defaultAnchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 16, frameHeight: 24 },
        },
        'hoop': { anchor: Anchor.CENTER },

        'golbin': {
            defaultAnchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 32, frameHeight: 32 },
            frames: {
                'golbin_dead': {
                    anchor: { x: 0.5, y: 28/32 },
                    rect: { x: 0, y: 96, width: 32, height: 32 }
                }
            }
        },
        'bullet': { anchor: Anchor.CENTER },

        'enemyknight': {
            defaultAnchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
            frames: {
                'enemyknight_dead': {
                    anchor: { x: 0.5, y: 21/24 },
                    rect: { x: 0, y: 72, width: 24, height: 24 }
                }
            }
        },

        'mage': {
            defaultAnchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
            frames: {
                'mage_dead': {
                    anchor: { x: 0.5, y: 20/24 },
                    rect: { x: 0, y: 72, width: 24, height: 24 }
                }
            }
        },

        'runner': {
            defaultAnchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
            frames: {
                'runner_dead': {
                    anchor: { x: 0.5, y: 21/24 },
                    rect: { x: 0, y: 72, width: 24, height: 24 }
                }
            }
        },

        'floor': {},
        'lights': {},
        'stairs': { anchor: Anchor.BOTTOM },
        'throne': { anchor: Anchor.BOTTOM },

        'king': {
            defaultAnchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
        },
        'bomb': { anchor: Anchor.BOTTOM },
        'explosion': { anchor: Anchor.CENTER },
        'spawn': { anchor: Anchor.CENTER },

        // UI
        'dialogbox': { anchor: Anchor.CENTER },
        'ui_shield': { anchor: Anchor.CENTER },
        'royalhulatext': {},
        'hoopkingtext': {},
    }

    export const sounds: Dict<Preload.Sound> = {
        // Debug
        'debug': {},

        // Menu
        'click': {},

        // Game
        'walk': {},
        'swing': {},
        'hitenemy': {},
        'hitplayer': {},
        'shoot': {},
        'dash': {},
        'explode': {},
        'shake': {},
        'land': {},
        'dink': {},

        // Music
        'jingle': {},
        'music': {},
        'musicboss': {},
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
