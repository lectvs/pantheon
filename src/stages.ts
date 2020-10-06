function getStages(): Dict<World.Config> { return {

    'game': {
        parent: BASE_STAGE(),
        camera: {
            mode: Camera.Mode.FOLLOW('player'),
            movement: BASE_CAMERA_MOVEMENT(),
        },
        entryPoints: {
            'main': { x: global.gameWidth/2, y: global.gameHeight/2 },
        },
        worldObjects: [
            {
                constructor: UI,
            },
            {
                constructor: WaveController,
            },
            WORLD_BOUNDS(0, 192, 768, 768),
            <Sprite.Config>{
                name: 'floor',
                constructor: Sprite,
                x: 0, y: 0,
                texture: AssetCache.getTexture('floor').clone(),
                layer: 'bg',
            },
            <Sprite.Config>{
                name: 'lights',
                constructor: Sprite,
                x: 0, y: 0,
                texture: 'lights',
                layer: 'fg',
            },
            <Sprite.Config>{
                name: 'stairs',
                constructor: Sprite,
                x: 384, y: 340,
                texture: 'stairs',
                layer: 'main',
                physicsGroup: 'walls',
                bounds: { type: 'rect', x: -78, y: -112, width: 156, height: 112 },
            },
            <Sprite.Config>{
                name: 'throne',
                constructor: Throne,
                x: 384, y: 268,
                layer: 'king_start',
                physicsGroup: 'enemies',
                colliding: false,
            },
            <Sprite.Config>{
                name: 'guard',
                constructor: Sprite,
                x: 342, y: 352,
                texture: 'enemyknight_0',
                tint: 0xFFFF00,
                effects: {
                    outline: { color: 0x000000 },
                },
                layer: 'main',
                animations: [
                    Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight_', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                ],
                defaultAnimation: 'idle',
            },
            <Sprite.Config>{
                name: 'guard',
                constructor: Sprite,
                x: 428, y: 352,
                texture: 'enemyknight_0',
                flipX: true,
                tint: 0xFF00FF,
                effects: {
                    outline: { color: 0x000000 },
                },
                layer: 'main',
                animations: [
                    Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight_', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                ],
                defaultAnimation: 'idle',
            },
            <Sprite.Config>{
                name: 'player',
                constructor: Player,
                x: 384, y: 750,
                layer: 'main',
                physicsGroup: 'player',
                controllable: true,
            },
        ]
    },
}}