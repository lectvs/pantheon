/// <reference path="./worldObject.ts" />

namespace PhysicsWorldObject {
    export type Config = WorldObject.Config & {
        vx?: number;
        vy?: number;
        vz?: number;
        mass?: number;
        gravityx?: number;
        gravityy?: number;
        gravityz?: number;
        bounce?: number;
        bounds?: Rect;
        immovable?: boolean;
        colliding?: boolean;
        simulating?: boolean;

        debug?: WorldObject.DebugConfig & {
            drawBounds?: boolean;
        };
    }
}

class PhysicsWorldObject extends WorldObject {
    vx: number;
    vy: number;
    vz: number;
    mass: number;
    gravityx: number;
    gravityy: number;
    gravityz: number;
    bounce: number;
    bounds: Bounds;
    immovable: boolean;
    colliding: boolean;

    simulating: boolean;

    physicslastx: number;
    physicslasty: number;

    debugDrawBounds: boolean;

    constructor(config: PhysicsWorldObject.Config, defaults?: PhysicsWorldObject.Config) {
        config = WorldObject.resolveConfig<PhysicsWorldObject.Config>(config, defaults);
        super(config);
        this.vx = config.vx ?? 0;
        this.vy = config.vy ?? 0;
        this.vz = config.vz ?? 0;
        this.mass = config.mass ?? 1;
        this.gravityx = config.gravityx ?? 0;
        this.gravityy = config.gravityy ?? 0;
        this.gravityz = config.gravityz ?? 0;
        this.bounce = config.bounce ?? 0;

        this.bounds = config.bounds ? new RectBounds(config.bounds.x, config.bounds.y, config.bounds.width, config.bounds.height, this) : new RectBounds(0, 0, 0, 0, this);

        this.immovable = config.immovable ?? false;
        this.colliding = config.colliding ?? true;

        this.debugDrawBounds = config.debug?.drawBounds ?? false;
        this.simulating = config.simulating ?? true;

        this.physicslastx = this.x;
        this.physicslasty = this.y;
    }

    preUpdate() {
        super.preUpdate();
        this.physicslastx = this.x;
        this.physicslasty = this.y;
    }

    update() {
        super.update();
        if (this.simulating) {
            this.simulate();
        }
    }

    render(screen: Texture) {
        if (Debug.ALL_PHYSICS_BOUNDS || this.debugDrawBounds) {
            let worldBounds = this.bounds.getBoundingBox();
            Draw.brush.color = 0x00FF00;
            Draw.brush.alpha = 1;
            Draw.rectangleOutline(screen, worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height);
        }
        super.render(screen);
    }

    getWorldBounds(newX: number = this.x, newY: number = this.y) {
        return this.bounds.getBoundingBox(newX, newY);
    }

    isCollidingWith(other: PhysicsWorldObject) {
        return this.isOverlapping(other.bounds);
    }

    isOverlapping(bounds: Bounds) {
        return this.bounds.isOverlapping(bounds);
    }
    
    onCollide(other: PhysicsWorldObject) {

    }

    teleport(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.physicslastx = x;
        this.physicslasty = y;
    }

    applyGravity() {
        this.vx += this.gravityx * this.delta;
        this.vy += this.gravityy * this.delta;
        this.vz += this.gravityz * this.delta;
    }

    move() {
        this.x += this.vx * this.delta;
        this.y += this.vy * this.delta;
        this.z += this.vz * this.delta;
    }

    simulate() {
        this.applyGravity();
        this.move();
    }
}