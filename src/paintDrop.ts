class PaintDrop extends Sprite {
    static readonly GRAVITY = -800;

    constructor(config: Sprite.Config) {
        super({
            texture: AnchoredTexture.fromBaseTexture(Texture.filledCircle(2, 0xFFFFFF, 1), 0.5, 0.5),
            gravityz: PaintDrop.GRAVITY,
            bounds: new CircleBounds(0, 0, 0),
            ...config
        });
    }

    update() {
        super.update();

        if (this.z < 0) {
            let floorDecal = this.world.select.name<Sprite>('floor_decal');
            if (floorDecal) {
                this.addPaintSplotch(undefined, floorDecal.getTexture());
            }
            this.kill();
        }
    }

    onCollide(collision: Physics.CollisionInfo) {
        super.onCollide(collision);

        let other = collision.other.obj;

        let decalModule = other.getModule(DecalModule);
        if (decalModule) {
            this.addPaintSplotch(decalModule, undefined);
        }

        this.kill();
    }
    
    private addPaintSplotch(decal: DecalModule, floorTexture: Texture) {
        let splotches = ['splotch_0', 'splotch_1', /*'splotch_2',*/ 'splotch_3', 'splotch_4', 'splotch_5'];
        this.world.addWorldObject(new PaintSplotch({
            x: this.x, y: this.y, z: this.z,
            texture: Random.element(splotches),
            tint: this.tint,
            angle: 90*Random.int(0, 3),
            layer: 'main',
        }, decal, floorTexture));
    }
}