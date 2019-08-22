namespace Tilemap {
    export type Config = WorldObject.Config & {
        tilemap: string;
        tileset: Tilemap.Tileset;
        collisionPhysicsGroup?: string;
        collisionDebugBounds?: boolean;
    }

    export type Tile = {
        index: number;
    }

    export type Tilemap = Tile[][];

    export type Tileset = {
        tiles: string[];
        tileWidth: number;
        tileHeight: number;
        collisionIndices?: number[];
    }
}

class Tilemap extends WorldObject {
    tilemap: Tilemap.Tilemap;
    tileset: Tilemap.Tileset;
    collisionPhysicsGroup: string;

    numTilesX: number;
    numTilesY: number;

    renderTexture: PIXIRenderTextureSprite;
    collisionBoxes: PhysicsWorldObject[];
    
    private tileSprite: PIXI.Sprite;
    private dirty: boolean;

    constructor(config: Tilemap.Config) {
        super(config);

        this.tilemap = A.clone2D(AssetCache.getTilemap(config.tilemap));
        this.tileset = config.tileset;
        this.collisionPhysicsGroup = config.collisionPhysicsGroup;

        let tilemapDimens = A.get2DArrayDimensions(this.tilemap);
        this.numTilesX = tilemapDimens.width;
        this.numTilesY = tilemapDimens.height;

        this.renderTexture = new PIXIRenderTextureSprite(this.numTilesX * this.tileset.tileWidth, this.numTilesY * this.tileset.tileHeight);
        this.createCollisionBoxes(O.getOrDefault(config.collisionDebugBounds, false));

        this.tileSprite = new PIXI.Sprite();
        this.dirty = true;
    }

    onAdd() {
        for (let box of this.collisionBoxes) {
            global.world.addWorldObject(box, {
                physicsGroup: this.collisionPhysicsGroup
            });
        }
    }

    postUpdate() {
        super.postUpdate();
        if (!_.isEmpty(this.collisionBoxes) && (this.collisionBoxes[0].x !== this.x || this.collisionBoxes[0].y !== this.y)) {
            for (let box of this.collisionBoxes) {
                box.x = this.x;
                box.y = this.y;
            }
        }
    }

    render() {
        if (this.dirty) {
            this.drawRenderTexture();
            this.dirty = false;
        }
        
        this.renderTexture.x = this.x;
        this.renderTexture.y = this.y;
        global.renderer.render(this.renderTexture, global.renderTexture, false);

        super.render();
    }

    createCollisionBoxes(debugBounds: boolean = false) {
        this.collisionBoxes = [];
        let collisionRects = Tilemap.getCollisionRects(this.tilemap, this.tileset);
        Tilemap.optimizeCollisionRects(collisionRects);  // Not optimizing entire array first to save some cycles.
        Tilemap.optimizeCollisionRects(collisionRects, Tilemap.OPTIMIZE_ALL);
        for (let rect of collisionRects) {
            let box = new PhysicsWorldObject({ x: this.x, y: this.y, bounds: rect });
            box.debugBounds = debugBounds;
            this.collisionBoxes.push(box);
        }
    }

    drawRenderTexture() {
        this.renderTexture.clear(global.renderer);
        for (let y = 0; y < this.tilemap.length; y++) {
            for (let x = 0; x < this.tilemap[y].length; x++) {
                if (!this.tilemap[y][x] || this.tilemap[y][x].index < 0) continue;
                let tile = this.tilemap[y][x];
                let textureKey = this.tileset.tiles[tile.index];
                this.tileSprite.texture = AssetCache.getTexture(textureKey);
                this.tileSprite.x = x * this.tileset.tileWidth;
                this.tileSprite.y = y * this.tileset.tileHeight;
                global.renderer.render(this.tileSprite, this.renderTexture.renderTexture, false);
            }
        }
    }

    onRemove() {
        for (let box of this.collisionBoxes) {
            global.world.removeWorldObject(box);
        }
    }
}

namespace Tilemap {
    export function getCollisionRects(tilemap: Tilemap, tileset: Tileset) {
        if (_.isEmpty(tileset.collisionIndices)) return [];
        let result: Rect[] = [];
        for (let y = 0; y < tilemap.length; y++) {
            for (let x = 0; x < tilemap[y].length; x++) {
                let tile = tilemap[y][x];
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
        if (G.rectContains(into, rect)) return true;
        if (G.rectContains(rect, into)) {
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
