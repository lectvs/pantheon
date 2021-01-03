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
        'knight': {
            anchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 16, frameHeight: 24 },
        },
        'hoop': { anchor: Anchor.CENTER },

        'golbin': {
            anchor: Anchor.BOTTOM,
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
            anchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
            frames: {
                'enemyknight_dead': {
                    anchor: { x: 0.5, y: 21/24 },
                    rect: { x: 0, y: 72, width: 24, height: 24 }
                }
            }
        },

        'mage': {
            anchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
            frames: {
                'mage_dead': {
                    anchor: { x: 0.5, y: 20/24 },
                    rect: { x: 0, y: 72, width: 24, height: 24 }
                }
            }
        },

        'runner': {
            anchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
            frames: {
                'runner_dead': {
                    anchor: { x: 0.5, y: 21/24 },
                    rect: { x: 0, y: 72, width: 24, height: 24 }
                }
            }
        },

        'jester': {
            anchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 24, frameHeight: 24 },
            frames: {
                'jester_dead': {
                    anchor: { x: 0.5, y: 21/24 },
                    rect: { x: 0, y: 72, width: 24, height: 24 }
                }
            }
        },
        'ball': { anchor: Anchor.CENTER },

        'shadow': { anchor: Anchor.CENTER },

        'floor': {},
        'lights': {},
        'stairs': { anchor: Anchor.BOTTOM },
        'throne': { anchor: Anchor.BOTTOM },

        'king': {
            anchor: Anchor.BOTTOM,
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
        'dialogstart': { url: 'assets/click.wav', volume: 0.5 },
        'dialogspeak': { volume: 0.25 },


        'walk': { volume: 0.5 },
        'swing': { volume: 0.5 },
        'hitenemy': {},
        'hitplayer': {},
        'shoot': {},
        'dash': {},
        'explode': { volume: 0.5 },
        'shake': { volume: 0.5 },
        'land': {},
        'dink': { volume: 0.5 },

        // Music
        'jingle': { volume: 0.5 },
        'music': { volume: 0.5 },
        'musicboss': { volume: 0.5 },
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
