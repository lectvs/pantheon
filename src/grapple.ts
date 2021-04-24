class Grapple extends Sprite {
    private readonly SPEED = 800;
    readonly PULL_SPEED = 200;

    direction: Direction2D;
    isPulling: boolean;

    constructor(x: number, y: number, direction: Direction2D) {
        super({
            x, y,
            texture: 'grapple',
            layer: 'entities',
            physicsGroup: 'grapple',
            bounds: new RectBounds(-4, -4, 4, 8),
        });

        this.v.x = direction.h * this.SPEED;
        this.v.y = direction.v * this.SPEED;

        this.angle = M.radToDeg(Direction.angleOf(direction));

        this.direction = direction;
        this.isPulling = false;
    }

    update() {
        super.update();
    }

    onCollide(collision: Physics.CollisionInfo) {
        super.onCollide(collision);
        this.isPulling = true;
    }
}