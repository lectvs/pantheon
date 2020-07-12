class OneWayPlatform extends Sprite {
    constructor(config: Sprite.Config) {
        super(config);
    }

    isCollidingWith(other: PhysicsWorldObject) {
        if (!super.isCollidingWith(other)) return false;

        let otherdy = other.y - other.physicslasty;
        if (otherdy < 0) return false;

        let thisWorldBounds = this.getWorldBounds();
        let otherWorldBounds = other.getWorldBounds();

        if (otherWorldBounds.bottom - otherdy > thisWorldBounds.top+1) return false;
        return true;
    }
}