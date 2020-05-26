/// <reference path="base.ts" />
/// <reference path="campfire.ts" />
/// <reference path="door.ts" />
/// <reference path="item.ts" />
/// <reference path="lightingManager.ts" />
/// <reference path="main.ts" />
/// <reference path="monster.ts" />
/// <reference path="player.ts" />
/// <reference path="torchLightManager.ts" />
/// <reference path="tree.ts" />

function getStages(): Dict<World.Config> { return {

    'game': {
        parent: BASE_STAGE(),
        camera: {
            movement: { type: 'smooth', speed: 0, deadZoneWidth: 0, deadZoneHeight: 0 },
        },
        entryPoints: {
            'main': { x: Main.width/2, y: Main.height/2 },
        },
        worldObjects: [
            {
                constructor: LightingManager,
            },
            {
                constructor: TorchLightManager,
            },
            <Tilemap.Config>{
                constructor: Tilemap,
                x: 0, y: 0,
                tilemap: 'world',
                tilemapLayer: 1,
                layer: 'bg',
            },
            <Tilemap.Config>{
                constructor: Tilemap,
                x: 0, y: 0,
                tilemap: 'world',
                tilemapLayer: 0,
                layer: 'main',
                physicsGroup: 'walls',
                zMap: { 1: 2, 7: 2, 8: 2, 9: 2 },
            },
            <Sprite.Config>{
                name: 'ground',
                constructor: Sprite,
                x: 0, y: 0,
                texture: new Texture(800, 800),
                layer: 'ground',
            },
            <Sprite.Config>{
                constructor: Sprite,
                x: 400, y: 400,
                texture: 'ground',
                layer: 'bg',
            },
            <Sprite.Config>{
                name: 'campfire',
                constructor: Campfire,
                x: 400, y: 400,
                layer: 'main',
            },
            {
                name: 'player',
                constructor: Player,
                controllable: true,
                x: 387, y: 394,
                flipX: false,
                layer: 'main',
                physicsGroup: 'player',
            },
            {
                name: 'door',
                constructor: Door,
                x: 400, y: 240,
                layer: 'main',
                physicsGroup: 'props',
            },
            ...[
                { x: 424, y: 296 },
                { x: 344, y: 344 },
                { x: 392, y: 328 },
                { x: 472, y: 360 },
                { x: 312, y: 408 },
                { x: 504, y: 408 },
                { x: 328, y: 440 },
                { x: 472, y: 440 },
                { x: 376, y: 472 },
                { x: 408, y: 488 },
                { x: 576, y: 418 },
            ].map(pos => <Sprite.Config>{
                constructor: Tree,
                x: pos.x, y: pos.y,
                layer: 'main',
                physicsGroup: 'props',
                immovable: true,
                data: {
                    spawnsTorch: pos.x === 328 && pos.y === 440,
                }
            }),
            <Item.Config>{
                name: 'start_log',
                constructor: Item,
                type: Item.Type.LOG,
                x: 425, y: 408,
                layer: 'main',
                physicsGroup: 'items',
            },
            <Item.Config>{
                constructor: Item,
                type: Item.Type.AXE,
                x: 447, y: 436,
                angle: -90,
                layer: 'main',
                physicsGroup: 'items',
            },
            <Item.Config>{
                constructor: Item,
                type: Item.Type.KEY,
                x: 688, y: 400,
                layer: 'main',
                physicsGroup: 'items',
            },
            <Item.Config>{
                name: 'gasoline',
                constructor: Item,
                type: Item.Type.GASOLINE,
                x: 528, y: 84,
                layer: 'main',
                physicsGroup: 'items',
            },
        ]
    },
}}