function getStages(): Dict<World.Config> { return {

    'game': {
        parent: BASE_STAGE(),
        camera: {
            movement: { type: 'snap' },
            mode: Camera.Mode.FOCUS(Main.width/2, Main.height/2),
        },
        entryPoints: {
            'main': { x: Main.width/2, y: Main.height/2 },
        },
        worldObjects: [
            {
                name: 'testSoundController',
                updateCallback: (obj, delta) => {
                    if (Input.justDown('1')) {
                        obj.world.playSound('debug');
                    }
                }
            },
            <Tilemap.Config>{
                name: 'tiles',
                constructor: Tilemap,
                x: 0, y: 0,
                tilemap: 'main_tilemap',
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
                x: 270, y: 226,
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