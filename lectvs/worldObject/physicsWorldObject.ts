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
        bounds?: BoundsConfig;
        immovable?: boolean;
        colliding?: boolean;
        simulating?: boolean;

        debug?: WorldObject.DebugConfig & {
            drawBounds?: boolean;
        };
    }

    export type BoundsConfig = RectBoundsConfig | CircleBoundsConfig | SlopeBoundsConfig;

    export type RectBoundsConfig = {
        type: 'rect';
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export type CircleBoundsConfig = {
        type: 'circle';
        x: number;
        y: number;
        radius: number;
    }

    export type SlopeBoundsConfig = {
        type: 'slope';
        x: number;
        y: number;
        width: number;
        height: number;
        direction: SlopeBounds.Direction;
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
    colliding: boolean;

    simulating: boolean;

    physicslastx: number;
    physicslasty: number;

    debugDrawBounds: boolean;

    private _immovable: boolean;

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

        this.bounds = this.createBounds(config.bounds);

        this._immovable = config.immovable ?? false;
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

    postUpdate() {
        super.postUpdate();
        if (!isFinite(this.vx)) this.vx = 0;
        if (!isFinite(this.vy)) this.vy = 0;
    }

    render(screen: Texture) {
        if (Debug.ALL_PHYSICS_BOUNDS || this.debugDrawBounds) {
            this.drawBounds(screen);
        }
        super.render(screen);
    }

    getWorldBounds(newX: number = this.x, newY: number = this.y) {
        return this.bounds.getBoundingBox(newX, newY);
    }

    isCollidingWith(other: PhysicsWorldObject) {
        return this.isOverlapping(other.bounds);
    }

    isImmovable() {
        return this._immovable || (this.world && this.world.getPhysicsGroupByName(this.physicsGroup).immovable);
    }

    isOverlapping(bounds: Bounds) {
        return this.bounds.isOverlapping(bounds);
    }
    
    onCollide(other: PhysicsWorldObject) {

    }

    setImmovable(immovable: boolean) {
        this._immovable = immovable;
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

    private createBounds(bounds: PhysicsWorldObject.BoundsConfig) {
        if (bounds) {
            if (bounds.type === 'rect') return new RectBounds(bounds.x, bounds.y, bounds.width, bounds.height, this);
            if (bounds.type === 'circle') return new CircleBounds(bounds.x, bounds.y, bounds.radius, this);
            if (bounds.type === 'slope') return new SlopeBounds(bounds.x, bounds.y, bounds.width, bounds.height, bounds.direction, this);
        }
        return new NullBounds();
    }

    private drawBounds(screen: Texture) {
        Draw.brush.color = 0x00FF00;
        Draw.brush.alpha = 1;

        if (this.bounds instanceof RectBounds) {
            let box = this.bounds.getBoundingBox();
            box.x -= this.x - this.renderScreenX;
            box.y -= this.y - this.renderScreenY;
            Draw.rectangleOutline(screen, box.x, box.y, box.width, box.height);
        } else if (this.bounds instanceof CircleBounds) {
            let center = this.bounds.getCenter();
            center.x -= this.x - this.renderScreenX;
            center.y -= this.y - this.renderScreenY;
            Draw.circleOutline(screen, center.x, center.y, this.bounds.radius);
        } else if (this.bounds instanceof SlopeBounds) {
            let box = this.bounds.getBoundingBox();
            box.x -= this.x - this.renderScreenX;
            box.y -= this.y - this.renderScreenY;
            if (this.bounds.direction === 'upleft') {
                Draw.line(screen, box.left, box.bottom, box.right, box.bottom);
                Draw.line(screen, box.right, box.bottom, box.right, box.top);
                Draw.line(screen, box.right, box.top, box.left, box.bottom);
            } else if (this.bounds.direction === 'upright') {
                Draw.line(screen, box.left, box.bottom, box.right, box.bottom);
                Draw.line(screen, box.left, box.bottom, box.left, box.top);
                Draw.line(screen, box.left, box.top, box.right, box.bottom);
            } else if (this.bounds.direction === 'downright') {
                Draw.line(screen, box.left, box.bottom, box.left, box.top);
                Draw.line(screen, box.left, box.top, box.right, box.top);
                Draw.line(screen, box.right, box.top, box.left, box.bottom);
            } else {
                Draw.line(screen, box.left, box.top, box.right, box.top);
                Draw.line(screen, box.right, box.top, box.right, box.bottom);
                Draw.line(screen, box.right, box.bottom, box.left, box.top);
            }
        } 
    }
}