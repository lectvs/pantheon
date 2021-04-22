
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

        return world;
    },
}}