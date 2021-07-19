class CameraController extends WorldObject {
    private target: Pt;

    private sectorOffset: Vector2;
    sector: Vector2;

    constructor(target: Pt) {
        super();

        this.target = target;
    }

    onAdd() {
        this.sectorOffset = new Vector2(1, 0);
        this.sector = this.getTargetSector();
    }

    postUpdate() {
        super.postUpdate();

        let newSector = this.getTargetSector();
        let needToReposition = TransitionScripts.executeTransition(this.world, this.sector, newSector);
        if (needToReposition) newSector = this.getTargetSector();
        this.sector = newSector;

        this.world.camera.setModeFocus((this.sector.x + this.sectorOffset.x + 0.5) * this.world.width,
                                       (this.sector.y + this.sectorOffset.y + 0.5) * this.world.height);
    }

    private getTargetSector() {
        return new Vector2(Math.floor(this.target.x / this.world.width) - this.sectorOffset.x,
                           Math.floor(this.target.y / this.world.height) - this.sectorOffset.y);
    }
}