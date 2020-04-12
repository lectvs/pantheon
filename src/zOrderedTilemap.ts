namespace ZOrderedTilemap {
    export type Config = Tilemap.Config & { zMap: ZOrderedTilemap.ZMap };
    export type ZMap = {[key: number]: number};
    export type ZTexture = {
        texture: Texture;
        bounds: Rect;
        tileBounds: Bounds;
        zHeight: number;
    }
    export type ZTextureMap = {[key: number]: ZTexture};
}

class ZOrderedTilemap extends WorldObject {
    tilemap: Tilemap.Tilemap;

    numTilesX: number;
    numTilesY: number;

    collisionBoxes: PhysicsWorldObject[];
    
    private tilemapLayer: number;
    private dirty: boolean;
    private zMap: ZOrderedTilemap.ZMap;

    get currentTilemapLayer() { return this.tilemap.layers[this.tilemapLayer]; }

    constructor(config: ZOrderedTilemap.Config) {
        super(config);
        this.tilemap = Tilemap.cloneTilemap(AssetCache.getTilemap(config.tilemap));
        this.tilemapLayer = O.getOrDefault(config.tilemapLayer, 0);

        let tilemapDimens = A.get2DArrayDimensions(this.currentTilemapLayer);
        this.numTilesX = tilemapDimens.width;
        this.numTilesY = tilemapDimens.height;

        this.createCollisionBoxes(O.getOrDefault(config.debugBounds, false));

        this.dirty = true;
        this.zMap = config.zMap;
    }

    onAdd(world: World) {
        for (let box of this.collisionBoxes) {
            World.Actions.setPhysicsGroup(box, this.physicsGroup);
            World.Actions.addWorldObjectToWorld(box, world);
        }
    }

    update(delta: number) {
        if (this.dirty) {
            this.drawRenderTexture();
            this.dirty = false;
        }
    }

    postUpdate() {
        if (!_.isEmpty(this.collisionBoxes) && (this.collisionBoxes[0].x !== this.x || this.collisionBoxes[0].y !== this.y)) {
            for (let box of this.collisionBoxes) {
                box.x = this.x;
                box.y = this.y;
            }
        }
        super.postUpdate();
    }

    createCollisionBoxes(debugBounds: boolean = false) {
        this.collisionBoxes = [];
        let collisionRects = Tilemap.getCollisionRects(this.currentTilemapLayer, this.tilemap.tileset);
        Tilemap.optimizeCollisionRects(collisionRects);  // Not optimizing entire array first to save some cycles.
        Tilemap.optimizeCollisionRects(collisionRects, Tilemap.OPTIMIZE_ALL);
        for (let rect of collisionRects) {
            let box = new PhysicsWorldObject({ x: this.x, y: this.y, bounds: rect });
            box.debugBounds = debugBounds;
            this.collisionBoxes.push(box);
        }
    }

    drawRenderTexture() {
        this.clearZTextures();

        let zTileIndices = ZOrderedTilemap.createZTileIndicies(this.currentTilemapLayer, this.zMap);
        
        let zTextures = this.createZTextures(zTileIndices);

        for (let y = 0; y < this.currentTilemapLayer.length; y++) {
            for (let x = 0; x < this.currentTilemapLayer[y].length; x++) {
                let zValue = ZOrderedTilemap.getZValue(zTileIndices, y, x);
                if (!zTextures[zValue]) continue;
                this.drawTile(this.currentTilemapLayer[y][x], x - zTextures[zValue].tileBounds.left, y - zTextures[zValue].tileBounds.top, zTextures[zValue].texture);
            }
        }
    }

    drawTile(tile: Tilemap.Tile, tileX: number, tileY: number, renderTexture: Texture) {
        if (!tile || tile.index < 0) return;
        let textureKey = this.tilemap.tileset.tiles[tile.index];
        let texture = AssetCache.getTexture(textureKey);
        renderTexture.render(texture, { x: tileX * this.tilemap.tileset.tileWidth, y: tileY * this.tilemap.tileset.tileHeight });
    }

    onRemove(world: World) {
        for (let box of this.collisionBoxes) {
            World.Actions.removeWorldObjectFromWorld(box);
        }
    }

    private createZTextures(zTileIndices: number[][]) {
        let texturesByZ = ZOrderedTilemap.createEmptyZTextures(zTileIndices, this.tilemap.tileset);

        for (let zValue in texturesByZ) {
            let zHeight = texturesByZ[zValue].zHeight * this.tilemap.tileset.tileHeight;
            World.Actions.addChildToParent(new Sprite({
                layer: this.layer,
                x: this.x + texturesByZ[zValue].bounds.x,
                y: this.y + texturesByZ[zValue].bounds.y + zHeight,
                texture: texturesByZ[zValue].texture,
                offset: { x: 0, y: -zHeight },
            }), this);
        }

        return texturesByZ;
    }

