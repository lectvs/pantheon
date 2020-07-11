class CarrierModule {
    private riders: PhysicsWorldObject[];

    constructor() {
        this.riders = [];
    }

    postUpdate(obj: PhysicsWorldObject) {
        let objBounds = obj.getWorldBounds();
        let checkRect: Rect = {
            x: objBounds.x,
            y: objBounds.y - 1,
            width: objBounds.width,
            height: 1
        };

        for (let potentialRider of obj.world.getPhysicsObjectsThatCollideWith(obj.physicsGroup)) {
            if (potentialRider.isOverlappingRect(checkRect)) {
                if (_.contains(this.riders, potentialRider)) continue;
                if (_.contains(obj.children, potentialRider)) continue;  // Disallow an object's own child to ride it
                obj.addChildKeepWorldPosition(potentialRider);
                this.riders.push(potentialRider);
            } else {
                if (!_.contains(this.riders, potentialRider)) continue;
                A.removeAll(this.riders, potentialRider);
                if (_.contains(obj.children, potentialRider)) {
                    obj.removeChildKeepWorldPosition(potentialRider);
                }
            }
        }
    }
}