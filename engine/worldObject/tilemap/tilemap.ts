namespace Tilemap {
    export type Config = WorldObject.Config<TilemapClass> & {
        tilemap: string | Tilemap.Tilemap;
        tileset: string;
        tilemapLayer?: number | string;
        entities?: Dict<any>;
        zMap?: Tilemap.ZMap;
        animation?: Tilemap.Animation;
        collisionOnly?: boolean;
        emptyTiles?: 'solid' | 'non_solid' | 'use_tileset';
    }

    export type Tile = {
        index: number;
        angle: number;
        flipX: boolean;
        flipY: boolean;
    }

    export type Tilemap = {
        layers: TilemapLayer[];
    }

    export type TilemapLayer = {
        name: string;
        tiles: Tile[][];  // [y][x]-oriented array
    }

    export type Tileset = {
        tiles: string[];
        tileWidth: number;
        tileHeight: number;
        collisionIndices?: number[];
    }
    export type ZMap = {[key: number]: number};
    export type ZTexture = {
        frames: PIXI.RenderTexture[];
        bounds: Rect;
        tileBounds: Boundaries;
        zHeight: number;
    }
    export type ZTextureMap = {[key: number]: ZTexture};

    export type Animation = {
        frames: number;
        tilesPerFrame: number;
        frameRate: number;
    }
}

class Tilemap extends WorldObject {
    protected tilemap: Tilemap.Tilemap;
    protected tileset: Tilemap.Tileset;
    protected animation?: Tilemap.Animation;
    protected collisionOnly: boolean;
    protected emptyTiles?: 'solid' | 'non_solid' | 'use_tileset';

    collisionBoxes: PhysicsWorldObject[];
    
    protected tilemapLayer: number;
    protected dirty: boolean;
    protected zMap: Tilemap.ZMap;
    protected zTextures: Sprite[];

    protected debugDrawBounds: boolean;

    protected get currentTilemapLayer() { return this.tilemap.layers[this.tilemapLayer]; }

    constructor(config: Tilemap.Config) {
        super(config);

        this.collisionBoxes = [];
        this.zTextures = [];

        this.tilemap = Tilemap.cloneTilemap(Tilemap.getTilemapAsset(config.tilemap));
        this.scrubTilemapEntities(config.entities);
        this.tilemapLayer = this.getTilemapLayer(config.tilemapLayer ?? 0);

        this.tileset = Tilemap.getTilesetAsset(config.tileset);

        this.zMap = config.zMap ?? {};
        this.animation = config.animation;
        this.collisionOnly = config.collisionOnly ?? false;
        this.emptyTiles = config.emptyTiles ?? 'use_tileset';

        this.createTilemap();
        this.dirty = false;

        this.debugDrawBounds = false;
    }

    override update() {
        if (this.dirty) {
            this.createTilemap();
            this.dirty = false;
        }
    }

    getTile(x: number, y: number) {
        return this.currentTilemapLayer.tiles[y][x];
    }

    setTile(x: number, y: number, tile: Tilemap.Tile) {
        this.currentTilemapLayer.tiles[y][x] = O.deepClone(tile);
        this.dirty = true;
    }

    get width() {
        return this.widthInTiles * this.tileset.tileWidth;
    }

    get height() {
        return this.heightInTiles * this.tileset.tileHeight;
    }

    get widthInTiles() {
        return this.tilemap.layers[this.tilemapLayer].tiles[0].length;
    }

    get heightInTiles() {
        return this.tilemap.layers[this.tilemapLayer].tiles.length;
    }

    private createCollisionBoxes() {
        World.Actions.removeWorldObjectsFromWorld(this.collisionBoxes);
        this.collisionBoxes = [];
        let collisionRects = this.getCollisionRects(this.currentTilemapLayer);
        Tilemap.optimizeCollisionRects(collisionRects);  // Not optimizing entire array first to save some cycles.
        Tilemap.optimizeCollisionRects(collisionRects, Tilemap.OPTIMIZE_ALL);
        for (let rect of collisionRects) {
            let box = this.addChild(new PhysicsWorldObject({
                bounds: new RectBounds(rect.x, rect.y, rect.width, rect.height),
                copyFromParent: ['layer', 'physicsGroup'],
                immovable: true,
            }));
            box.debugDrawBounds = this.debugDrawBounds;
            this.collisionBoxes.push(box);
        }
    }

