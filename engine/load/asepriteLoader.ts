/**
 * File spec: https://github.com/aseprite/aseprite/blob/main/docs/ase-file-specs.md
 * Example: https://github.com/kennedy0/aseprite-reader/blob/main/src/aseprite_reader/aseprite_file.py
 */
class AsepriteLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private asepriteFile: Preload.AsepriteFile;
    private pixiLoader: PIXI.Loader;

    private asepriteDocument: AsepriteFile | undefined;

    constructor(key: string, asepriteFile: Preload.AsepriteFile) {
        this.key = key;
        this.asepriteFile = asepriteFile;
        this._completionPercent = 0;
        this.pixiLoader = new PIXI.Loader();
    }

    getKey(): string {
        return this.key;
    }

    load(callback: () => void, onError: (message: string) => void) {
        let url = Preload.getAssetUrl(this.key, this.asepriteFile.url, 'aseprite');
        this.pixiLoader.add(this.key, url, { xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER });
        this.pixiLoader.onError.add(() => onError('Failed to load Aseprite file'));
        this.pixiLoader.load(() => {
            this._completionPercent = 0.5;
            this.onLoadAsepriteFile(callback, onError);
        });
    }

    private onLoadAsepriteFile(callback: () => void, onError: (message: string) => void) {
        let dataBuffer = this.pixiLoader.resources[this.key].data as ArrayBuffer;

        if (!dataBuffer) {
            onError('Failed to load Aseprite file');
            return;
        }

        let bytesReader = new BytesReader(dataBuffer);
        let rawFile = AsepriteFileRaw.readAsepriteFileRaw(bytesReader);
        this.asepriteDocument = AsepriteFile.fromRaw(rawFile);

        let loaders: Loader[] = [];

        // Load each frame with all layers as a texture.
        for (let i = 0; i < this.asepriteDocument.frames.length; i++) {
            let frame = this.asepriteDocument.frames[i];
            for (let cel of frame.cels) {
                if (cel.celData.type === 'linked') {
                    console.log('Linked cels not supported in Aseprite files. Ignoring.', this.asepriteDocument);
                }
                if (cel.celData.type !== 'image') continue;
                if (cel.zIndex !== 0) {
                    console.log('Z-index not supported for Aseprite cels. Ignoring.', this.asepriteDocument);
                }
                loaders.push(new AsepriteLoader.TextureFromImageDataLoader(this.getCelKey(i, cel), { anchor: Anchor.TOP_LEFT },
                    cel.celData.imageData, cel.celData.width, cel.celData.height));
            }
        }

        // Load textures for each tileset.
        for (let tileset of this.asepriteDocument.tilesets) {
            for (let i = 0; i < tileset.tiles.length; i++) {
                loaders.push(new AsepriteLoader.TextureFromImageDataLoader(this.getTileKey(tileset, i), { anchor: Anchor.CENTER },
                    tileset.tiles[i].imageData, tileset.tileWidth, tileset.tileHeight));
            }
        }

        new LoaderSystem(loaders).load(
            progress => this._completionPercent = progress,
            () => this.onLoadTextures(callback, onError),
            onError,
        );
    }

    private onLoadTextures(callback: () => void, onError: (message: string) => void) {
        if (!this.asepriteDocument) return;

        AssetCache.asepriteFiles[this.key] = this.asepriteDocument;

        // Load each frame with all layers as a texture.
        let sprite = new PIXI.Sprite();
        for (let i = 0; i < this.asepriteDocument.frames.length; i++) {
            let frame = this.asepriteDocument.frames[i];

            let frameTexture = newPixiRenderTexture(this.asepriteDocument.width, this.asepriteDocument.height, 'AsepriteLoader.load');
            if (this.asepriteFile.anchor) {
                frameTexture.defaultAnchor.set(this.asepriteFile.anchor.x, this.asepriteFile.anchor.y);
            } else {
                frameTexture.defaultAnchor.set(0.5, 0.5);
            }

            let renderedCel = false;
            for (let cel of frame.cels) {
                let layer = this.asepriteDocument.layers[cel.layerIndex];
                if (!layer.visible) continue;
                if (cel.celData.type === 'image') {
                    let celTexture = AssetCache.textures[this.getCelKey(i, cel)];
                    if (!celTexture) {
                        onError(`Failed to load Aseprite cel texture: ${this.getCelKey(i, cel)}`);
                        return;
                    }

                    sprite.texture = celTexture;
                    sprite.anchor.set(celTexture.defaultAnchor.x, celTexture.defaultAnchor.y);
                    sprite.x = cel.xPosition;
                    sprite.y = cel.yPosition;
                    sprite.alpha = layer.opacity;
                    sprite.blendMode = layer.blendMode ?? 0;
                    renderToRenderTexture(sprite, frameTexture);

                    celTexture.destroy();
                    delete AssetCache.textures[this.getCelKey(i, cel)];
                    renderedCel = true;
                    continue;
                }
                if (cel.celData.type === 'tilemap') {
                    if (layer.type !== 'tilemap') {
                        console.error("Tilemap cel found on non-tilemap layer. This shouldn't ever happen.", cel, layer, this.asepriteDocument);
                        continue;
                    }
                    let tileset = this.asepriteDocument.tilesets[layer.tilesetIndex];
                    for (let i = 0; i < cel.celData.tiles.length; i++) {
                        let tile = cel.celData.tiles[i];
                        let tileX = i % cel.celData.widthTiles;
                        let tileY = Math.floor(i / cel.celData.widthTiles);
                        let tileTexture = AssetCache.textures[this.getTileKey(tileset, tile.id)];
                        if (!tileTexture) {
                            onError(`Failed to load Aseprite tile texture: ${this.getTileKey(tileset, tile.id)}`);
                            return;
                        }

                        sprite.texture = tileTexture;
                        sprite.anchor.set(0, 0);
                        sprite.x = tileX * tileset.tileWidth;
                        sprite.y = tileY * tileset.tileHeight;
                        sprite.alpha = layer.opacity;
                        sprite.blendMode = layer.blendMode ?? 0;
                        renderToRenderTexture(sprite, frameTexture);
                    }
                    renderedCel = true;
                    continue;
                }
            }

            if (!renderedCel) {
                debug('Warning: did not render any image or tilemap cels for Aseprite texture:', this.key);
            }

            TextureUtils.setImmutable(frameTexture);
            AssetCache.textures[this.getFrameKey(i)] = frameTexture;
        }

        // For single-frame images, load to the root key as well.
        if (this.asepriteDocument.frames.length === 1) {
            AssetCache.textures[this.key] = AssetCache.textures[this.getFrameKey(0)];
        }

        // Load each tileset.
        for (let tileset of this.asepriteDocument.tilesets) {
            let tiles = tileset.tiles.map((_, i) => this.getTileKey(tileset, i));
            AssetCache.tilesets[this.getTilesetKey(tileset)] = {
                tileWidth: tileset.tileWidth,
                tileHeight: tileset.tileHeight,
                tiles: tiles,
                collisionIndices: this.getCollisionIndices(tileset),
            };
        }

        // Load each tilemap.
        let firstFrame = this.asepriteDocument.frames[0];
        let tilemapLayers: Tilemap.TilemapLayer[] = [];
        for (let cel of firstFrame.cels) {
            if (cel.celData.type !== 'tilemap') continue;
            let layer = this.asepriteDocument.layers[cel.layerIndex];
            tilemapLayers.push({
                name: layer.name,
                tiles: A.map2D(A.batch(cel.celData.tiles, cel.celData.widthTiles), tile => this.asepriteTileToTilemapTile(tile)),
            });
        }

        if (tilemapLayers.length > 0) {
            if (this.asepriteDocument.frames.length > 1) {
                console.error('Multiple frames not supported for Aseprite tilemaps. Using just the first frame.', this.asepriteDocument)
            }
            AssetCache.tilemaps[this.getTilemapKey()] = {
                layers: tilemapLayers,
            };
        }

        this.asepriteFile.after?.();

        this._completionPercent = 1;
        callback();
    }

    private getTilesetKey(tileset: AsepriteFile.Tileset) {
        return `${this.key}/tileset/${tileset.id}`;
    }

    private getTileKey(tileset: AsepriteFile.Tileset, tileIndex: number) {
        return `${this.getTilesetKey(tileset)}/${tileIndex}`;
    }

    private getTilemapKey() {
        return `${this.key}`;
    }

    private getFrameKey(frame: number) {
        return `${this.key}/${frame}`;
    }

    private getCelKey(frame: number, cel: AsepriteFile.Cel) {
        return `${this.getFrameKey(frame)}/cel/${cel.layerIndex}`;
    }

    private getCollisionIndices(tileset: AsepriteFile.Tileset) {
        let collisionIndices = this.asepriteFile.collisionIndices;
        if (!collisionIndices) return [];
        if (A.isArray(collisionIndices)) return A.clone(collisionIndices);
        if (!(tileset.id in collisionIndices)) return [];
        return A.clone(collisionIndices[tileset.id]);
    }

    private asepriteTileToTilemapTile(tile: AsepriteFile.CelTile): Tilemap.Tile {
        let flipX = tile.flipX;
        let flipY = tile.flipY;
        let angle = 0;

        // Translate diagonal flip into angles.
        if (tile.flipDiagonal) {
            if (!flipX && !flipY) {
                flipX = false;
                flipY = true;
                angle = 90;
            } else if (flipX && !flipY) {
                flipX = false;
                flipY = false;
                angle = 90;
            } else if (!flipX && flipY) {
                flipX = false;
                flipY = false;
                angle = -90;
            } else {
                flipX = true;
                flipY = false;
                angle = 90;
            }
        }

        return {
            index: tile.id,
            flipX,
            flipY,
            angle,
        };
    }
}

