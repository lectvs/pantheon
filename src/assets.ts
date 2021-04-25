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
            collisionIndices: [1],
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
