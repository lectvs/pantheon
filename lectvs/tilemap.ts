namespace Tilemap {
    export type Config = WorldObject.Config & {
        tilemap: string;
        tilemapLayer?: number;
        debugBounds?: boolean;
        zMap?: Tilemap.ZMap
    };
    export type Tile = {
        index: number;
        angle: number;
        flipX: boolean;
    }

    export type Tilemap = {
        tileset: Tilemap.Tileset;
        layers: TilemapLayer[];
    }

    export type TilemapLayer = Tile[][];

    export type Tileset = {
        tiles: string[];
        tileWidth: number;
        tileHeight: number;
        collisionIndices?: number[];
    }
    export type ZMap = {[key: number]: number};
    export type ZTexture = {
        texture: Texture;
        bounds: Rect;
        tileBounds: Bounds;
        zHeight: number;
    }
    export type ZTextureMap = {[key: number]: ZTexture};
}

class Tilemap extends WorldObject {
    tilemap: Tilemap.Tilemap;

    numTilesX: number;
    numTilesY: number;

    collisionBoxes: PhysicsWorldObject[];
    
    private tilemapLayer: number;
    private dirty: boolean;
    private zMap: Tilemap.ZMap;
    private zTextures: Sprite[];

    get currentTilemapLayer() { return this.tilemap.layers[this.tilemapLayer]; }

    constructor(config: Tilemap.Config) {
        super(config);
        this.tilemap = Tilemap.cloneTilemap(AssetCache.getTilemap(config.tilemap));
        this.tilemapLayer = O.getOrDefault(config.tilemapLayer, 0);

        let tilemapDimens = A.get2DArrayDimensions(this.currentTilemapLayer);
        this.numTilesX = tilemapDimens.width;
        this.numTilesY = tilemapDimens.height;

        this.createCollisionBoxes(O.getOrDefault(config.debugBounds, false));

        this.dirty = true;
        this.zMap = O.getOrDefault(config.zMap, {});
    }

    update(delta: number) {
        if (this.dirty) {
            this.drawRenderTexture();
            this.dirty = false;
        }
    }

    createCollisionBoxes(debugBounds: boolean) {
        this.collisionBoxes = [];
        let collisionRects = Tilemap.getCollisionRects(this.currentTilemapLayer, this.tilemap.tileset);
        Tilemap.optimizeCollisionRects(collisionRects);  // Not optimizing entire array first to save some cycles.
        Tilemap.optimizeCollisionRects(collisionRects, Tilemap.OPTIMIZE_ALL);
        for (let rect of collisionRects) {
            let box = new PhysicsWorldObject({
                x: this.x, y: this.y,
                bounds: rect,
                physicsGroup: this.physicsGroup,
                immovable: true,
            });
            box.debugBounds = debugBounds;
            this.collisionBoxes.push(box);
        }

        World.Actions.addChildrenToParent(this.collisionBoxes, this);
    }

    drawRenderTexture() {
        this.clearZTextures();

        let zTileIndices = Tilemap.createZTileIndicies(this.currentTilemapLayer, this.zMap);
        
        let zTextures = this.createZTextures(zTileIndices);

        for (let y = 0; y < this.currentTilemapLayer.length; y++) {
            for (let x = 0; x < this.currentTilemapLayer[y].length; x++) {
                let zValue = Tilemap.getZValue(zTileIndices, y, x);
                if (!zTextures[zValue]) continue;
                this.drawTile(this.currentTilemapLayer[y][x], x - zTextures[zValue].tileBounds.left, y - zTextures[zValue].tileBounds.top, zTextures[zValue].texture);
            }
        }
    }

    drawTile(tile: Tilemap.Tile, tileX: number, tileY: number, renderTexture: Texture) {
        if (!tile || tile.index < 0) return;
        let textureKey = this.tilemap.tileset.tiles[tile.index];
        let texture = AssetCache.getTexture(textureKey);
        renderTexture.render(texture, {
            x: (tileX + 0.5) * this.tilemap.tileset.tileWidth,
            y: (tileY + 0.5) * this.tilemap.tileset.tileHeight,
            angle: tile.angle,
            scaleX: tile.flipX ? -1 : 1,
        });
    }

