class OneWayPlatform extends Sprite {
    constructor(config: Sprite.Config) {
        super(config);
    }

    isCollidingWith(other: PhysicsWorldObject) {
        if (!super.isCollidingWith(other)) return false;

        let otherdy = other.y - other.physicslasty;
        if (otherdy < 0) return false;

        let thisWorldBounds = this.bounds.getBoundingBox();
        let otherWorldBounds = other.bounds.getBoundingBox();

        if (otherWorldBounds.y + otherWorldBounds.height - otherdy > thisWorldBounds.y+1) return false;
        return true;
    }
}