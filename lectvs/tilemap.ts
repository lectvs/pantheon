namespace Tilemap {
    export type Config = WorldObject.Config & {
        tilemap: string;
        tint?: number;
        tilemapLayer?: number;
        debugBounds?: boolean;
    }

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
}

// TODO: convert this to a sprite?
class Tilemap extends WorldObject {
    tilemap: Tilemap.Tilemap;

    numTilesX: number;
    numTilesY: number;

    renderTexture: Texture;
    collisionBoxes: PhysicsWorldObject[];

    tint: number;
    
    private tilemapLayer: number;
    private dirty: boolean;

    get currentTilemapLayer() { return this.tilemap.layers[this.tilemapLayer]; }

    constructor(config: Tilemap.Config) {
        super(config);

        this.tilemap = Tilemap.cloneTilemap(AssetCache.getTilemap(config.tilemap));
        this.tilemapLayer = O.getOrDefault(config.tilemapLayer, 0);

        let tilemapDimens = A.get2DArrayDimensions(this.currentTilemapLayer);
        this.numTilesX = tilemapDimens.width;
        this.numTilesY = tilemapDimens.height;

        this.renderTexture = new Texture(this.numTilesX * this.tilemap.tileset.tileWidth, this.numTilesY * this.tilemap.tileset.tileHeight);
        this.createCollisionBoxes(O.getOrDefault(config.debugBounds, false));

        this.tint = O.getOrDefault(config.tint, 0xFFFFFF);
        this.dirty = true;
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

    render(screen: Texture) {
        if (this.dirty) {
            this.drawRenderTexture();
            this.dirty = false;
        }
        
        screen.render(this.renderTexture, {
            x: this.x,
            y: this.y,
            tint: this.tint
        });

        super.render(screen);
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
        this.renderTexture.clear();
        for (let y = 0; y < this.currentTilemapLayer.length; y++) {
            for (let x = 0; x < this.currentTilemapLayer[y].length; x++) {
                this.drawTile(this.currentTilemapLayer[y][x], x, y, this.renderTexture);
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
}
