
function BASE_STAGE(): World.Config {
    return {
        constructor: World,
        backgroundColor: 0xFFFFFF,
        layers: [
            { name: 'bg' },
            { name: 'ground' },
            { name: 'main' },
            { name: 'fg' },
            { name: 'above' },
        ],
        physicsGroups: {
            'player': {},
            'boxes': {},
            'walls': {},
        },
        collisionOrder: [
            { move: 'boxes', from: ['player'] },
            { move: 'boxes', from: ['walls'] },
            { move: 'player', from: ['boxes'] },
            { move: 'player', from: ['walls'] },
        ],
        collisionIterations: 2,
    };
}

function MENU_BASE_STAGE(): World.Config {
    return {
        constructor: World,
        backgroundColor: 0x000000,
        playingAudio: false,
    };
}

function WORLD_BOUNDS(left: number, top: number, right: number, bottom: number): WorldObject.Config {
    let thickness = 12;
    let width = right-left;
    let height = bottom-top;
    return {
        constructor: WorldObject,
        children: [
            <PhysicsWorldObject.Config>{
                constructor: PhysicsWorldObject,
                bounds: { x: left-thickness, y: top-thickness, width: thickness, height: height+2*thickness },
                physicsGroup: 'walls',
            },
            <PhysicsWorldObject.Config>{
                constructor: PhysicsWorldObject,
                bounds: { x: right, y: top-thickness, width: thickness, height: height+2*thickness },
                physicsGroup: 'walls',
            },
            <PhysicsWorldObject.Config>{
                constructor: PhysicsWorldObject,
                bounds: { x: left, y: top-thickness, width: width, height: thickness },
                physicsGroup: 'walls',
            },
            <PhysicsWorldObject.Config>{
                constructor: PhysicsWorldObject,
                bounds: { x: left, y: bottom, width: width, height: thickness },
                physicsGroup: 'walls',
            },
        ]
    };
}
