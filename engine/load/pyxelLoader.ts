class PyxelLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private pyxelFile: Preload.PyxelFile;
    private pixiLoader: PIXI.Loader;

    private pyxelDocument: PyxelFile | undefined;

    constructor(key: string, pyxelFile: Preload.PyxelFile) {
        this.key = key;
        this.pyxelFile = pyxelFile;
        this._completionPercent = 0;
        this.pixiLoader = new PIXI.Loader();
    }

    getKey(): string {
        return this.key;
    }

    load(callback: () => void, onError: (message: string) => void) {
        let url = Preload.getAssetUrl(this.key, this.pyxelFile.url, 'pyxel');
        this.pixiLoader.add(this.key, url, { xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER });
        this.pixiLoader.onError.add(() => onError('Failed to load Pyxel file'));
        this.pixiLoader.load(() => {
            this._completionPercent = 0.5;
            this.onLoadPyxelFile(callback, onError);
        });
    }

    private onLoadPyxelFile(callback: () => void, onError: (message: string) => void) {
        let dataBuffer = this.pixiLoader.resources[this.key].data as ArrayBuffer;

        if (!dataBuffer) {
            onError('Failed to load pyxel file');
            return;
        }

        let zip = new JSZip();
        zip.loadAsync(dataBuffer)
            .then(_ => {
                let docDataFile = zip.file('docData.json');
                if (!docDataFile) {
                    onError('Missing docData.json');
                    return;
                }
                return docDataFile.async('text');
            })
            .then(text => {
                if (!text) {
                    onError('Empty docData.json');
                    return;
                }
                this.pyxelDocument = JSON.parse(text);
                if (!this.pyxelDocument) {
                    onError('Failed to parse docData.json');
                    return;
                }
                
                this.onLoadPyxelDocument(zip, callback, onError);
            })
            .catch(error => {
                console.error('Failed to load pyxel file:', this.key, error);
            });
    }

    private onLoadPyxelDocument(zip: JSZip, callback: () => void, onError: (message: string) => void) {
        if (!this.pyxelDocument) return;
        AssetCache.pyxelFiles[this.key] = this.pyxelDocument;

        let loaders: Loader[] = [];

        let layerIndex = 0;
        for (let i = this.pyxelDocument.canvas.numLayers-1; i >= 0; i--) {
            let layer = this.pyxelDocument.canvas.layers[i];
            if (layer.type !== 'tile_layer') continue;
            loaders.push(new PyxelLoader.TextureFromZip(this.getLayerKey(layerIndex), { anchor: this.pyxelFile.anchor }, zip, `layer${i}.png`));
            layerIndex++;
        }

        if (this.shouldLoadTileset()) {
            for (let i = 0; i < this.pyxelDocument.tileset.numTiles; i++) {
                loaders.push(new PyxelLoader.TextureFromZip(this.getTileKey(i), { anchor: this.pyxelFile.anchor }, zip, `tile${i}.png`));
            }
        }

        new LoaderSystem(loaders).load(
            progress => this._completionPercent = progress,
            () => this.onLoadTextures(callback, onError),
            onError,
        );
    }

    private onLoadTextures(callback: () => void, onError: (message: string) => void) {
        if (!this.pyxelDocument) return;

        // Render all layers as a texture.
        let sprite = new PIXI.Sprite();

        let fullTexture = newPixiRenderTexture(this.pyxelDocument.canvas.width, this.pyxelDocument.canvas.height, 'PyxelLoader.load');
        if (this.pyxelFile.anchor) {
            fullTexture.defaultAnchor.set(this.pyxelFile.anchor.x, this.pyxelFile.anchor.y);
        } else {
            fullTexture.defaultAnchor.set(0.5, 0.5);
        }

        let layerIndex = 0;
        for (let i = this.pyxelDocument.canvas.numLayers-1; i >= 0; i--) {
            let layer = this.pyxelDocument.canvas.layers[i];
            if (layer.type !== 'tile_layer') continue;
            if (layer.hidden) continue;

            let layerTexture = AssetCache.textures[this.getLayerKey(layerIndex)];
            if (!layerTexture) {
                onError(`Failed to load Pyxel layer texture: ${this.getLayerKey(layerIndex)}`);
                return;
            }

            sprite.texture = layerTexture;
            sprite.anchor.set(0, 0);
            sprite.x = 0;
            sprite.y = 0;
            sprite.alpha = this.getLayerAlpha(layer);
            sprite.blendMode = PyxelLoader.pyxelBlendModeToPixiBlendMode(layer.blendMode, onError);
            renderToRenderTexture(sprite, fullTexture);
            layerIndex++;
        }

        TextureUtils.setImmutable(fullTexture);
        AssetCache.textures[this.key] = fullTexture;

        // Load animation frames.
        if (!O.isEmpty(this.pyxelDocument.animations)) {
            TextureLoader.splitTextureInAssetCache(this.key, {
                anchor: this.pyxelFile.anchor,
                spritesheet: {
                    width: this.pyxelDocument.tileset.tileWidth,
                    height: this.pyxelDocument.tileset.tileHeight,
                },
            });
        }

        // Load the tileset.
        if (this.shouldLoadTileset()) {
            let tiles = A.sequence(this.pyxelDocument.tileset.numTiles, i => this.getTileKey(i));
            AssetCache.tilesets[this.getTilesetKey()] = {
                tileWidth: this.pyxelDocument.tileset.tileWidth,
                tileHeight: this.pyxelDocument.tileset.tileHeight,
                tiles: tiles,
                collisionIndices: [],
            };
        }

        // Load the tilemap.
        let tilemapLayers: Tilemap.TilemapLayer[] = [];
        for (let i = this.pyxelDocument.canvas.numLayers-1; i >= 0; i--) {
            let layer = this.pyxelDocument.canvas.layers[i];
            if (layer.type !== 'tile_layer') continue;
            if (O.isEmpty(layer.tileRefs)) continue;

            let tilesWide = this.pyxelDocument.canvas.width / this.pyxelDocument.tileset.tileWidth;
            let tilesHigh = this.pyxelDocument.canvas.height / this.pyxelDocument.tileset.tileHeight;

            let tiles: Tilemap.Tile[][] = A.sequence2D(tilesHigh, tilesWide, (i, j) => {
                let tileId = i + j * tilesWide;
                let tile = layer.tileRefs[tileId];
                if (tile) {
                    return {
                        index: tile.index,
                        angle: tile.rot * 90,
                        flipX: tile.flipX,
                        flipY: false,
                    };
                }

                return {
                    index: -1,
                    angle: 0,
                    flipX: false,
                    flipY: false,
                };
            });

            tilemapLayers.push({
                name: layer.name,
                tiles,
            });
        }

        if (tilemapLayers.length > 0) {
            AssetCache.tilemaps[this.getTilemapKey()] = {
                layers: tilemapLayers,
            };
        }

        this._completionPercent = 1;
        callback();
    }

    private getLayerKey(layer: number) {
        return `${this.key}/layer/${layer}`;
    }

    private getTilesetKey() {
        return `${this.key}`;
    }

    private getTileKey(tileIndex: number) {
        return `${this.getTilesetKey()}/tile/${tileIndex}`;
    }

    private getTilemapKey() {
        return `${this.key}`;
    }

    private getLayerAlpha(layer: PyxelFile.Layer) {
        let alpha = layer.alpha/255;
        if (layer.parentIndex >= 0 && this.pyxelDocument) {
            alpha *= this.getLayerAlpha(this.pyxelDocument.canvas.layers[layer.parentIndex]);
        }
        return alpha;
    }

    private shouldLoadTileset() {
        if (!this.pyxelDocument) return false;
        if (this.pyxelDocument.tileset.numTiles > 1) return true;
        return O.someValue(this.pyxelDocument.canvas.layers, layer => layer.type === 'tile_layer' && !O.isEmpty(layer.tileRefs));
    }
}

