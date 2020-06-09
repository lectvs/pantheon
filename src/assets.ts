namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'none': {},
        'blank': {},

        // Debug
        'debug': {},

        // Entities
        'player': {
            defaultAnchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 16, frameHeight: 16 },
        },
        'trees': {
            defaultAnchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 32, frameHeight: 52 },
        },
        'leaves': {
            defaultAnchor: Anchor.BOTTOM,
            frames: {
                'blacktreeleaf': {
                    rect: { x: 0, y: 0, width: 5, height: 4 }
                },
                'whitetreeleaf': {
                    rect: { x: 0, y: 4, width: 5, height: 4 }
                },
            }
        },
        'door': {
            defaultAnchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 32, frameHeight: 35 },
        },
        'monster': {
            defaultAnchor: Anchor.BOTTOM,
            spritesheet: { frameWidth: 16, frameHeight: 16 },
        },

        // Items
        'items': {
            defaultAnchor: Anchor.CENTER,
            frames: {
                'log': { rect: { x: 0*16, y: 0, width: 16, height: 16 } },
                'axe': { rect: { x: 1*16, y: 0, width: 16, height: 16 } },
                'key': { rect: { x: 2*16, y: 0, width: 16, height: 16 } },
                'torch': { rect: { x: 3*16, y: 0, width: 16, height: 16 } },
                'gasoline': { rect: { x: 4*16, y: 0, width: 16, height: 16 } },
            }
        },

        // Props
        'campfire': {
            anchor: Anchor.CENTER
        },
        'fire': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 16, frameHeight: 16 }

        },
        'smoke': {
            anchor: Anchor.BOTTOM
        },

        // Scenery
        'world': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            spritesheet: { frameWidth: 16, frameHeight: 16 }
        },
        'ground': {
            anchor: Anchor.CENTER
        },

        // Fonts
        'deluxe16': {},
    }

    export const tilesets: Dict<Tilemap.Tileset> = {
        'world': {
            tiles: Preload.allTilesWithPrefix('world_'),
            tileWidth: 16,
            tileHeight: 16,
            animation: {
                frames: 3,
                tilesPerFrame: 16,
                frameRate: 3,
            },
            collisionIndices: [1],
        },
    }

    export const pyxelTilemaps: Dict<Preload.PyxelTilemap> = {
        'world': {
            url: 'assets/world.json',
            tileset: tilesets['world']
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
        'e': (params) => {
            return { color: 0x424242 };
        },
    }
}
