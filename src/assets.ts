namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'blank': {},

        // Debug
        'debug': {},

        // Fonts
        'deluxe16': { spritesheet: { frameWidth: 8, frameHeight: 15 } },

        // Game
        'player': { anchor: Anchor.BOTTOM_CENTER, spritesheet: { frameWidth: 16, frameHeight: 16 } },
        'grapple': { anchor: Anchor.CENTER },

        'world': { anchor: Anchor.CENTER, spritesheet: { frameWidth: 16, frameHeight: 16 } },
        'checkpoint': { anchor: Anchor.CENTER, frames: {
            'checkpoint_low': { rect: rect(0, 0, 16, 16) },
            'checkpoint_high': { rect: rect(16, 0, 16, 16) },
        }},
        'spikes': { anchor: Anchor.CENTER },
        'thwomp': { anchor: Anchor.CENTER, frames: {
            'thwomp_sleep': { rect: rect(0, 0, 16, 16) },
            'thwomp_awake': { rect: rect(16, 0, 16, 16) },
            'thwomp_active': { rect: rect(32, 0, 16, 16) },
        }},
        'bat': { anchor: Anchor.CENTER, spritesheet: { frameWidth: 16, frameHeight: 16 } },
        'mover': { anchor: Anchor.CENTER },
        'cannon': { anchor: Anchor.CENTER },
        'cannonball': { anchor: Anchor.CENTER },
        'bubble': { anchor: Anchor.CENTER },
        'grappledownhelp': { anchor: Anchor.CENTER },

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

        'grappleshoot': {},
        'grapplehit': {},
        'grapplepull': {},
        'thwomphit': { volume: 0.5 },
        'bathit': { volume: 0.5 },
        'break': { volume: 0.5 },
        'enterwater1': { volume: 0.1 },
        'enterwater2': { volume: 0.3 },
        'checkpoint': { volume: 0.4 },
        'checkpoint2': { volume: 0.5 },
        'cannonshoot': { volume: 0.5 },
        'glitch1': {},
        'glitch2': {},
        'glitch3': {},
        'glitch4': {},

        // Music
        'caves': {},
        'boss': {},
    }

    export const tilesets: Dict<Tilemap.Tileset> = {
        'world': {
            tileWidth: 16,
            tileHeight: 16,
            tiles: Preload.allTilesWithPrefix('world_'),
            collisionIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        }
    }

    export const pyxelTilemaps: Dict<Preload.PyxelTilemap> = {
        'world': {
            tileset: tilesets['world'],
        }
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
        'g': (args: string[]) => ({ color: 0x00FF00 }),
    }
}
