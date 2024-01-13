namespace LdtkWorldLoader {
    export type LdtkJsonSchema = {
        defs: {
            tilesets: {
                identifier: string;
                uid: number;
                relPath: string;
                tileGridSize: number;
                tags: string[];
                enumTags: {
                    enumValueId: string;
                    tileIds: number[];
                }[];
            }[];
        }
        levels: {
            identifier: string;
            layerInstances: {
                __identifier: string;
                __type: 'Tiles' | 'Entities' | 'IntGrid';
                __cWid: number;
                __cHei: number;
                __tilesetDefUid: number;
                gridTiles: {
                    px: [number, number];
                    f: number;
                    t: number;
                }[];
                autoLayerTiles: {
                    px: [number, number];
                    f: number;
                    t: number;
                }[];
                entityInstances: {
                    __identifier: string;
                    px: [number, number];
                }[];
            }[];
        }[];
    }
}

class LdtkWorldLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private tilemap: Preload.LdtkWorld;
    private pixiLoader: PIXI.Loader;

    private ldtk: LdtkWorldLoader.LdtkJsonSchema | undefined;

    constructor(key: string, tilemap: Preload.LdtkWorld) {
        this.key = key;
        this.tilemap = tilemap;
        this._completionPercent = 0;
        this.pixiLoader = new PIXI.Loader();
    }

    load(callback?: () => void) {
        let url = Preload.getAssetUrl(this.key, this.tilemap.url, 'ldtk');
        this.pixiLoader.add(this.key, url);
        this.pixiLoader.load(() => {
            this.onLoadLdtk(callback);
        });
    }

    private onLoadLdtk(callback?: () => void) {
        this.ldtk = JSON.parse(this.pixiLoader.resources[this.key].data);
        if (!this.ldtk) {
            console.error('Failed to parse Ldtk file:', this.key);
            return;
        }
        new LoaderSystem(this.ldtk.defs.tilesets
            .filter(tileset => tileset.identifier !== 'Internal_Icons')
            .map(tileset => new TilesetLoader(this.getTilesetKey(tileset.identifier), {
                url: `../${this.pixiLoader.resources[this.key].url}/../${tileset.relPath}`,
                tileWidth: tileset.tileGridSize,
                tileHeight: tileset.tileGridSize,
                collisionIndices: this.getTilesetCollisionIndices(tileset),
            }))
        ).load(t => null, () => {
            this.onLoadTilesets();
            this._completionPercent = 1;
            if (callback) callback();
        });
    }

    private onLoadTilesets() {
        if (!this.ldtk) return;

        let ldtkWorld: LdtkWorld.LdtkWorld = {
            levels: {},
        };

        for (let level of this.ldtk.levels) {
            let ldtkLevel: LdtkWorld.Level = {
                tilemap: {
                    layers: [],
                },
                entities: [],
            }

            for (let layerInstance of level.layerInstances) {
                if (layerInstance.__type === 'Tiles' || layerInstance.__type === 'IntGrid') {
                    let tileset = this.getTilesetByUid(layerInstance.__tilesetDefUid);
                    let tiles: Tilemap.Tile[][] = A.sequence2D(layerInstance.__cHei, layerInstance.__cWid, _ => ({
                        index: -1,
                        angle: 0,
                        flipX: false,
                        flipY: false,
                    }));
                    let gridTiles = layerInstance.__type === 'IntGrid' ? layerInstance.autoLayerTiles : layerInstance.gridTiles;
                    for (let gridTile of gridTiles) {
                        let tileX = gridTile.px[0] / tileset.tileWidth;
                        let tileY = gridTile.px[1] / tileset.tileHeight;
                        tiles[tileY][tileX] = {
                            index: Math.max(gridTile.t, -1),
                            angle: 0,
                            flipX: gridTile.f === 1 || gridTile.f === 3,
                            flipY: gridTile.f === 2 || gridTile.f === 3,
                        };
                    }
                    ldtkLevel.tilemap.layers.unshift({
                        name: layerInstance.__identifier,
                        tiles: tiles,
                    });
                } else if (layerInstance.__type === 'Entities') {
                    for (let entity of layerInstance.entityInstances) {
                        ldtkLevel.entities.push({
                            x: entity.px[0],
                            y: entity.px[1],
                            name: entity.__identifier,
                        });
                    }
                }
            }

            ldtkWorld.levels[level.identifier] = ldtkLevel;
            AssetCache.tilemaps[this.getTilemapLevelKey(level.identifier)] = ldtkLevel.tilemap;
        }

        AssetCache.ldtkWorlds[this.key] = ldtkWorld;
    }

    private getTilesetKey(identifier: string) {
        return `${this.key}/${identifier}`;
    }

    private getTilesetCollisionIndices(tileset: LdtkWorldLoader.LdtkJsonSchema['defs']['tilesets'][number]) {
        let collisionIndices: number[] = [];
        if (tileset.tags.includes(LdtkWorldLoader.TAG_EMPTY_SOLID)) {
            collisionIndices.push(-1);
        }
        for (let enumTag of tileset.enumTags) {
            if (enumTag.enumValueId === this.tilemap.solidEnumName) {
                collisionIndices.pushAll(enumTag.tileIds);
                break;
            }
        }
        return collisionIndices;
    }

    private getTilesetByUid(uid: number): Tilemap.Tileset {
        let ldtkTileset = this.ldtk?.defs.tilesets.find(tileset => tileset.uid === uid);
        let tileset = ldtkTileset ? AssetCache.getTileset(this.getTilesetKey(ldtkTileset.identifier)) : undefined;
        if (!tileset) {
            throw new Error(`Tileset in Ldtk file '${this.key}' with uid '${uid}' not found`);
        }
        return tileset;
    }

    private getTilemapLevelKey(identifier: string) {
        return `${this.key}/${identifier}`;
    }

    static TAG_EMPTY_SOLID = "empty_solid";
}
