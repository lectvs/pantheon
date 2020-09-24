class GroundedModule {
    private obj: PhysicsWorldObject;
    
    checkThreshold: number;
    moveThreshold: number;

    private groundedObject: PhysicsWorldObject;
    get grounded() { return !!this.groundedObject; }

    checkBounds: Bounds;

    constructor(obj: PhysicsWorldObject, checkThreshold: number, moveThreshold: number) {
        this.obj = obj;
        this.checkThreshold = checkThreshold;
        this.moveThreshold = moveThreshold;

        let box = this.obj.bounds.getBoundingBox()
        this.checkBounds = new RectBounds(box.left - obj.x, box.bottom - obj.y, box.width, 1, obj);
    }

    getGroundedObject() {
        let checkGroups = this.obj.world.getPhysicsGroupsThatCollideWith(this.obj.physicsGroup);
        let overlappedObjs = this.obj.world.select.overlap(this.checkBounds, checkGroups);
        if (_.isEmpty(overlappedObjs)) return undefined;
        A.removeAll(overlappedObjs, this.obj);
        return M.argmin(overlappedObjs, ground => ground.bounds.getBoundingBox().top - this.obj.bounds.getBoundingBox().bottom);
    }

    preUpdate() {
        if (this.obj.vy < -1) {
            this.groundedObject = undefined;
            return;
        }
        this.groundedObject = this.getGroundedObject();
    }

    update() {
        if (!this.grounded) return;

        let box = this.checkBounds.getBoundingBox();

        let checkGroups = this.obj.world.getPhysicsGroupsThatCollideWith(this.obj.physicsGroup);
        let raycasts = A.range(box.width+1).map(i => this.obj.world.select.raycast(box.left + i, box.top - this.checkThreshold, 0, 1, checkGroups))
                                           .filter(list => !_.isEmpty(list) && list[0].obj !== this.obj)
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