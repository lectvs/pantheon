function getStages(): Dict<World.Config> { return {

    'game': {
        parent: BASE_STAGE(),
        camera: {
            movement: { type: 'snap' },
            mode: Camera.Mode.FOCUS(global.gameWidth/2, global.gameHeight/2),
        },
        entryPoints: {
            'main': { x: global.gameWidth/2, y: global.gameHeight/2 },
        },
        worldObjects: [
            <Tilemap.Config>{
                name: 'tiles',
                constructor: Tilemap,
                x: 0, y: 0,
                tilemap: SmartTilemap.Util.getSmartTilemap('main_tilemap', {
                    rules: SmartTilemap.Rule.oneBitRules({
                        airIndex: -1,
                        solidIndex: 0,
                        edgeUpIndex: 1,
                        cornerTopLeftIndex: 2,
                        inverseCornerTopLeftIndex: 3,
                        doubleEdgeHorizontalIndex: 4,
                        peninsulaUpIndex: 5,
                    }),
                    outsideRule: { type: 'extend' },
                    emptyRule: { type: 'noop' },
                }),
                layer: 'main',
                physicsGroup: 'walls',
            },
            <Sprite.Config>{
                name: 'player',
                constructor: Player,
                x: 180, y: 620,
                layer: 'main',
                physicsGroup: 'player',
                controllable: true,
            },
            <Sprite.Config>{
                name: 'box',
                constructor: Box,
                x: 270, y: 220,
                layer: 'main',
                physicsGroup: 'boxes',

            },
            <Sprite.Config>{
                name: 'platform',
                constructor: MovingPlatform,
                texture: 'platform',
                layer: 'main',
                physicsGroup: 'walls',
                bounds: { x: 0, y: 0, width: 128, height: 16 },
                immovable: true,
                data: {
                    pathStart: { x: 192, y: 402 },
                    pathEnd: { x: 320, y: 352 },
                }
            },
            <Sprite.Config>{
                name: 'oneway',
                constructor: OneWayPlatform,
                x: 250, y: 530,
                texture: 'platform',
                layer: 'main',
                physicsGroup: 'walls',
                bounds: { x: 0, y: 0, width: 128, height: 16 },
                immovable: true,
            },
        ]
    },
}}