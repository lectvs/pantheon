class CarrierModule {
    private riders: PhysicsWorldObject[];
    private obj: PhysicsWorldObject;

    constructor(obj: PhysicsWorldObject) {
        this.riders = [];
        this.obj = obj;
    }

    postUpdate() {
        let objBounds = this.obj.getWorldBounds();
        let checkRect: Rect = {
            x: objBounds.x,
            y: objBounds.y - 1,
            width: objBounds.width,
            height: 1
        };

        for (let potentialRider of this.obj.world.getPhysicsObjectsThatCollideWith(this.obj.physicsGroup)) {
            if (potentialRider.isOverlappingRect(checkRect)) {
                if (_.contains(this.riders, potentialRider)) continue;
                if (_.contains(this.obj.children, potentialRider)) continue;  // Disallow an object's own child to ride it
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