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
                constructor: Sprite,
                x: 160, y: 640,
                layer: 'main',
                texture: 'slope',
                scaleX: -32/100, scaleY: 32/100,
                tint: 0x000000,
                physicsGroup: 'walls',
                bounds: { type: 'slope', x: -32, y: 0, width: 32, height: 32, direction: 'upright' },
            },
            <Sprite.Config>{
                constructor: Sprite,
                x: 288, y: 640,
                layer: 'main',
                texture: 'slope',
                scaleX: 32/100, scaleY: 32/100,
                tint: 0x000000,
                physicsGroup: 'walls',
                bounds: { type: 'slope', x: 0, y: 0, width: 32, height: 32, direction: 'upleft' },
            },
            <Sprite.Config>{
                constructor: Sprite,
                x: 320, y: 608,
                layer: 'main',
                texture: 'slope',
                scaleX: 96/100, scaleY: 32/100,
                tint: 0x000000,
                physicsGroup: 'walls',
                bounds: { type: 'slope', x: 0, y: 0, width: 96, height: 32, direction: 'upleft' },
            },
            <Sprite.Config>{
                constructor: Sprite,
                x: 416, y: 576,
                layer: 'main',
                texture: 'slope',
                scaleX: 32/100, scaleY: 32/100,
                tint: 0x000000,
                physicsGroup: 'walls',
                bounds: { type: 'slope', x: 0, y: 0, width: 32, height: 32, direction: 'upleft' },
            },
            <Sprite.Config>{
                constructor: Sprite,
                x: 448, y: 544,
                layer: 'main',
                texture: 'slope',
                scaleX: 32/100, scaleY: 32/100,
                tint: 0x000000,
                physicsGroup: 'walls',
                bounds: { type: 'slope', x: 0, y: 0, width: 32, height: 32, direction: 'upleft' },
            },
            <Sprite.Config>{
                constructor: Sprite,
                x: 480, y: 448,
                layer: 'main',
                texture: 'slope',
                scaleX: 32/100, scaleY: 96/100,
                tint: 0x000000,
                physicsGroup: 'walls',
                bounds: { type: 'slope', x: 0, y: 0, width: 32, height: 96, direction: 'upleft' },
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
                texture: 'circle',
                scaleX: 32/200,
                scaleY: 32/200,
                layer: 'main',
                physicsGroup: 'boxes',
                mass: 1,
            },
            <Sprite.Config>{
                name: 'platform',
                constructor: MovingPlatform,
                texture: 'platform',
                layer: 'main',
                physicsGroup: 'walls',
                bounds: { type: 'rect', x: 0, y: 0, width: 128, height: 16 },
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
                bounds: { type: 'rect', x: 0, y: 0, width: 128, height: 16 },
            },
            {
                name: 'tilemapEditor',
                active: true,
                updateCallback: obj => {
                    let tilemap = obj.world.select.type(Tilemap);
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
            {
                name: 'raycaster',
                data: {
                    box: undefined,
                    tleft: 0,
                    tmiddle: 0,
                    tright: 0,
                },
                updateCallback: obj => {
                    let player = obj.world.select.type(Player);
                    let box = player.bounds.getBoundingBox();

                    let rleft = obj.world.select.raycast(box.left, box.bottom, 0, 1, ['walls', 'boxes']);
                    let rmiddle = obj.world.select.raycast(box.left + box.width/2, box.bottom, 0, 1, ['walls', 'boxes']);
                    let rright = obj.world.select.raycast(box.right, box.bottom, 0, 1, ['walls', 'boxes']);

                    obj.data.box = box;
                    obj.data.tleft = _.isEmpty(rleft) ? 100 : rleft[0].t;
                    obj.data.tmiddle = _.isEmpty(rmiddle) ? 100 : rmiddle[0].t;
                    obj.data.tright = _.isEmpty(rright) ? 100 : rright[0].t;
                },
                renderCallback: (obj: WorldObject, screen: Texture) => {
                    let box: Rectangle = obj.data.box;

                    Draw.brush.color = 0xFFFF00;
                    Draw.brush.alpha = 1;
                    Draw.brush.thickness = 1;

                    Draw.line(screen, box.left+1, box.bottom, box.left+1, box.bottom + obj.data.tleft);
                    Draw.line(screen, box.left+box.width/2, box.bottom, box.left+box.width/2, box.bottom + obj.data.tmiddle);
                    Draw.line(screen, box.right, box.bottom, box.right, box.bottom + obj.data.tright);
                }
            }
        ]
    },
}}