namespace ZOrderedTilemap {
    export type ZMap = {[key: number]: number};
}

class ZOrderedTilemap extends Tilemap {
    private zMap: ZOrderedTilemap.ZMap;
    private tiles: Sprite[];

    constructor(config: Tilemap.Config & { zMap: ZOrderedTilemap.ZMap }) {
        super(config);
        this.zMap = config.zMap;
        //this.zRenderTextures = [];
    }

    drawRenderTexture() {
        this.renderTexture.clear();
        for (let y = 0; y < this.currentTilemapLayer.length; y++) {
            for (let x = 0; x < this.currentTilemapLayer[y].length; x++) {
                this.drawTile(this.currentTilemapLayer[y][x], x, y, this.renderTexture);
            }
        }
    }

    // private createZRenderTextures(zMap: ZOrderedTilemap.ZMap) {
    //     this.zRenderTextures = [];
    //     for (let index in zMap) {
    //         let z = zMap[index];
    //         this.zRenderTextures.push()
    //     }
    // }
}