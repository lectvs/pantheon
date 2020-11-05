
function BASE_STAGE(): World {
    let world = new World();

    world.backgroundColor = 0x000000;
    world.addLayer('bg');
    world.addLayer('hoop');
    world.addLayer('main', { sortKey: obj => obj.y });
    world.addLayer('king_shadow_start');
    world.addLayer('king_start');
    world.addLayer('fg');
    world.addPhysicsGroup('player');
    world.addPhysicsGroup('hoop');
    world.addPhysicsGroup('enemies');
    world.addPhysicsGroup('bombs');
    world.addPhysicsGroup('bullets');
    world.addPhysicsGroup('walls', { immovable: true });
    world.collisions.push({ group1: 'player', group2: 'enemies' });
    world.collisions.push({ group1: 'player', group2: 'bullets' });
    world.collisions.push({ group1: 'player', group2: 'walls', transferMomentum: false });
    world.collisions.push({ group1: 'enemies', group2: 'walls', transferMomentum: false });
    world.collisions.push({ group1: 'bullets', group2: 'walls' });
    world.collisions.push({ group1: 'bombs', group2: 'walls' });
    world.collisions.push({ group1: 'bombs', group2: 'enemies' });
    world.collisions.push({ group1: 'hoop', group2: 'enemies' });
    world.collisions.push({ group1: 'hoop', group2: 'bombs' });
    world.collisionIterations = 4;
    world.useRaycastDisplacementThreshold = 4;

    return world;
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
