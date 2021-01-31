
const BASE_CAMERA_MOVEMENT = Camera.Movement.SMOOTH(10, 40, 30);

function getStages(): Dict<World.Factory> { return {

    'game': () => {
        let world = new World({
            backgroundColor: 0x000000,
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

        world.camera.setMovement(BASE_CAMERA_MOVEMENT);
        world.camera.snapPosition();

        return world;
    },
}}