namespace AsepriteLoader {
    export class TextureFromImageDataLoader implements Loader {
        private _completionPercent: number;
        get completionPercent() { return this._completionPercent; }
    
        private key: string;
        private texture: Preload.Texture;
        private imageData: Uint8Array;
        private width: number;
        private height: number;

        constructor(key: string, texture: Preload.Texture, imageData: Uint8Array, width: number, height: number) {
            this.key = key;
            this.texture = texture;
            this.imageData = imageData;
            this.width = width;
            this.height = height;
            this._completionPercent = 0;
        }

        getKey(): string {
            return this.key;
        }

        load(callback: () => void, onError: (message: string) => void) {
            this.loadImageDataAsDataUrl(this.imageData, this.width, this.height, (dataUrl) => {
                this._completionPercent = 0.5;
                new TextureLoader(this.key, { ...this.texture, url: dataUrl }).load(() => {
                    this._completionPercent = 1;
                    callback();
                }, onError);
            });
        }

        private loadImageDataAsDataUrl(imageData: Uint8Array, width: number, height: number, callback: (dataUrl: string) => void) {
            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            let context = canvas.getContext('2d', { colorSpace: 'srgb' });
            if (!context) {
                throw new Error('Failed to load image: failed to get 2d context from canvas');
            }
            let canvasImageData = new ImageData(width, height);
            canvasImageData.data.set(imageData);
            context.putImageData(canvasImageData, 0, 0);
            return canvas.toBlob((blob) => {
                let fr = new FileReader();
                fr.onloadend = () => {
                    if (St.isString(fr.result)) {
                        callback(fr.result);
                    } else {
                        throw new Error('Failed to load image: failed to read blob dataUrl as string');
                    }
                };
                fr.readAsDataURL(blob!);
            });
        }
    }
}
