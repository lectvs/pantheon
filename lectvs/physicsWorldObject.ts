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

        debugBounds?: boolean;
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
    bounds: Rect;
    immovable: boolean;
    colliding: boolean;

    debugBounds: boolean;
    simulating: boolean;

    physicslastx: number;
    physicslasty: number;

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
        this.bounds = config.bounds ? _.clone(config.bounds) : { x: 0, y: 0, width: 0, height: 0 };
        this.immovable = config.immovable ?? false;
        this.colliding = config.colliding ?? true;

        this.debugBounds = config.debugBounds ?? false;
        this.simulating = config.simulating ?? true;

        this.physicslastx = this.x;
        this.physicslasty = this.y;
    }

    preUpdate() {
        super.preUpdate();
        this.physicslastx = this.x;
        this.physicslasty = this.y;
    }

    update(delta: number) {
        super.update(delta);
        if (this.simulating) {
            this.simulate(delta);
        }
    }

    render(screen: Texture) {
        if (Debug.ALL_PHYSICS_BOUNDS || this.debugBounds) {
            let worldBounds = this.getWorldBounds();
            Draw.brush.color = 0x00FF00;
            Draw.brush.alpha = 1;
            Draw.rectangleOutline(screen, worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height);
        }
        super.render(screen);
    }

    getWorldBounds(newX: number = this.x, newY: number = this.y) {
        return new Rectangle(newX + this.bounds.x, newY + this.bounds.y, this.bounds.width, this.bounds.height);
    }

    isCollidingWith(other: PhysicsWorldObject) {
        this.bounds.x += this.x;
        this.bounds.y += this.y;
        other.bounds.x += other.x;
        other.bounds.y += other.y;
        let result = G.overlapRectangles(this.bounds, other.bounds);
        this.bounds.x -= this.x;
        this.bounds.y -= this.y;
        other.bounds.x -= other.x;
        other.bounds.y -= other.y;
        return result;
    }

    isOverlappingRect(rect: Rect) {
        this.bounds.x += this.x;
        this.bounds.y += this.y;
        let result = G.overlapRectangles(this.bounds, rect);
        this.bounds.x -= this.x;
        this.bounds.y -= this.y;
        return result;
    }

    
    onCollide(other: PhysicsWorldObject) {

    }

    teleport(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.physicslastx = x;
        this.physicslasty = y;
    }

    applyGravity(delta: number) {
        this.vx += this.gravityx * delta;
        this.vy += this.gravityy * delta;
        this.vz += this.gravityz * delta;
    }

    move(delta: number) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
        this.z += this.vz * delta;
    }

    simulate(delta: number) {
        this.applyGravity(delta);
        this.move(delta);
    }
}