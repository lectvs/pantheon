class Tutorial extends SpriteText {
    private sectorx: number;
    private sectory: number;

    constructor(x: number, y: number, sectorx: number, sectory: number, text: string) {
        super({
            x, y, text,
            style: { alpha: 0 },
            anchor: Vector2.TOP_CENTER,
        });

        this.sectorx = sectorx;
        this.sectory = sectory;
    }

    update() {
        super.update();

        let visible = true;
        let cc = global.world.select.type(CameraController);
        if (cc.sector.x !== this.sectorx || cc.sector.y !== this.sectory) {
            visible = false;
        }

        if (visible) {
            this.style.alpha = Math.min(this.style.alpha + 2*this.delta, 1);
        } else {
            this.style.alpha = 0;
        }
    }
}