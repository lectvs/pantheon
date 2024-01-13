namespace PyxelTilemapLoader {
    export type PyxelJsonSchema = {
        tilewidth: number;
        tileheight: number;
        tileswide: number;
        tileshigh: number;
        layers: {
            number: number;
            name: string;
            tiles: {
                x: number;
                y: number;
                index: number;
                tile: number;
                flipX: boolean;
                flipY: boolean;
                rot: number;
            }[];
        }[];
    }
}

class PyxelTilemapLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private tilemap: Preload.PyxelTilemap;
    private pixiLoader: PIXI.Loader;

    constructor(key: string, tilemap: Preload.PyxelTilemap) {
        this.key = key;
        this.tilemap = tilemap;
        this._completionPercent = 0;
        this.pixiLoader = new PIXI.Loader();
    }

    load(callback?: () => void) {
        let url = Preload.getAssetUrl(this.key, this.tilemap.url, 'json');
        this.pixiLoader.add(this.key, url);
        this.pixiLoader.load(() => {
            this.onLoad();
            this._completionPercent = 1;
            if (callback) callback();
        });
    }

    private onLoad() {
        let tilemapResource = this.pixiLoader.resources[this.key];
        if (!tilemapResource || !tilemapResource.data) {
            console.error(`Failed to load PyxelTilemap ${this.key}`);
            return;
        }

        let tilemapJson: PyxelTilemapLoader.PyxelJsonSchema = tilemapResource.data;

        let tilemapForCache: Tilemap.Tilemap = {
            layers: [],
        };
        for (let i = 0; i < tilemapJson.layers.length; i++) {
            let tiles: Tilemap.Tile[][] = A.sequence2D(tilemapJson.tileshigh, tilemapJson.tileswide, _ => ({
                index: -1,
                angle: 0,
                flipX: false,
                flipY: false,
            }));
            for (let tile of tilemapJson.layers[i].tiles) {
                tiles[tile.y][tile.x] = {
                    index: Math.max(tile.tile, -1),
                    angle: tile.rot * 90,
                    flipX: tile.flipX,
                    flipY: tile.flipY,
                };
            }
            tilemapForCache.layers.unshift({
                name: tilemapJson.layers[i].name,
                tiles: tiles,
            });
        }
        AssetCache.tilemaps[this.key] = tilemapForCache;
    }
}