/// <reference path="./worldObject.ts" />

namespace PhysicsWorldObject {
    export type Config = ReplaceConfigCallbacks<WorldObject.Config, PhysicsWorldObject> & {
        mass?: number;
        gravityx?: number;
        gravityy?: number;
        gravityz?: number;
        affectedByGravity?: boolean;
        bounce?: number;
        bounds?: Bounds;
        immovable?: boolean;
        colliding?: boolean;
    }
}

class PhysicsWorldObject extends WorldObject {
    private _gravity: Vector2;
    get gravity() { return this._gravity; }
    set gravity(value: Vector2) {
        this._gravity.x = value.x;
        this._gravity.y = value.y;
    }
    gravityz: number;
    affectedByGravity: boolean;

    mass: number;
    bounce: number;
    colliding: boolean;

    physicslastx: number;
    physicslasty: number;

    debugDrawBounds: boolean;

    private _immovable: boolean;

    private _bounds!: Bounds;
    get bounds() { return this._bounds; }
    set bounds(value: Bounds) {
        this._bounds = value;
        this._bounds.parent = this;
    }

    constructor(config: PhysicsWorldObject.Config = {}) {
        super(config);
        this.mass = config.mass ?? 1;
        this._gravity = vec2(config.gravityx ?? 0, config.gravityy ?? 0);
        this.gravityz = config.gravityz ?? 0;
        this.affectedByGravity = config.affectedByGravity ?? true;
        this.bounce = config.bounce ?? 1;

        this.bounds = config.bounds ?? new NullBounds();

        this._immovable = config.immovable ?? false;
        this.colliding = config.colliding ?? true;

        this.physicslastx = this.x;
        this.physicslasty = this.y;

        this.debugDrawBounds = false;
    }

    override preUpdate() {
        super.preUpdate();
        this.physicslastx = this.x;
        this.physicslasty = this.y;
    }

    override update() {
        this.applyGravity();
        super.update();
    }

    override render(texture: Texture, x: number, y: number) {
        if (Debug.SHOW_ALL_PHYSICS_BOUNDS || this.debugDrawBounds) {
            let zoffset = 0; // offset to cancel out the z-factor when drawing bounds
            if (this.zBehavior === 'threequarters') {
                let parentz = this.parent ? this.parent.z : 0;
                zoffset = parentz - this.z;
            }
            this.drawBounds(texture, x, y - zoffset);
        }
        super.render(texture, x, y);
    }

    getWorldBounds() {
        return this.bounds.getBoundingBox();
    }

    isCollidingWith(other: PhysicsWorldObject) {
        return this.isOverlapping(other.bounds);
    }

    isGrounded(groundGroups: string[]) {
        if (!this.world) return false;
        this.bounds.y++;
        let ground = this.world.select.overlap(this.bounds, groundGroups);
        this.bounds.y--;
        return !A.isEmpty(ground);
    }

    isImmovable() {
        return this._immovable || (this.world && this.world.getPhysicsGroupByName(this.physicsGroup)?.immovable);
    }

    isOverlapping(bounds: Bounds) {
        return this.bounds.isOverlapping(bounds);
    }
    
    onCollide(collision: Physics.Collision) {

    }

    setImmovable(immovable: boolean) {
        this._immovable = immovable;
    }

    teleport(x: Pt | number, y?: number) {
        if (!M.isNumber(x)) {
            y = x.y;
            x = x.x;
        }
        this.x = x;
        this.y = y ?? x;
        this.physicslastx = x;
        this.physicslasty = y ?? x;
    }

    private applyGravity() {
        this.v.x += this.gravity.x * this.delta;
        this.v.y += this.gravity.y * this.delta;
        this.vz += this.gravityz * this.delta;
    }

    private drawBounds(texture: Texture, x: number, y: number) {
        if (this.bounds instanceof RectBounds) {
            let box = this.bounds.getBoundingBox();
            box.x += x - this.x;
            box.y += y - this.y;
            Draw.rectangle(texture, box.x, box.y, box.width, box.height, { outline: { color: 0x00FF00 }});
        } else if (this.bounds instanceof InvertedRectBounds) {
            let box = this.bounds.getInnerBox();
            box.x += x - this.x;
            box.y += y - this.y;
            Draw.rectangle(texture, box.x, box.y, box.width, box.height, { outline: { color: 0x00FF00 }});
        } else if (this.bounds instanceof CircleBounds) {
            let center = this.bounds.getCenter();
            center.x += x - this.x;
            center.y += y - this.y;
            Draw.circle(texture, center.x, center.y, this.bounds.radius, { outline: { color: 0x00FF00 }});
        } else if (this.bounds instanceof SlopeBounds) {
            let box = this.bounds.getBoundingBox();
            box.x += x - this.x;
            box.y += y - this.y;
            if (this.bounds.direction === 'upleft') {
                Draw.polygon(texture, [vec2(box.left, box.bottom), vec2(box.right, box.bottom), vec2(box.right, box.top)], { outline: { color: 0x00FF00 }});
            } else if (this.bounds.direction === 'upright') {
                Draw.polygon(texture, [vec2(box.left, box.bottom), vec2(box.right, box.bottom), vec2(box.left, box.top)], { outline: { color: 0x00FF00 }});
            } else if (this.bounds.direction === 'downright') {
                Draw.polygon(texture, [vec2(box.left, box.bottom), vec2(box.left, box.top), vec2(box.right, box.top)], { outline: { color: 0x00FF00 }});
            } else {
                Draw.polygon(texture, [vec2(box.left, box.top), vec2(box.right, box.top), vec2(box.right, box.bottom)], { outline: { color: 0x00FF00 }});
            }
        } 
    }
}