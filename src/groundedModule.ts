class GroundedModule {
    private obj: PhysicsWorldObject;
    
    checkThreshold: number;
    moveThreshold: number;

    grounded: boolean;
    checkGroups: string[];
    checkBounds: Bounds;

    constructor(obj: PhysicsWorldObject, checkThreshold: number, moveThreshold: number) {
        this.obj = obj;
        this.checkThreshold = checkThreshold;
        this.moveThreshold = moveThreshold;

        let box = this.obj.bounds.getBoundingBox()
        this.checkBounds = new RectBounds(box.left - obj.x, box.bottom - obj.y, box.width, 1, obj);
    }

    preUpdate() {
        this.checkGroups = this.obj.world.getPhysicsGroupsThatCollideWith(this.obj.physicsGroup);
        this.grounded = this.obj.vy >= -1 && !_.isEmpty(this.obj.world.select.overlap(this.checkBounds, this.checkGroups));
    }

    update() {
        if (!this.grounded) return;

        let box = this.checkBounds.getBoundingBox();

        let raycasts = A.range(box.width+1).map(i => this.obj.world.select.raycast(box.left + i, box.top - this.checkThreshold, 0, 1, this.checkGroups))
                                           .filter(list => !_.isEmpty(list))
                                           .map(list => list[0]);

        if (raycasts.every(rr => rr.obj.bounds instanceof RectBounds)) return;

        let dist = M.min(raycasts, rr => rr.t) - this.checkThreshold;
        if (!isFinite(dist) || dist > this.moveThreshold) return;

        this.obj.y += dist;
    }

    postUpdate() {
        if (this.grounded) {
            this.obj.vy = 0;
        }
    }
}