    private createZTextures(zTileIndices: number[][]) {
        let texturesByZ = Tilemap.createEmptyZTextures(zTileIndices, this.tilemap.tileset);

        for (let zValue in texturesByZ) {
            let zHeight = texturesByZ[zValue].zHeight * this.tilemap.tileset.tileHeight;
            let zTexture = World.Actions.addChildToParent(new Sprite({
                layer: this.layer,
                x: this.x + texturesByZ[zValue].bounds.x,
                y: this.y + texturesByZ[zValue].bounds.y + zHeight,
                texture: texturesByZ[zValue].texture,
                offset: { x: 0, y: -zHeight },
            }), this);
            this.zTextures.push(zTexture);
        }

        return texturesByZ;
    }

    private clearZTextures() {
        World.Actions.removeWorldObjectsFromWorld(this.zTextures);
        this.zTextures = [];
    }
}

namespace Tilemap {
    export function cloneTilemap(tilemap: Tilemap) {
        let result: Tilemap = {
            tileset: tilemap.tileset,
            layers: [],
        };

        for (let i = 0; i < tilemap.layers.length; i++) {
            result.layers.push(A.clone2D(tilemap.layers[i]));
        }

        return result;
    }

    export function createZTileIndicies(layer: Tilemap.TilemapLayer, zMap: Tilemap.ZMap) {
        let zTileIndices = getInitialZTileIndicies(layer, zMap);
        fillZTileIndicies(zTileIndices);
        return zTileIndices;
    }

    export function createEmptyZTextures(zTileIndices: number[][], tileset: Tilemap.Tileset): Tilemap.ZTextureMap {
        let zTextureSlots: Tilemap.ZTextureMap = {};
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

    export function getCollisionRects(tilemapLayer: Tilemap.TilemapLayer, tileset: Tileset) {
        if (_.isEmpty(tileset.collisionIndices)) return [];
        let result: Rect[] = [];
        for (let y = 0; y < tilemapLayer.length; y++) {
            for (let x = 0; x < tilemapLayer[y].length; x++) {
                let tile = tilemapLayer[y][x];
                if (_.contains(tileset.collisionIndices, tile.index)) {
                    let rect = {
                        x: x*tileset.tileWidth,
                        y: y*tileset.tileHeight,
                        width: tileset.tileWidth,
                        height: tileset.tileHeight
                    };
                    result.push(rect);
                }
            }
        }
        return result;
    }

    export function getZValue(zTileIndices: number[][], y: number, x: number) {
        return y + zTileIndices[y][x];
    }

    export function lookupZMapValue(tile: Tilemap.Tile, zMap: Tilemap.ZMap) {
        return zMap[tile.index];
    }

    export function optimizeCollisionRects(rects: Rect[], all: boolean = !OPTIMIZE_ALL) {
        let i = 0;
        while (i < rects.length) {
            let j = i + 1;
            while (j < rects.length) {
                let combined = combineRects(rects[j], rects[i]);
                if (combined) {
                    rects.splice(j, 1);
                } else if (all) {
                    j++;
                } else {
                    break;
                }
            }
            i++;
        }
    }
    export const OPTIMIZE_ALL = true;

    function combineRects(rect: Rect, into: Rect) {
        if (G.rectContainsRect(into, rect)) return true;
        if (G.rectContainsRect(rect, into)) {
            into.x = rect.x;
            into.y = rect.y;
            into.width = rect.width;
            into.height = rect.height;
            return true;
        }
        if (rect.x == into.x && rect.width == into.width) {
            if (rect.y <= into.y + into.height && rect.y + rect.height >= into.y) {
                let newY = Math.min(rect.y, into.y);
                let newH = Math.max(rect.y + rect.height, into.y + into.height) - newY;
                into.y = newY;
                into.height = newH;
                return true;
            }
        }
        if (rect.y == into.y && rect.height == into.height) {
            if (rect.x <= into.x + into.width && rect.x + rect.width >= into.x) {
                let newX = Math.min(rect.x, into.x);
                let newW = Math.max(rect.x + rect.width, into.x + into.width) - newX;
                into.x = newX;
                into.width = newW;
                return true;
            }
        }
        return false;
    }

    function getInitialZTileIndicies(layer: Tilemap.TilemapLayer, zMap: Tilemap.ZMap) {
        let zTileIndices = A.filledArray2D<number>(layer.length, layer[0].length, undefined);

        if (_.isEmpty(zMap)) {
            for (let x = 0; x < layer[0].length; x++) {
                zTileIndices[0][x] = 0;
            }
            return zTileIndices;
        }

        for (let y = 0; y < layer.length; y++) {
            for (let x = 0; x < layer[y].length; x++) {
                let tile = layer[y][x];
                zTileIndices[y][x] = tile.index === -1 ? -Infinity : lookupZMapValue(tile, zMap);
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