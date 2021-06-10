class Grapple extends Sprite {
    private readonly SPEED = 800;

    direction: Vector2;
    isPulling: boolean;
    broken: boolean;

    private source: Pt;
    private offx: number;
    private offy: number;

    get isPlayers() { return !(this.source instanceof Boss); }

    constructor(source: Pt, offx: number, offy: number, direction: Vector2, color: number) {
        super({
            x: source.x + offx,
            y: source.y + offy,
            texture: 'grapple',
            layer: 'entities',
            physicsGroup: 'grapple',
            bounds: new RectBounds(-3, -3, 6, 6),
        });

        this.v.x = direction.x * this.SPEED;
        this.v.y = direction.y * this.SPEED;

        this.angle = direction.angle
        this.tint = color;

        this.direction = direction;
        this.isPulling = false;
        this.broken = false;

        this.source = source;
        this.offx = offx;
        this.offy = offy;
    }

    update() {
        if (this.isPulling) {
            this.v.x = this.v.y = 0;
        }
        super.update();

        if (!this.isPulling && !this.broken) {
            let overlap = this.world.select.overlap(this.bounds, ['walls', 'enemies']);

            overlap.sort((a,b) => {
                if (a.physicsGroup === 'walls') return 1;
                if (b.physicsGroup === 'walls') return -1;
                return 0;
            });

            for (let wo of overlap) {
                if (this.isPlayers && (wo instanceof Bat || wo instanceof Boss)) {
                    wo.damage(this.direction);
                    this.world.playSound('grapplehit');
                    this.break();
                    break;
                }

                if (wo.hasTag('no_grapple')) {
                    this.world.playSound('grapplehit');
                    this.break();
                    break;
                }

                if (wo.physicsGroup === 'walls') {
                    let bounds = wo.bounds.getBoundingBox();
                    if (this.direction.x > 0) this.x = bounds.left - 2;
                    if (this.direction.x < 0) this.x = bounds.right + 2;
                    if (this.direction.y > 0) this.y = bounds.top - 2;
                    if (this.direction.y < 0) this.y = bounds.bottom + 2;
                    this.isPulling = true;
                    this.world.playSound('grapplehit');
                    this.world.playSound('grapplepull');
                    break;
                }
            }
        }
    }

    render(texture: Texture, x: number, y: number) {
        super.render(texture, x, y);

        let ox = x - this.x + this.source.x + this.offx;
        let oy = y - this.y + this.source.y + this.offy;

        Draw.brush.color = this.tint;
        Draw.brush.alpha = this.alpha;
        Draw.brush.thickness = 1;

        Draw.line(texture, ox, oy, x, y);
        Draw.line(texture, ox+1, oy+1, x+1, y+1);
    }

    break() {
        this.broken = true;
        this.world.playSound('break');
        this.source = new Vector2(this.source.x, this.source.y);
        this.v.x = this.v.y = 0;

        this.runScript(S.chain(
            S.doOverTime(0.5, t => {
                this.alpha = 1-t;
            }),
            S.call(() => this.kill())
        ));
    }

    getVisibleScreenBounds() {
        return undefined;
    }
}