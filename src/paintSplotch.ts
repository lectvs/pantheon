class PaintSplotch extends Sprite {

    private decal: DecalModule;
    private floorTexture: Texture;

    constructor(config: Sprite.Config, decal: DecalModule, floorTexture: Texture) {
        super({
            ...config
        });
        this.decal = decal;
        this.floorTexture = floorTexture;
    }

    onAdd() {
        super.onAdd();

        this.scaleX = 0;
        this.scaleY = 0;
        this.runScript(S.chain(
            S.doOverTime(0.1, t => {
                this.scaleX = (t+1)/2;
                this.scaleY = (t+1)/2;
            }),
            S.call(() => {
                if (this.decal) {
                    this.decal.drawSprite(this);
                }
                if (this.floorTexture) {
                    this.render(this.floorTexture, this.x, this.y);
                }
                this.kill();
            }),
        ));
    }
}