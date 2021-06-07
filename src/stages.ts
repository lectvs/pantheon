const BASE_CAMERA_MOVEMENT = Camera.Movement.SMOOTH(100, 10, 10);

var music: Sound;

function getStages(): Dict<Factory<World>> { return {

    'game': () => {
        let world = new World({
            width: 192, height: 272,
            backgroundColor: 0x000000,
            entryPoints: { 'main': { x: 0, y: 0 } },
            layers: [
                { name: 'bg' },
                { name: 'entities' },
                { name: 'player' },
                { name: 'puffs' },
                { name: 'water' },
                { name: 'walls', effects: { post: { filters: [new WorldFilter(), new DepthFilter()] }} },
                { name: 'fg' },
            ],
            physicsGroups: {
                'player': {},
                'grapple': {},
                'walls': { immovable: true },
                'thwomps': {},
                'movers': {},
                'enemies': {},
                'cannons': { immovable: true },
                'cannonballs': {},
                'checkpoints': {},
                'water': {},
            },
            collisions: [
                { move: 'player', from: 'walls' },
                { move: 'thwomps', from: 'walls' },
                { move: 'thwomps', from: 'thwomps' },
                { move: 'movers', from: 'walls', momentumTransfer: 'elastic' },
                { move: 'player', from: 'thwomps' },
                { move: 'player', from: 'movers' },
                { move: 'enemies', from: 'walls' },
                { move: 'player', from: 'enemies' },
                { move: 'cannonballs', from: 'walls' },
                { move: 'player', from: 'cannons' },
                { move: 'player', from: 'cannonballs' },
            ],
            collisionIterations: 4,
            useRaycastDisplacementThreshold: 4,
        });

        extractEntities(AssetCache.tilemaps['world'].layers[0]);

        let tiles = world.addWorldObject(new Tilemap({
            x: -16, y: -16,
            tilemap: 'world',
            layer: 'walls',
            physicsGroup: 'walls',
        }));

        for (let entity of worldEntities) {
            if (entity.type === 'spikes') {
                world.addWorldObject(new Spikes(entity.tx, entity.ty, entity.angle));
            } else if (entity.type === 'thwomp') {
                world.addWorldObject(new Thwomp(entity.tx, entity.ty));
            } else if (entity.type === 'checkpoint') {
                world.addWorldObject(new Checkpoint(entity.tx, entity.ty, entity.angle));
            } else if (entity.type === 'bat') {
                world.addWorldObject(new Bat(entity.tx, entity.ty));
            } else if (entity.type === 'mover') {
                world.addWorldObject(new Mover(entity.tx, entity.ty, entity.angle));
            } else if (entity.type === 'cannon') {
                world.addWorldObject(new Cannon(entity.tx, entity.ty, entity.angle));
            } else if (entity.type === 'boss') {
                world.addWorldObject(new Boss(entity.tx, entity.ty));
            }
        }

        world.addWorldObject(new Water(0, 61.5, 10, 39));

        world.addWorldObjects([
            new Lava(2.5, 124.25, 5, 2.5),
            new Lava(2.5, 134.25, 5, 2.5),
            new Lava(8.25, 144.25, 2, 6),
            new Lava(-0.25, 148.25, 2, 6),
        ]);

        Checkpoints.init(world.select.typeAll(Checkpoint));

        world.addWorldObject(new Sprite({
            x: 111, y: 1078,
            texture: 'grappledownhelp',
            layer: 'bg'
        }));
        world.addWorldObject(new Sprite({
            x: 113, y: 2343,
            texture: 'grappledownhelp',
            layer: 'bg'
        }));
        world.addWorldObject(new Sprite({
            x: 45, y: 2408,
            texture: 'grappledownhelp',
            layer: 'bg'
        }));

        let player = world.addWorldObject(new Player(3, 9));
        player.name = 'player';

        let currentCheckpoint = world.select.name(Checkpoints.current, false);
        if (currentCheckpoint) {
            player.x = currentCheckpoint.x;
            player.y = currentCheckpoint.y + 7;
        }

        world.camera.bounds = {
            left: 0, right: 160,
            top: -Infinity, bottom: tiles.height - 32
        }
        world.camera.setModeFollow(player, 0, -8);
        world.camera.setMovementSnap();
        world.camera.snapPosition();

        music = world.playSound('caves');
        music.volume = 0;
        music.loop = true;
        world.runScript(S.doOverTime(1, t => music.volume = t*t));

        return world;
    },
}}

var worldEntities: { type: string, tx: number, ty: number, angle: number }[];

function extractEntities(layer: Tilemap.TilemapLayer) {
    if (worldEntities) return;
    let indexToType = {
        11: 'checkpoint',
        12: 'bat',
        13: 'mover',
        14: 'cannon',
        15: 'boss',
        16: 'spikes',
        17: 'thwomp',
    };
    worldEntities = [];
    for (let ty = 0; ty < layer.length; ty++) {
        for (let tx = 0; tx < layer[ty].length; tx++) {
            let index = layer[ty][tx].index;
            if (index > 10) {
                worldEntities.push({ type: indexToType[index], tx: tx-1, ty: ty-1, angle: layer[ty][tx].angle });
                layer[ty][tx].index = -1;
            }
        }
    }
}