const BASE_CAMERA_MOVEMENT = Camera.Movement.SMOOTH(100, 10, 10);

const stages: Dict<Factory<World>> = {

    'game': () => {
        let world = new World({
            width: 272, height: 192,
            backgroundColor: 0x000000,
            layers: [
                { name: 'bg' },
                { name: 'main' },
                { name: 'fg' },
            ],
            physicsGroups: {
                'player': {},
                'walls': {},
            },
            collisions: [
                { move: 'player', from: 'walls' },
            ],
            collisionIterations: 4,
            // TODO: rethink this? does it actually help?
            useRaycastDisplacementThreshold: Infinity,
            maxDistancePerCollisionStep: 8,
            globalSoundHumanizePercent: 0.1,
        });

        world.camera.snapPosition();

        return world;
    },
}
