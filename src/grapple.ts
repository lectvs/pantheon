class Grapple extends Sprite {
    private readonly SPEED = 800;

    direction: Direction2D;
    isPulling: boolean;
    broken: boolean;

    private player: Player;
    private offx: number;
    private offy: number;
    private color: number;

    get isPlayers() { return !(this.player instanceof Boss); }

    constructor(player: Player, offx: number, offy: number, direction: Direction2D, color: number) {
        super({
            x: player.x + offx,
            y: player.y + offy,
            texture: 'grapple',
            layer: 'entities',
            physicsGroup: 'grapple',
            bounds: new RectBounds(-3, -3, 6, 6),
        });

        this.v.x = direction.h * this.SPEED;
        this.v.y = direction.v * this.SPEED;

        this.angle = M.radToDeg(Direction.angleOf(direction));
        this.tint = color;

        this.direction = direction;
        this.isPulling = false;
        this.broken = false;

        this.player = player;
        this.offx = offx;
        this.offy = offy;
        this.color = color;
    }

    update() {
        if (this.isPulling) {
            this.v.x = this.v.y = 0;
        }
        super.update();

        if (!this.isPulling) {
            let overlap = this.world.select.overlap(this.bounds, ['walls', 'enemies']);

            for (let wo of overlap) {
                if (wo.physicsGroup === 'walls') {
                    let bounds = wo.bounds.getBoundingBox();
                    if (this.direction.h > 0) this.x = bounds.left - 2;
                    if (this.direction.h < 0) this.x = bounds.right + 2;
                    if (this.direction.v > 0) this.y = bounds.top - 2;
                    if (this.direction.v < 0) this.y = bounds.bottom + 2;
                    this.isPulling = true;
                }

                if (this.isPlayers && (wo instanceof Bat || wo instanceof Boss)) {
                    wo.damage(this.direction);
                    this.broken = true;
                }

                if (wo instanceof Lava) {
                    this.broken = true;
                }
            }
        }
    }

    render(texture: Texture, x: number, y: number) {
        super.render(texture, x, y);

        let ox = x - this.x + this.player.x + this.offx;
        let oy = y - this.y + this.player.y + this.offy;

        Draw.brush.color = this.color;
        Draw.brush.alpha = 1;
        Draw.brush.thickness = 1;

        Draw.line(texture, ox, oy, x, y);
        Draw.line(texture, ox+1, oy+1, x+1, y+1);
    }

    getVisibleScreenBounds() {
        return undefined;
    }
}