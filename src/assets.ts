namespace Assets {
    export const textures: Dict<Preload.Texture> = {
        'blank': {},

        // Debug
        'debug': {},

        // Menus
        'titlescreen': {},

        // Game
        'mirigram': {
            anchor: Vector2.BOTTOM,
            spritesheet: { frameWidth: 40, frameHeight: 40 },
            frames: {
                'spin': { rect: rect(80, 80, 40, 40), anchor: Vector2.CENTER },
            }
        },
        'diggur': {
            anchor: Vector2.CENTER,
            spritesheet: { frameWidth: 40, frameHeight: 40 },
        },
        'scammir': {
            anchor: Vector2.CENTER,
            spritesheet: { frameWidth: 40, frameHeight: 40 },
        },
        'gobbor': {
            anchor: Vector2.CENTER,
            spritesheet: { frameWidth: 40, frameHeight: 40 },
        },
        'world_bg': {},
        'doors': {
            anchor: Vector2.CENTER,
            frames: {
                'reddoor': { rect: rect(0, 0, 16, 32) },
                'blackdoor': { rect: rect(16, 0, 16, 32) },
                'wooddoor': { rect: rect(32, 0, 16, 32) },
                'wooddoor_side': { rect: rect(0, 32, 48, 16) },
                'movabledoor': { rect: rect(48, 0, 16, 32) },
            }
        },
        'lever': { anchor: Vector2.BOTTOM },
        'glass': {},
        'crackedwall': {},
        'smoke': {
            anchor: Vector2.CENTER,
            frames: {
                'smoke1': { rect: rect(0, 0, 112, 71) },
                'smoke2': { rect: rect(112, 0, 95, 77) },
                'smoke3': { rect: rect(0, 71, 76, 36) },
            }
        },
        'orb': { anchor: Vector2.CENTER },
        'lgdoor_open': {},
        'chest': {
            anchor: Vector2.BOTTOM,
            frames: {
                'chest_closed': { rect: rect(0, 0, 56, 72) },
                'chest_open': { rect: rect(56, 0, 56, 72) },
            }
        },
        'prank': { anchor: Vector2.BOTTOM },
        'note': { anchor: Vector2.CENTER },

        // Cutscene
        'THE': { anchor: Vector2.CENTER },
        'UNDERMINE': { anchor: Vector2.CENTER },

        // UI
        'dialogbox': { anchor: Vector2.CENTER },
        'dialogbox_name': { anchor: Vector2.CENTER },
        'itemboxes': {},
        'itemicons': {
            anchor: Vector2.CENTER,
            frames: {
                'cane': { rect: rect(0, 0, 16, 16) },
                'wad': { rect: rect(16, 0, 16, 16) },
                'redkey': { rect: rect(32, 0, 16, 16) },
                'blackkey': { rect: rect(48, 0, 16, 16) },
                'blackkey_upsidedown': { rect: rect(0, 16, 16, 16) },
                'string': { rect: rect(16, 16, 16, 16) },
                'nickel': { rect: rect(32, 16, 16, 16) },
            }
        },
        'pressx': { anchor: Vector2.CENTER },
        'pressright': { anchor: Vector2.CENTER },
    }

    export const sounds: Dict<Preload.Sound> = {
        // Debug
        'debug': {},

        // Menu
        'click': {},

        // Game
        'dialogstart': { url: 'assets/click.wav', volume: 0.5 },
        'dialogspeak': { url: 'assets/non_npc_text_blip_sound.ogg', volume: 2, speed: 1.5 },
        'dialogspeak_diggur': { url: 'assets/npc_talk_sound.ogg', volume: 2 },
        'dialogspeak_scammir': { url: 'assets/npc_talk_sound.ogg', volume: 2, speed: 1.25},
        'jump': { url: 'assets/newjump_sound.ogg', volume: 0.7 },
        'walk': { url: 'assets/smaller_tap_sound.ogg', volume: 0.3 },
        'land': { url: 'assets/medium_crush_sound.ogg', volume: 0.4 },
        'door': { url: 'assets/door_shuffle.ogg', volume: 1 },
        'crush': { url: 'assets/crush_sound.ogg', volume: 1 },
        'theundermine': { url: 'assets/fwhaaaaah.ogg', volume: 1 },
        'item_get': { url: 'assets/item_get.ogg', volume: 0.5 },
        'menu_blip': { url: 'assets/menu_blip_sound.ogg', volume: 0.5 },
        'trip': { url: 'assets/newjump_sound.ogg', volume: 1 },
        'hjonk': { url: 'assets/hjonk.ogg', volume: 0.75 },

        // Music
        'house': { url: 'assets/Barry_s_Bungalow.ogg', volume: 0.3 },
        'caverns': { url: 'assets/main_cavern_bgm.ogg', volume: 0.75 },
        'credits': { url: 'assets/factsetc.ogg', volume: 0.75 },
    }

    export const tilesets: Dict<Preload.Tileset> = {
        'tiles': {
            tileWidth: 16,
            tileHeight: 16,
            collisionIndices: [ 1 ],
        },
    }

    export const pyxelTilemaps: Dict<Preload.PyxelTilemap> = {
        'world': {},
    }

    export const fonts: Dict<Preload.Font> = {
        'deluxe16': {
            charWidth: 8,
            charHeight: 15,
            spaceWidth: 8,
            newlineHeight: 15,
        },
        'andrfw': {
            charWidth: 8,
            charHeight: 19,
            spaceWidth: 8,
            newlineHeight: 16,
        },
    }

    export const spriteTextTags: Dict<SpriteText.TagFunction> = {
        'g': (args: string[]) => ({ color: 0x00FF00 }),
    }
}
