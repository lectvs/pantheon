/// <reference path="base.ts" />
/// <reference path="campfire.ts" />
/// <reference path="door.ts" />
/// <reference path="firelitWorld.ts" />
/// <reference path="item.ts" />
/// <reference path="lightingManager.ts" />
/// <reference path="main.ts" />
/// <reference path="monster.ts" />
/// <reference path="player.ts" />
/// <reference path="tree.ts" />

const stages: Dict<World.Config> = {

    'game': {
        constructor: FirelitWorld,
        parent: BASE_STAGE,
        camera: {
            movement: { type: 'smooth', speed: 0, deadZoneWidth: 0, deadZoneHeight: 0 },
            mode: Camera.Mode.FOLLOW('player', 0, -8),
        },
        entryPoints: {
            'main': { x: Main.width/2, y: Main.height/2 },
        },
        worldObjects: [
            WORLD_BOUNDS(0, 0, Main.width, Main.height),
            {
                name: 'lightingManager',
                constructor: LightingManager,
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
                layer: 'fg',
                physicsGroup: 'walls',
            },
            <Sprite.Config>{
                name: 'ground',
                constructor: Sprite,
                x: 400, y: 400,
                texture: 'ground',
                layer: 'bg',
            },
            <Campfire.Config>{
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
                { x: 584, y: 408 },
            ].map(pos => <Sprite.Config>{
                constructor: Tree,
                x: pos.x, y: pos.y,
                layer: 'main',
                physicsGroup: 'props',
                immovable: true,
            }),
            <Item.Config>{
                name: 'start_log',
                constructor: ItemGround,
                type: Item.Type.LOG,
                x: 425, y: 408,
                layer: 'main',
                physicsGroup: 'items',
            },
            <Item.Config>{
                constructor: ItemGround,
                type: Item.Type.AXE,
                x: 447, y: 436,
                angle: -90,
                layer: 'main',
                physicsGroup: 'items',
            },
            <Item.Config>{
                constructor: ItemGround,
                type: Item.Type.KEY,
                x: 688, y: 400,
                layer: 'main',
                physicsGroup: 'items',
            },
            <Item.Config>{
                name: 'gasoline',
                constructor: ItemGround,
                type: Item.Type.GASOLINE,
                x: 528, y: 84,
                layer: 'main',
                physicsGroup: 'items',
            },
        ]
    },
}