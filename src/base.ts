
function BASE_STAGE(): World.Config {
    return {
        constructor: World,
        backgroundColor: 0x000000,
        layers: [
            { name: 'bg' },
            { name: 'hoop' },
            { name: 'main', sortKey: obj => obj.y },
            { name: 'king_shadow_start' },
            { name: 'king_start' },
            { name: 'fg' },
        ],
        physicsGroups: {
            'player': {},
            'hoop': {},
            'enemies': {},
            'bombs': {},
            'bullets': {},
            'walls': { immovable: true },
        },
        collisions: [
            { group1: 'player', group2: 'enemies' },
            { group1: 'player', group2: 'bullets' },
            { group1: 'player', group2: 'walls', transferMomentum: false },

            { group1: 'enemies', group2: 'walls', transferMomentum: false },
            { group1: 'bullets', group2: 'walls' },
            { group1: 'bombs', group2: 'walls' },
            { group1: 'bombs', group2: 'enemies' },

            { group1: 'hoop', group2: 'enemies' },
            { group1: 'hoop', group2: 'bombs' },
            { group1: 'hoop', group2: 'walls' },
        ],
        collisionIterations: 4,
        useRaycastDisplacementThreshold: 4,
    };
}

function BASE_CAMERA_MOVEMENT(): Camera.SmoothMovement {
    return { type: 'smooth', speed: 10, deadZoneWidth: 40, deadZoneHeight: 30 };
}

function MENU_BASE_STAGE(): World.Config {
    return {
        constructor: World,
        backgroundColor: 0x000000,
        volume: 0,
    };
}

function WORLD_BOUNDS(left: number, top: number, right: number, bottom: number): WorldObject.Config {
    let thickness = 40;
    let width = right-left;
    let height = bottom-top;
    return {
        constructor: WorldObject,
        children: [
            <PhysicsWorldObject.Config>{
                constructor: PhysicsWorldObject,
                bounds: { type: 'rect', x: left-thickness, y: top-thickness, width: thickness, height: height+2*thickness },
                physicsGroup: 'walls',
            },
            <PhysicsWorldObject.Config>{
                constructor: PhysicsWorldObject,
                bounds: { type: 'rect', x: right, y: top-thickness, width: thickness, height: height+2*thickness },
                physicsGroup: 'walls',
            },
            <PhysicsWorldObject.Config>{
                constructor: PhysicsWorldObject,
                bounds: { type: 'rect', x: left, y: top-thickness, width: width, height: thickness },
                physicsGroup: 'walls',
            },
            <PhysicsWorldObject.Config>{
                constructor: PhysicsWorldObject,
                bounds: { type: 'rect', x: left, y: bottom, width: width, height: thickness },
                physicsGroup: 'walls',
            },
        ]
    };
}
