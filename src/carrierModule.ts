class CarrierModule {
    private riders: PhysicsWorldObject[];
    private obj: PhysicsWorldObject;

    constructor(obj: PhysicsWorldObject) {
        this.riders = [];
        this.obj = obj;
    }

    postUpdate() {
        let objBounds = this.obj.bounds.getBoundingBox();
        let checkBounds = new RectBounds(objBounds.x, objBounds.y-1, objBounds.width, 1);

        for (let potentialRider of this.obj.world.getPhysicsObjectsThatCollideWith(this.obj.physicsGroup)) {
            if (potentialRider instanceof OneWayPlatform || potentialRider instanceof MovingPlatform) continue;
            if (potentialRider.isOverlapping(checkBounds)) {
                if (_.contains(this.riders, potentialRider)) continue;
                if (potentialRider.parent) continue;  // Disallow riding by any child object
                this.obj.addChildKeepWorldPosition(potentialRider);
                this.riders.push(potentialRider);
            } else {
                if (!_.contains(this.riders, potentialRider)) continue;
                A.removeAll(this.riders, potentialRider);
                if (_.contains(this.obj.children, potentialRider)) {
                    this.obj.removeChildKeepWorldPosition(potentialRider);
                }
            }
        }
    }
}