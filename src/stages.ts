
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
            },
            collisions: [
                { move: 'player', from: 'walls' },
            ],
            collisionIterations: 4,
            useRaycastDisplacementThreshold: 4,
        });

        world.addWorldObject(new Player({
            name: 'player',
            x: 156, y: 166,
            bounds: new RectBounds(-4, -8, 8, 8),
            physicsGroup: 'player',
        }));

        world.addWorldObject(new Tilemap({
            name: 'walls',
            x: 0, y: 0,
            tilemap: 'world',
            physicsGroup: 'walls',
        }));

        world.camera.setMovement(BASE_CAMERA_MOVEMENT);
        world.camera.snapPosition();

        return world;
    },
}}