    private clearZTextures() {
        while (!_.isEmpty(this.children)) {
            World.Actions.removeChildFromParent(this.children[0]);
        }
    }
}

namespace ZOrderedTilemap {
    export function createZTileIndicies(layer: Tilemap.TilemapLayer, zMap: ZOrderedTilemap.ZMap) {
        let zTileIndices = getInitialZTileIndicies(layer, zMap);
        fillZTileIndicies(zTileIndices);
        return zTileIndices;
    }

    export function createEmptyZTextures(zTileIndices: number[][], tileset: Tilemap.Tileset): ZOrderedTilemap.ZTextureMap {
        let zTextureSlots: ZOrderedTilemap.ZTextureMap = {};
        for (let y = 0; y < zTileIndices.length; y++) {
            for (let x = 0; x < zTileIndices[y].length; x++) {
                if (isFinite(zTileIndices[y][x])) {
                    let zValue = getZValue(zTileIndices, y, x);
                    if (!zTextureSlots[zValue]) zTextureSlots[zValue] = {
                        texture: null,
                        bounds: { x: 0, y: 0, width: 0, height: 0 },
                        tileBounds: { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity },
                        zHeight: -Infinity,
                    };
                    if (x < zTextureSlots[zValue].tileBounds.left) zTextureSlots[zValue].tileBounds.left = x;
                    if (x > zTextureSlots[zValue].tileBounds.right) zTextureSlots[zValue].tileBounds.right = x;
                    if (y < zTextureSlots[zValue].tileBounds.top) zTextureSlots[zValue].tileBounds.top = y;
                    if (y > zTextureSlots[zValue].tileBounds.bottom) zTextureSlots[zValue].tileBounds.bottom = y;
                    if (zTileIndices[y][x] > zTextureSlots[zValue].zHeight) zTextureSlots[zValue].zHeight = zTileIndices[y][x];
                }
            }
        }

        for (let zValue in zTextureSlots) {
            zTextureSlots[zValue].bounds.x = zTextureSlots[zValue].tileBounds.left * tileset.tileWidth;
            zTextureSlots[zValue].bounds.y = zTextureSlots[zValue].tileBounds.top * tileset.tileHeight;
            zTextureSlots[zValue].bounds.width = (zTextureSlots[zValue].tileBounds.right - zTextureSlots[zValue].tileBounds.left + 1) * tileset.tileWidth;
            zTextureSlots[zValue].bounds.height = (zTextureSlots[zValue].tileBounds.bottom - zTextureSlots[zValue].tileBounds.top + 1) * tileset.tileHeight;
            zTextureSlots[zValue].texture = new Texture(zTextureSlots[zValue].bounds.width, zTextureSlots[zValue].bounds.height);
        }

        return zTextureSlots;
    }

    export function getZValue(zTileIndices: number[][], y: number, x: number) {
        return y + zTileIndices[y][x];
    }

    function getInitialZTileIndicies(layer: Tilemap.TilemapLayer, zMap: ZOrderedTilemap.ZMap) {
        let zTileIndices = A.filledArray2D<number>(layer.length, layer[0].length, undefined);
        for (let y = 0; y < layer.length; y++) {
            for (let x = 0; x < layer[y].length; x++) {
                let tileIndex = layer[y][x].index;
                zTileIndices[y][x] = tileIndex === -1 ? -Infinity : zMap[tileIndex];
            }
        }
        return zTileIndices;
    }

    function fillZTileIndicies(zTileIndices: number[][]) {
        for (let y = 1; y < zTileIndices.length; y++) {
            for (let x = 0; x < zTileIndices[y].length; x++) {
                if (zTileIndices[y][x] === undefined && isFinite(zTileIndices[y-1][x])) {
                    zTileIndices[y][x] = zTileIndices[y-1][x] - 1;
                }
            }
        }

        for (let y = zTileIndices.length-2; y >= 0; y--) {
            for (let x = 0; x < zTileIndices[y].length; x++) {
                if (zTileIndices[y][x] === undefined && isFinite(zTileIndices[y+1][x])) {
                    zTileIndices[y][x] = zTileIndices[y+1][x] + 1;
                }
            }
        }

        for (let y = 0; y < zTileIndices.length; y++) {
            for (let x = 0; x < zTileIndices[y].length; x++) {
                if (zTileIndices[y][x] === undefined) {
                    zTileIndices[y][x] = 0;
                }
            }
        }
    }
}