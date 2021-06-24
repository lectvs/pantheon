const BASE_CAMERA_MOVEMENT = Camera.Movement.SMOOTH(100, 10, 10);

const stages: Dict<Factory<World>> = {

    'game': () => {
        let world = new World({
            width: 272, height: 192,
            backgroundColor: 0x000000,
            layers: [
                { name: 'bg' },
                { name: 'main' },
                { name: 'player' },
                { name: 'grapple' },
                { name: 'walls', effects: { post: { filters: [new WorldFilter()] }} },
                { name: 'fg' },
            ],
            physicsGroups: {
                'player': {},
                'grapple': {},
                'walls': { immovable: true },
            },
            collisions: [
                { move: 'player', from: 'walls' },
                { move: 'grapple', from: 'walls' },
            ],
            collisionIterations: 4,
            // TODO: rethink this? does it actually help?
            useRaycastDisplacementThreshold: Infinity,
            maxDistancePerCollisionStep: 8,
            globalSoundHumanizePercent: 0.1,
        });

        world.addWorldObject(new Tilemap({
            x: -16, y: -16,
            tilemap: 'world',
            tileset: 'world',
            layer: 'walls',
            physicsGroup: 'walls',
        }));

        //world.addWorldObject(new Chain(A.range(20).map(i => vec2(120 - 1*i, 48 + 2.5*i))));

        let player = world.addWorldObject(new Player(2*16+8, 6*16+16));
        player.name = 'player';

        world.camera.snapPosition();

        return world;
    },
}
