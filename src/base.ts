
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

function WORLD_BOUNDS(left: number, top: number, right: number, bottom: number): WorldObject {
    let thickness = 40;
    let width = right-left;
    let height = bottom-top;

    let worldBounds = new WorldObject();

    let leftBound = worldBounds.addChild(new PhysicsWorldObject(), {
        physicsGroup: 'walls'
    });
    leftBound.bounds = new RectBounds(left-thickness, top-thickness, thickness, height+2*thickness);

    let rightBound = worldBounds.addChild(new PhysicsWorldObject(), {
        physicsGroup: 'walls'
    });
    rightBound.bounds = new RectBounds(right, top-thickness, thickness, height+2*thickness);

    let topBound = worldBounds.addChild(new PhysicsWorldObject(), {
        physicsGroup: 'walls'
    });
    topBound.bounds = new RectBounds(left, top-thickness, width, thickness);

    let bottomBound = worldBounds.addChild(new PhysicsWorldObject(), {
        physicsGroup: 'walls'
    });
    bottomBound.bounds = new RectBounds(left, bottom, width, thickness);

    return worldBounds;
}
