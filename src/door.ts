class Door extends Sprite {
    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'door_0',
            bounds: { x: -16, y: -4, width: 32, height: 4 },
            immovable: true,
            animations: [
                Animations.fromTextureList({ name: 'open', texturePrefix: 'door_', textures: [1, 2], frameRate: 8 })
            ]
        })
    }

    onCollide(other: WorldObject) {
        if (other instanceof Item && other.type === Item.Type.KEY) {
            this.open();
            World.Actions.removeWorldObjectFromWorld(other);
        }

        if (other instanceof Player && other.isHoldingKey) {
            this.open();
            other.deleteHeldItem();
        }
    }

    open() {
        this.colliding = false;
        this.playAnimation('open');
    }
}