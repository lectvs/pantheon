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
                bounds: { type: 'rect', x: 0, y: 0, width: 128, height: 16 },
                immovable: true,
            },
            {
                name: 'tilemapEditor',
                updateCallback: obj => {
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
            <Sprite.Config>{
                name: 'const',
                constructor: Sprite,
                x: 600, y: 200,
                tint: 0x000000,
                //bounds: { type: 'rect', x: 0, y: 0, width: 100, height: 100 },
                //bounds: { type: 'circle', x: 0, y: 0, radius: 100 },
                bounds: { type: 'slope', x: 0, y: 0, width: 180, height: 100, direction: 'upleft' },
            },
            <Sprite.Config>{
                name: 'test_circle',
                constructor: Sprite,
                x: 630, y: 240,
                texture: 'circle',
                tint: 0x006600,
                scaleX: 1,
                scaleY: 1,
                debug: {
                    followMouse: true
                },
                data: { complete: false },
                bounds: { type: 'circle', x: 0, y: 0, radius: 100 },
                updateCallback: (obj: Sprite) => {
                    let cc = obj.world.getWorldObjectByName<Sprite>('const');

                    obj.tint = obj.bounds.isOverlapping(cc.bounds) ? 0x660000 : 0x006600;

                    // if (!obj.data.complete) {
                    //     let tex = obj.world.getWorldObjectByName<Sprite>('pattern').getTexture();
                    //     let box = cc.getWorldBounds();
                    //     let p = 1;
                    //     let pa = 110;
                    //     for (let x = box.left-pa; x < box.right+pa; x+=p) {
                    //         for (let y = box.top-pa; y < box.bottom+pa; y+=p) {
                    //             obj.x = x;
                    //             obj.y = y;
                    //             Draw.brush.color = obj.bounds.isOverlapping(cc.bounds) ? 0xFF0000 : 0x0000FF;
                    //             Draw.brush.alpha = 1;
                    //             Draw.rectangleSolid(tex, x, y, p, p);
                    //         }
                    //     }
                    //     obj.data.complete = true;
                    // }

                    //let coll = obj.bounds.getDisplacementCollision(cc.bounds);
                    let coll = obj.bounds.getRaycastCollision(obj.x - obj.physicslastx, obj.y - obj.physicslasty, cc.bounds, cc.x - cc.physicslastx, cc.y - cc.physicslasty);
                    if (coll) {
                        obj.x += coll.displacementX;
                        obj.y += coll.displacementY;
                    }
                }
            },
            <Sprite.Config>{
                name: 'pattern',
                constructor: Sprite,
                texture: new BasicTexture(global.gameWidth, global.gameHeight),
            }
        ]
    },
}}