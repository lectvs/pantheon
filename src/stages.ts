
function getStages(): Dict<World.Factory> { return {

    'game': () => {
        let world = new World({
            width: 192, height: 272,
            backgroundColor: 0x000000,
            entryPoints: { 'main': { x: 0, y: 0 } },
            layers: [
                { name: 'bg' },
                { name: 'walls', effects: { post: { filters: [new WorldFilter()] } } },
                { name: 'entities' },
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
            useRaycastDisplacementThreshold: 4,
        });

        let tiles = world.addWorldObject(new Tilemap({
            x: -16, y: -16,
            tilemap: 'world',
            layer: 'walls',
            physicsGroup: 'walls',
        }));

        let player = world.addWorldObject(new Player({
            x: global.gameWidth/2, y: global.gameHeight/2,
            layer: 'entities',
            physicsGroup: 'player',
        }));

        return world;
    },
}}