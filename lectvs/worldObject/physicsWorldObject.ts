/// <reference path="./worldObject.ts" />

namespace PhysicsWorldObject {
    export type Config = ReplaceConfigCallbacks<WorldObject.Config, PhysicsWorldObject> & {
        v?: Pt;
        vx?: number;
        vy?: number;
        vz?: number;
        mass?: number;
        gravityx?: number;
        gravityy?: number;
        gravityz?: number;
        bounce?: number;
        bounds?: Bounds;
        immovable?: boolean;
        colliding?: boolean;
        simulating?: boolean;
    }
}

class PhysicsWorldObject extends WorldObject {
    private _v: Pt;
    get v() { return this._v; }
    set v(value: Pt) {
        this._v.x = value.x;
        this._v.y = value.y;
    }
    vz: number;

    private _gravity: Pt;
    get gravity() { return this._gravity; }
    set gravity(value: Pt) {
        this._gravity.x = value.x;
        this._gravity.y = value.y;
    }
    gravityz: number;

    mass: number;
    bounce: number;
    colliding: boolean;

    simulating: boolean;

    physicslastx: number;
    physicslasty: number;

    debugDrawBounds: boolean;

    private _immovable: boolean;

    private _bounds: Bounds;
    get bounds() { return this._bounds; }
    set bounds(value: Bounds) {
        this._bounds = value;
        this._bounds.parent = this;
    }

    constructor(config: PhysicsWorldObject.Config = {}) {
        super(config);
        this._v = config.v ? pt(config.v.x, config.v.y) : pt(config.vx ?? 0, config.vy ?? 0);
        this.vz = config.vz ?? 0;
        this.mass = config.mass ?? 1;
        this._gravity = pt(config.gravityx ?? 0, config.gravityy ?? 0);
        this.gravityz = config.gravityz ?? 0;
        this.bounce = config.bounce ?? 1;

        this.bounds = config.bounds ?? new NullBounds();

        this._immovable = config.immovable ?? false;
        this.colliding = config.colliding ?? true;
        this.simulating = config.simulating ?? true;

        this.physicslastx = this.x;
        this.physicslasty = this.y;

        this.debugDrawBounds = false;
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
        if (!isFinite(this.v.x) || !isFinite(this.v.y)) {
            error(`Non-finite velocity ${this.v} on object`, this);
            if (!isFinite(this.v.x)) this.v.x = 0;
            if (!isFinite(this.v.y)) this.v.y = 0;
        }
    }

    render(texture: Texture, x: number, y: number) {
        if (Debug.ALL_PHYSICS_BOUNDS || this.debugDrawBounds) {
            let zoffset = 0; // offset to cancel out the z-factor when drawing bounds
            if (this.zBehavior === 'threequarters') {
                let parentz = this.parent ? this.parent.z : 0;
                zoffset = parentz - this.z;
            }
            this.drawBounds(texture, x, y - zoffset);
        }
        super.render(texture, x, y);
    }

    getSpeed() {
        return V.magnitude(this.v);
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
    
    onCollide(collision: Physics.CollisionInfo) {

    }

    setImmovable(immovable: boolean) {
        this._immovable = immovable;
    }

    setSpeed(speed: number) {
        V.setMagnitude(this.v, speed);
    }

    teleport(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.physicslastx = x;
        this.physicslasty = y;
    }

    applyGravity() {
        this.v.x += this.gravity.x * this.delta;
        this.v.y += this.gravity.y * this.delta;
        this.vz += this.gravityz * this.delta;
    }

    move() {
        this.x += this.v.x * this.delta;
        this.y += this.v.y * this.delta;
        this.z += this.vz * this.delta;
    }

    simulate() {
        this.applyGravity();
        this.move();
    }

    private drawBounds(texture: Texture, x: number, y: number) {
        Draw.brush.color = 0x00FF00;
        Draw.brush.alpha = 1;

        if (this.bounds instanceof RectBounds || this.bounds instanceof InvertedRectBounds) {
            let box = this.bounds.getBoundingBox();
            box.x += x - this.x;
            box.y += y - this.y;
            Draw.rectangleOutline(texture, box.x, box.y, box.width, box.height);
        } else if (this.bounds instanceof CircleBounds) {
            let center = this.bounds.getCenter();
            center.x += x - this.x;
            center.y += y - this.y;
            Draw.circleOutline(texture, center.x, center.y, this.bounds.radius);
        } else if (this.bounds instanceof SlopeBounds) {
            let box = this.bounds.getBoundingBox();
            box.x += x - this.x;
            box.y += y - this.y;
            if (this.bounds.direction === 'upleft') {
                Draw.line(texture, box.left, box.bottom, box.right, box.bottom);
                Draw.line(texture, box.right, box.bottom, box.right, box.top);
                Draw.line(texture, box.right, box.top, box.left, box.bottom);
            } else if (this.bounds.direction === 'upright') {
                Draw.line(texture, box.left, box.bottom, box.right, box.bottom);
                Draw.line(texture, box.left, box.bottom, box.left, box.top);
                Draw.line(texture, box.left, box.top, box.right, box.bottom);
            } else if (this.bounds.direction === 'downright') {
                Draw.line(texture, box.left, box.bottom, box.left, box.top);
                Draw.line(texture, box.left, box.top, box.right, box.top);
                Draw.line(texture, box.right, box.top, box.left, box.bottom);
            } else {
                Draw.line(texture, box.left, box.top, box.right, box.top);
                Draw.line(texture, box.right, box.top, box.right, box.bottom);
                Draw.line(texture, box.right, box.bottom, box.left, box.top);
            }
        } 
    }
}