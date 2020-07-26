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
                constructor: SmartTilemap,
                x: 0, y: 0,
                tilemap: 'main_tilemap',
                data: {
                    smartConfig: <SmartTilemap.Util.SmartTilemapConfig>{
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
                    }
                },
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
            {
                name: 'tilemapEditor',
                updateCallback: (obj, delta) => {
                    let tilemap = obj.world.getWorldObjectByType(Tilemap);
                    let mouseX = obj.world.getWorldMouseX() - tilemap.x;
                    let mouseY = obj.world.getWorldMouseY() - tilemap.y;
                    let tileX = Math.floor(mouseX / tilemap.tileset.tileWidth);
                    let tileY = Math.floor(mouseY / tilemap.tileset.tileHeight);

                    if (Input.isDown('placeBlock')) {
                        tilemap.setTile(tileX, tileY, { index: 0, angle: 0, flipX: false });
                    }

                    if (Input.isDown('destroyBlock')) {
                        tilemap.setTile(tileX, tileY, { index: -1, angle: 0, flipX: false });
                    }
                }
            },
            <SpriteText.Config>{
                name: 'test',
                constructor: SpriteText,
                text: 'hello world!',
                font: Assets.fonts.DELUXE16,
                style: { color: 0xFF0000 },
                mask: {
                    texture: AssetCache.getTexture('mask'),
                    type: 'screen',
                    offsetx: 0, offsety: 0,
                    invert: true,
                },
                debug: {
                    followMouse: true
                }
            },
        ]
    },
}}