const BASE_CAMERA_MOVEMENT = Camera.Movement.SMOOTH(100, 10, 10);

const stages: Dict<Factory<World>> = {

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
            globalSoundHumanizePercent: 0.1,
        });

        let entityMap: Dict<TilemapEntities.SpawnFunction> = {
            11: (x, y, tile) => new Checkpoint(x+8, y+8, tile.angle),
            12: (x, y, tile) => new Bat(x+8, y+8),
            13: (x, y, tile) => new Mover(x+8, y+8, tile.angle),
            14: (x, y, tile) => new Cannon(x+8, y+8, tile.angle),
            15: (x, y, tile) => new Boss(x+8, y+8),
            16: (x, y, tile) => new Spikes(x+8, y+8, tile.angle),
            17: (x, y, tile) => new Thwomp(x+8, y+8),
        };

        let tiles = world.addWorldObject(new Tilemap({
            x: -16, y: -16,
            tilemap: 'world',
            tileset: 'world',
            entities: entityMap,
            layer: 'walls',
            physicsGroup: 'walls',
        }));

        let entities = TilemapEntities.getEntities({
            tilemap: 'world',
            tilemapLayer: 0,
            tileset: 'world',
            offsetX: -16,
            offsetY: -16,
            entities: entityMap
        });
        world.addWorldObjects(entities);

        world.addWorldObject(new Water(0, 61.5, 10, 39));

        world.addWorldObjects([
            new Lava(2.5, 124.25, 5, 2.5),
            new Lava(2.5, 134.25, 5, 2.5),
            new Lava(8.25, 144.25, 2, 6),
            new Lava(-0.25, 148.25, 2, 6),
        ]);

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

        let player = world.addWorldObject(new Player(3*16+8, 9*16+8));
        player.name = 'player';

        Checkpoints.init(world.select.typeAll(Checkpoint));

        let currentCheckpoint = world.select.name(Checkpoints.current, false);
        if (currentCheckpoint) {
            player.x = currentCheckpoint.x;
            player.y = currentCheckpoint.y + 7;
        }

        Checkpoints.killCheckpointsForHardMode(world.select.typeAll(Checkpoint));

        world.camera.bounds = {
            left: 0, right: 160,
            top: -Infinity, bottom: tiles.height - 32
        }
        world.camera.setModeFollow(player, 0, -8);
        world.camera.setMovementSnap();
        world.camera.snapPosition();

        if (global.theater.currentMusicKey !== 'caves') {
            global.theater.stopMusic();
        }
        global.theater.playMusic('caves', 1);

        return world;
    },
}
