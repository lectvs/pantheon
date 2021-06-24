class Grapple extends Sprite {
    private source: Player;

    finished: boolean = false;

    constructor(source: Player) {
        super({
            x: source.x, y: source.y - 8,
            texture: 'grapple',
            layer: 'grapple',
            vx: 600,
            physicsGroup: 'grapple',
            bounds: new RectBounds(-2, -2, 4, 4),
        });

        this.source = source;
    }

    render(texture: Texture, x: number, y: number) {
        if (!this.finished) {
            let dx = this.x - this.source.x;
            let dy = this.y - (this.source.y - 8);
            Draw.brush.color = 0xFFFFFF;
            Draw.brush.thickness = 2;
            Draw.line(texture, x - dx, y - dy, x, y);
        }
        super.render(texture, x, y);
    }

    onCollide(collision: Physics.CollisionInfo) {
        super.onCollide(collision);
        
        let dx = this.x - this.source.x;
        let chainNodes = A.range(21).map(i => vec2(this.x - dx/20*i, this.y));
        this.world.addWorldObject(new Chain(chainNodes));
        this.finished = true;
    }

    getVisibleScreenBounds() {
        return undefined;
    }
}