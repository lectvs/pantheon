
const DEFAULT_SCREEN_TRANSITION = Transition.FADE(0.2, 0.5, 0.2);

const BASE_STAGE: World.Config = {
    layers: [
        { name: 'bg' },
        { name: 'main', sortKey: 'y' },
        { name: 'fg' },
        { name: 'above' },
    ],
    physicsGroups: {
        'player': {},
        'props': {},
        'items': {},
        'walls': {},
    },
    collisionOrder: [
        { move: 'player', from: ['props', 'walls'], callback: true },
        { move: 'items', from: ['props', 'walls'], callback: true, transferMomentum: true },
    ],
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

function fireSpriteConfig(): Sprite.Config {
    return {
        constructor: Sprite,
        animations: [
            Animations.fromTextureList({ name: 'blaze', texturePrefix: 'fire_', textures: [0, 1, 2, 3, 4, 5, 6, 7], frameRate: 16, count: -1 }),
        ],
        defaultAnimation: 'blaze'
    };
}

function screenShake(world: World) {
    return function*() {
        if (!global.theater || global.theater.currentWorld !== world) return;
        world.camera.shakeIntensity += 1;
        yield* S.wait(0.1)();
        world.camera.shakeIntensity -= 1;
    }
}