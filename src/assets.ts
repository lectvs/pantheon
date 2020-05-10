namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'none': {},
        'blank': {},

        // Debug
        'debug': {},

        // Entities
        'player': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 16, frameHeight: 16 },
        },
        'trees': {
            defaultAnchor: { x: 0.5, y: 1 },
            frames: {
                'blacktree': { rect: { x: 0*32, y: 0, width: 32, height: 52 } },
                'whitetree': { rect: { x: 1*32, y: 0, width: 32, height: 52 } },
            }
        },
        'door': {
            anchor: { x: 0.5, y: 1 }
        },
        'monster': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 16, frameHeight: 16 },
        },

        // Items
        'items': {
            defaultAnchor: { x: 0.5, y: 0.5 },
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
            anchor: { x: 0.5, y: 0.5 }
        },
        'fire': {
            defaultAnchor: { x: 0.5, y: 1 },
            spritesheet: { frameWidth: 16, frameHeight: 16 }

        },
        'smoke': {
            anchor: { x: 0.5, y: 1 }
        },

        // Scenery
        'world': {
            defaultAnchor: { x: 0.5, y: 0.5 },
            spritesheet: { frameWidth: 16, frameHeight: 16 }
        },
        'ground': {
            anchor: { x: 0.5, y: 0.5 }
        },

        // Fonts
        'deluxe16': {},
    }

    export const tilesets: Dict<Tilemap.Tileset> = {
        'world': {
            tiles: Preload.allTilesWithPrefix('world_'),
            tileWidth: 16,
            tileHeight: 16,
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

    export const tags: Dict<SpriteText.TagFunction> = {

    }
}
