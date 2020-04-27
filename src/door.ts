class Door extends Sprite {
    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'door',
            bounds: { x: -16, y: -4, width: 32, height: 4 },
            immovable: true,
        })
    }

    onCollide(other: WorldObject) {
        if (other instanceof ItemGround && other.type === Item.Type.KEY) {
            World.Actions.removeWorldObjectFromWorld(this);
            World.Actions.removeWorldObjectFromWorld(other);
        }

        if (other instanceof Player && other.isHoldingKey) {
            World.Actions.removeWorldObjectFromWorld(this);
            other.removeHeldItem();
        }
    }
}