    protected createTilemap() {
        if (!this.collisionOnly) {
            this.drawRenderTexture();
        }
        this.createCollisionBoxes();
    }

    private drawRenderTexture() {
        this.clearZTextures();

        let zTileIndices = Tilemap.createZTileIndicies(this.currentTilemapLayer, this.zMap);
        
        let zTextures = this.createZTextures(zTileIndices);

        for (let y = 0; y < this.currentTilemapLayer.tiles.length; y++) {
            for (let x = 0; x < this.currentTilemapLayer.tiles[y].length; x++) {
                let zValue = Tilemap.getZValue(zTileIndices, y, x);
                if (!zTextures[zValue]) continue;
                this.drawTile(this.currentTilemapLayer.tiles[y][x], x - zTextures[zValue].tileBounds.left, y - zTextures[zValue].tileBounds.top, zTextures[zValue].frames);
            }
        }
    }

    private drawTile(tile: Tilemap.Tile, tileX: number, tileY: number, renderTextures: PIXI.RenderTexture[]) {
        if (tile.index < 0) return;

        let sprite = new PIXI.Sprite();

        for (let i = 0; i < renderTextures.length; i++) {
            let textureKeyIndex = this.animation ? i*this.animation.tilesPerFrame + tile.index : tile.index;
            let textureKey = this.tileset.tiles[textureKeyIndex];
            sprite.texture = AssetCache.getTexture(textureKey);
            sprite.anchor = sprite.texture.defaultAnchor;
            sprite.x = (tileX + 0.5) * this.tileset.tileWidth;
            sprite.y = (tileY + 0.5) * this.tileset.tileHeight;
            sprite.angle = tile.angle;
            sprite.scale.x = tile.flipX ? -1 : 1;
            sprite.scale.y = tile.flipY ? -1 : 1;
            renderToRenderTexture(sprite, renderTextures[i]);
        }
    }

    private getTilemapLayer(tilemapLayer: number | string) {
        if (M.isNumber(tilemapLayer)) {
            return tilemapLayer;
        }

        let layerIndex = this.tilemap.layers.findIndex(layer => layer.name === tilemapLayer);
        if (layerIndex >= 0) {
            return layerIndex;
        }

        console.error(`Could not find layer '${tilemapLayer}' in tilemap`, this);
        return 0;
    }

    private getCollisionRects(tilemapLayer: Tilemap.TilemapLayer) {
        let collisionIndices = A.clone(this.tileset.collisionIndices ?? []);
        if (this.emptyTiles === 'solid' && !collisionIndices.includes(-1)) {
            collisionIndices.push(-1);
        }
        if (this.emptyTiles === 'non_solid') {
            A.removeAll(collisionIndices, -1);
        }

        if (A.isEmpty(collisionIndices)) return [];

        let result: Rect[] = [];
        for (let y = 0; y < tilemapLayer.tiles.length; y++) {
            for (let x = 0; x < tilemapLayer.tiles[y].length; x++) {
                let tile = tilemapLayer.tiles[y][x];
                if (collisionIndices.includes(tile.index)) {
                    let rect = {
                        x: x*this.tileset.tileWidth,
                        y: y*this.tileset.tileHeight,
                        width: this.tileset.tileWidth,
                        height: this.tileset.tileHeight
                    };
                    result.push(rect);
                }
            }
        }
        return result;
    }

    private createZTextures(zTileIndices: number[][]) {
        let texturesByZ = Tilemap.createEmptyZTextures(zTileIndices, this.tileset, this.animation);

        for (let zValue in texturesByZ) {
            let zHeight = texturesByZ[zValue].zHeight * this.tileset.tileHeight;
            let zTexture = this.addChild(new Sprite());
            zTexture.x = this.x + texturesByZ[zValue].bounds.x;
            zTexture.y = this.y + texturesByZ[zValue].bounds.y + zHeight;
            zTexture.copyFromParent.push('layer');
            zTexture.offsetY = -zHeight;
            zTexture.setTexture(this.animation ? undefined : texturesByZ[zValue].frames[0]);
            if (this.animation) {
                zTexture.addAnimation('play', Animations.fromTextureList({ textures: texturesByZ[zValue].frames, frameRate: this.animation.frameRate, count: -1 }));
                zTexture.playAnimation('play');
            }

            this.zTextures.push(zTexture);
        }

        return texturesByZ;
    }

    private clearZTextures() {
        World.Actions.removeWorldObjectsFromWorld(this.zTextures);
        this.zTextures = [];
    }

