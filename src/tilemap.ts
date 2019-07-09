namespace Tilemap {
    export type Config = WorldObject.Config & {
        tilemap: string;
        tileWidth: number;
        tileHeight: number;
    }

    export type Tile = {
        texture: string;
    }

    export type Tilemap = Tile[][];
}

class Tilemap extends WorldObject {
    tilemap: Tilemap.Tilemap;

    tileWidth: number;
    tileHeight: number;
    numTilesX: number;
    numTilesY: number;

    renderTexture: PIXIRenderTextureSprite;
    
    private tileSprite: PIXI.Sprite;
    private dirty: boolean;

    constructor(config: Tilemap.Config) {
        super(config);

        this.tilemap = A.clone2D(AssetCache.getTilemap(config.tilemap));

        let tilemapDimens = A.get2DArrayDimensions(this.tilemap);
        this.tileWidth = config.tileWidth;
        this.tileHeight = config.tileHeight;
        this.numTilesX = tilemapDimens.width;
        this.numTilesY = tilemapDimens.height;

        this.renderTexture = new PIXIRenderTextureSprite(this.numTilesX * this.tileWidth, this.numTilesY * this.tileHeight);

        this.tileSprite = new PIXI.Sprite();
        this.dirty = true;
    }

    render(options: RenderOptions) {
        if (this.dirty) {
            this.drawRenderTexture(options.renderer);
            this.dirty = false;
        }
        
        this.renderTexture.x = this.x;
        this.renderTexture.y = this.y;
        options.renderer.render(this.renderTexture, options.renderTexture, false, options.matrix);

        super.render(options);
    }

    drawRenderTexture(renderer: PIXI.Renderer) {
        this.renderTexture.clear(renderer);
        for (let y = 0; y < this.tilemap.length; y++) {
            for (let x = 0; x < this.tilemap[y].length; x++) {
                if (!this.tilemap[y][x]) continue;
                let tile = this.tilemap[y][x];
                this.tileSprite.texture = AssetCache.getTexture(tile.texture);
                this.tileSprite.x = x * this.tileWidth;
                this.tileSprite.y = y * this.tileHeight;
                renderer.render(this.tileSprite, this.renderTexture.renderTexture, false);
            }
        }
    }
}
