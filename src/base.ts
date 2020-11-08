
function BASE_STAGE(): World {
    return new World({
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
            { move: 'player', from: 'enemies' },
            { move: 'player', from: 'bullets' },
            { move: 'player', from: 'walls', transferMomentum: false },
            { move: 'enemies', from: 'walls', transferMomentum: false },
            { move: 'bullets', from: 'walls' },
            { move: 'bombs', from: 'walls' },
            { move: 'bombs', from: 'enemies' },
            { move: 'hoop', from: 'enemies' },
            { move: 'hoop', from: 'bombs' },
        ],
        collisionIterations: 4,
        useRaycastDisplacementThreshold: 4,
    });
}

function BASE_CAMERA_MOVEMENT(): Camera.SmoothMovement {
    return { type: 'smooth', speed: 10, deadZoneWidth: 40, deadZoneHeight: 30 };
}

function WORLD_BOUNDS(left: number, top: number, right: number, bottom: number, physicsGroup: string): WorldObject {
    let thickness = 40;
    let width = right-left;
    let height = bottom-top;

    let worldBounds = new WorldObject();

    worldBounds.addChild(new PhysicsWorldObject({
        bounds: new RectBounds(left-thickness, top-thickness, thickness, height+2*thickness),
        physicsGroup: physicsGroup
    }));

    worldBounds.addChild(new PhysicsWorldObject({
        bounds: new RectBounds(right, top-thickness, thickness, height+2*thickness),
        physicsGroup: physicsGroup
    }));

    worldBounds.addChild(new PhysicsWorldObject({
        bounds: new RectBounds(left, top-thickness, width, thickness),
        physicsGroup: physicsGroup
    }));

    worldBounds.addChild(new PhysicsWorldObject({
        bounds: new RectBounds(left, bottom, width, thickness),
        physicsGroup: physicsGroup
    }));

    return worldBounds;
}