namespace PyxelLoader {
    export class TextureFromZip implements Loader {
        private _completionPercent: number;
        get completionPercent() { return this._completionPercent; }
    
        private key: string;
        private texture: Preload.Texture;
        private zip: JSZip;
        private fileName: string;

        constructor(key: string, texture: Preload.Texture, zip: JSZip, fileName: string) {
            this.key = key;
            this.texture = texture;
            this.zip = zip;
            this.fileName = fileName;
            this._completionPercent = 0;
        }

        getKey(): string {
            return this.key;
        }

        load(callback: () => void, onError: (message: string) => void) {
            this.loadImageDataAsDataUrl((dataUrl) => {
                this._completionPercent = 0.5;
                new TextureLoader(this.key, { ...this.texture, url: dataUrl }).load(() => {
                    this._completionPercent = 1;
                    callback();
                }, onError);
            }, onError);
        }

        private loadImageDataAsDataUrl(callback: (dataUrl: string) => void, onError: (message: string) => void) {
            let file = this.zip.file(this.fileName);
            if (!file) {
                onError(`Failed to load inner pyxel file: ${this.fileName}`);
                return;
            }
            file.async('base64')
                .then((b64) => {
                    callback(`data:image/png;base64,${b64}`);
                })
                .catch(() => {
                    onError(`Failed to extract inner pyxel file as base64: ${this.fileName}`);
                });
        }
    }

    export function pyxelBlendModeToPixiBlendMode(blendMode: string, onError: (message: string) => void): PIXI.BLEND_MODES {
        if (blendMode === 'normal') return PIXI.BLEND_MODES.NORMAL;
        if (blendMode === 'multiply') return PIXI.BLEND_MODES.MULTIPLY;
        if (blendMode === 'add') return PIXI.BLEND_MODES.ADD;
        if (blendMode === 'difference') return PIXI.BLEND_MODES.DIFFERENCE;
        if (blendMode === 'darken') return PIXI.BLEND_MODES.DARKEN;
        if (blendMode === 'lighten') return PIXI.BLEND_MODES.LIGHTEN;
        if (blendMode === 'hardlight') return PIXI.BLEND_MODES.HARD_LIGHT;
        if (blendMode === 'overlay') return PIXI.BLEND_MODES.OVERLAY;
        if (blendMode === 'screen') return PIXI.BLEND_MODES.SCREEN;
        if (blendMode === 'subtract') return PIXI.BLEND_MODES.SUBTRACT;
        if (blendMode === 'invert') {
            onError('Unsupported blend mode: invert');
            return PIXI.BLEND_MODES.NORMAL;
        };
        onError(`Invalid blend mode: ${blendMode}`);
        return PIXI.BLEND_MODES.NORMAL;
    }
}