    private scrubTilemapEntities(entities: Dict<any> | undefined) {
        if (O.isEmpty(entities)) return;
        for (let layer = 0; layer < this.tilemap.layers.length; layer++) {
            for (let y = 0; y < this.tilemap.layers[layer].tiles.length; y++) {
                for (let x = 0; x < this.tilemap.layers[layer].tiles[y].length; x++) {
                    let tile = this.tilemap.layers[layer].tiles[y][x];
                    if (tile && tile.index in entities!) {
                        tile.index = -1;
                    }
                }
            }
        }
    }
}
type TilemapClass = Tilemap;

namespace Tilemap {
    export function cloneTilemap(tilemap: Tilemap) {
        let result: Tilemap = {
            layers: [],
        };

        for (let i = 0; i < tilemap.layers.length; i++) {
            result.layers.push(O.deepClone(tilemap.layers[i]));
        }

        return result;
    }

    export function createZTileIndicies(layer: Tilemap.TilemapLayer, zMap: Tilemap.ZMap) {
        let zTileIndices = getInitialZTileIndicies(layer, zMap);
        fillZTileIndicies(zTileIndices);
        return zTileIndices;
    }

    export function createEmptyZTextures(zTileIndices: number[][], tileset: Tilemap.Tileset, animation: Tilemap.Animation | undefined): Tilemap.ZTextureMap {
        let zTextureSlots: Tilemap.ZTextureMap = {};
        for (let y = 0; y < zTileIndices.length; y++) {
            for (let x = 0; x < zTileIndices[y].length; x++) {
                if (isFinite(zTileIndices[y][x])) {
                    let zValue = getZValue(zTileIndices, y, x);
                    if (!zTextureSlots[zValue]) zTextureSlots[zValue] = {
                        frames: [],
                        bounds: { x: 0, y: 0, width: 0, height: 0 },
                        tileBounds: new Boundaries(Infinity, -Infinity, Infinity, -Infinity),
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
            let numFrames = animation ? animation.frames : 1;
            zTextureSlots[zValue].frames = A.range(numFrames).map(i => newPixiRenderTexture(zTextureSlots[zValue].bounds.width, zTextureSlots[zValue].bounds.height, 'Tilemap.createEmptyZTextures'));
        }

        return zTextureSlots;
    }

    export function getTilemapAsset(tilemap: string | Tilemap): Tilemap {
        if (St.isString(tilemap)) {
            return AssetCache.getTilemap(tilemap) ?? {
                layers: [],
            };
        }
        return tilemap;
    }

    export function getTilesetAsset(tileset: string): Tileset {
        return AssetCache.getTileset(tileset) ?? {
            tiles: [],
            tileWidth: 0,
            tileHeight: 0,
        };
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
        let zTileIndices = A.filledArray2D<number>(layer.tiles.length, layer.tiles[0].length, -Infinity);

        if (O.isEmpty(zMap)) {
            for (let x = 0; x < layer.tiles[0].length; x++) {
                zTileIndices[0][x] = 0;
            }
            return zTileIndices;
        }

        for (let y = 0; y < layer.tiles.length; y++) {
            for (let x = 0; x < layer.tiles[y].length; x++) {
                let tile = layer.tiles[y][x];
                zTileIndices[y][x] = tile.index === -1 ? -Infinity : lookupZMapValue(tile, zMap);
            }
        }
        return zTileIndices;
    }

    function fillZTileIndicies(zTileIndices: number[][]) {
        for (let y = 1; y < zTileIndices.length; y++) {
            for (let x = 0; x < zTileIndices[y].length; x++) {
                if (zTileIndices[y][x] === -Infinity && isFinite(zTileIndices[y-1][x])) {
                    zTileIndices[y][x] = zTileIndices[y-1][x] - 1;
                }
            }
        }

        for (let y = zTileIndices.length-2; y >= 0; y--) {
            for (let x = 0; x < zTileIndices[y].length; x++) {
                if (zTileIndices[y][x] === -Infinity && isFinite(zTileIndices[y+1][x])) {
                    zTileIndices[y][x] = zTileIndices[y+1][x] + 1;
                }
            }
        }

        for (let y = 0; y < zTileIndices.length; y++) {
            for (let x = 0; x < zTileIndices[y].length; x++) {
                if (zTileIndices[y][x] === -Infinity) {
                    zTileIndices[y][x] = 0;
                }
            }
        }
    }
}