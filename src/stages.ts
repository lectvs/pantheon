
const BASE_CAMERA_MOVEMENT = Camera.Movement.SMOOTH(10, 40, 30);

function getStages(): Dict<World.Factory> { return {

    'game': () => {
        let world = new World({
            backgroundColor: 0xFFFFFF,
            entryPoints: { 'main': { x: 0, y: 0 } },
            layers: [
                { name: 'bg' },
                { name: 'main', sortKey: obj => obj.y },
                { name: 'fg' },
            ],
            physicsGroups: {
                'player': {},
                'walls': { immovable: true },
                'bullets': {},
            },
            collisions: [
                { move: 'player', from: 'walls' },
                { move: 'bullets', from: 'walls' },
            ],
            collisionIterations: 4,
            useRaycastDisplacementThreshold: 4,
        });

        world.addWorldObject(new Player({
            name: 'player',
            x: 156, y: 166,
            layer: 'main',
            bounds: new RectBounds(-4, -8, 8, 8),
            physicsGroup: 'player',
        }));

        let tilemap = AssetCache.getTilemap('world');
        let binaryTiles = A.map2D(tilemap.layers[0], tile => tile.index);
        world.addWorldObject(new Tilemap({
            name: 'walls',
            x: 0, y: -16,
            layer: 'main',
            ...ConvertTilemap.convert(binaryTiles, Assets.tilesets.base),
        }));

        let collisionTilemap = world.addWorldObject(new Tilemap({
            name: 'walls_collision',
            x: 0, y: 0,
            physicsGroup: 'walls',
            tilemap: 'world',
            collisionOnly: true
        }));

        for (let box of collisionTilemap.collisionBoxes) {
            box.addModule(new DecalModule());
        }

        world.camera.setModeFocus(160, 104);
        world.camera.setMovement(BASE_CAMERA_MOVEMENT);
        world.camera.snapPosition();

        return world;
    },
}}