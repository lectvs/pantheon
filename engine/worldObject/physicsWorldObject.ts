/// <reference path="./worldObject.ts" />

namespace PhysicsWorldObject {
    export type Config<WO extends PhysicsWorldObject> = WorldObject.Config<WO> & {
        mass?: number;
        gravityx?: number;
        gravityy?: number;
        gravityz?: number;
        affectedByGravity?: boolean;
        bounce?: number;
        bounds?: Bounds;
        immovable?: boolean;
        collisionEnabled?: boolean;
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
    collisionEnabled: boolean;

    debugDrawBounds: boolean;

    private _immovable: boolean;

    private _bounds!: Bounds;
    get bounds() { return this._bounds; }
    set bounds(value: Bounds) {
        this._bounds = value;
        this._bounds.parent = this;
    }

    constructor(config: PhysicsWorldObject.Config<PhysicsWorldObject> = {}) {
        super(config);
        this.mass = config.mass ?? 1;
        this._gravity = vec2(config.gravityx ?? 0, config.gravityy ?? 0);
        this.gravityz = config.gravityz ?? 0;
        this.affectedByGravity = config.affectedByGravity ?? true;
        this.bounce = config.bounce ?? 1;

        this.bounds = config.bounds ?? new NullBounds();

        this._immovable = config.immovable ?? false;
        this.collisionEnabled = config.collisionEnabled ?? true;

        this.debugDrawBounds = false;
    }

    override update() {
        this.applyGravity();
        super.update();
    }

    override render(): Render.Result {
        let result: Render.Result = FrameCache.array();
        if (Debug.SHOW_ALL_PHYSICS_BOUNDS || this.debugDrawBounds) {
            let zoffset = 0; // offset to cancel out the z-factor when drawing bounds
            if (this.zBehavior === 'threequarters') {
                let parentz = this.parent ? this.parent.z : 0;
                zoffset = parentz - this.z;
            }
            result.pushAll(Render.shift(this.renderBounds(), 0, -zoffset));
        }
        result.pushAll(super.render());
        return result;
    }

    getWorldBounds() {
        return this.bounds.getBoundingBox$();
    }

    isCollidingWith(other: PhysicsWorldObject) {
        return this.isOverlapping(other.bounds);
    }

    isGrounded(groundGroups: string[]) {
        if (!this.world) return false;
        this.bounds.y++;
        let ground = this.world.select.overlap$(this.bounds, groundGroups)
            .filterInPlace(o => o.collisionEnabled);
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

    private applyGravity() {
        this.v.x += this.gravity.x * this.delta;
        this.v.y += this.gravity.y * this.delta;
        this.vz += this.gravityz * this.delta;
    }

    private renderBounds() {
        return Render.shift(this.bounds.debugRender(), -this.x, -this.y);
    }
}