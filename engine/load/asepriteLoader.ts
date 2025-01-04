class AsepriteLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private texture: Preload.Texture;
    private pixiLoader: PIXI.Loader;

    constructor(key: string, textFile: Preload.Texture) {
        this.key = key;
        this.texture = textFile;
        this._completionPercent = 0;
        this.pixiLoader = new PIXI.Loader();
    }

    load(callback?: () => void) {
        let url = Preload.getAssetUrl(this.key, this.texture.url, 'aseprite');
        this.pixiLoader.add(this.key, url, { xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER });
        this.pixiLoader.load(() => {
            this.onLoadAsepriteFile(callback);
            this._completionPercent = 0.5;
            if (callback) callback();
        });
    }

    private onLoadAsepriteFile(callback?: () => void) {
        let dataBuffer = this.pixiLoader.resources[this.key].data as ArrayBuffer;

        if (!dataBuffer) {
            console.error('Failed to load aseprite file:', this.key);
            return;
        }

        let bytesReader = new BytesReader(dataBuffer);

        console.log('bytesReader:', bytesReader);

        let rawFile = AsepriteFileRaw.readAsepriteFileRaw(bytesReader);

        console.log('raw file:', rawFile);

        let parsedFile = AsepriteFile.fromRaw(rawFile);

        console.log('parsed file:', parsedFile);

        let loaders: Loader[] = [];

        // Load each frame with all layers as a texture.
        for (let i = 0; i < parsedFile.frames.length; i++) {
            let frame = parsedFile.frames[i];
            for (let cel of frame.cels) {
                if (cel.celData.type === 'linked') {
                    console.log('Linked cels not supportedin Aseprite files. Ignoring.', parsedFile);
                }
                if (cel.celData.type !== 'image') continue;
                if (cel.zIndex !== 0) {
                    console.log('Z-index not supported for Aseprite cels. Ignoring.', parsedFile);
                }
                loaders.push(new AsepriteLoader.TextureFromImageDataLoader(this.getCelKey(i, cel), { anchor: Anchor.TOP_LEFT },
                    cel.celData.imageData, cel.celData.width, cel.celData.height));
            }
        }

        // Load textures for each tileset.
        for (let tileset of parsedFile.tilesets) {
            for (let i = 0; i < tileset.tiles.length; i++) {
                loaders.push(new AsepriteLoader.TextureFromImageDataLoader(this.getTileKey(tileset, i), { anchor: Anchor.CENTER },
                    tileset.tiles[i].imageData, tileset.tileWidth, tileset.tileHeight));
            }
        }

        new LoaderSystem(loaders).load(
            progress => this._completionPercent = progress,
            () => this.onLoadTextures(parsedFile, callback),
        );
    }

    private onLoadTextures(parsedFile: AsepriteFile, callback?: () => void) {
        // Load each frame with all layers as a texture.
        let sprite = new PIXI.Sprite();
        for (let i = 0; i < parsedFile.frames.length; i++) {
            let frame = parsedFile.frames[i];

            let frameTexture = newPixiRenderTexture(parsedFile.width, parsedFile.height, 'AsepriteLoader.load');
            if (this.texture.anchor) {
                frameTexture.defaultAnchor.set(this.texture.anchor.x, this.texture.anchor.y);
            } else {
                frameTexture.defaultAnchor.set(0.5, 0.5);
            }

            for (let cel of frame.cels) {
                if (cel.celData.type !== 'image') continue;
                let layer = parsedFile.layers[cel.layerIndex];
                if (!layer.visible) continue;

                let celTexture = AssetCache.textures[this.getCelKey(i, cel)];
                if (!celTexture) {
                    console.error(`Failed to load Aseprite cel texture: ${this.getCelKey(i, cel)}`);
                    continue;
                }

                sprite.texture = celTexture;
                sprite.anchor = celTexture.defaultAnchor;
                sprite.x = cel.xPosition;
                sprite.y = cel.yPosition;
                sprite.alpha = layer.opacity;
                sprite.blendMode = layer.blendMode ?? 0;
                renderToRenderTexture(sprite, frameTexture);

                celTexture.destroy();
                delete AssetCache.textures[this.getCelKey(i, cel)];
            }

            TextureUtils.setImmutable(frameTexture);
            AssetCache.textures[this.getFrameKey(i)] = frameTexture;
        }

        // Load each tileset.
        for (let tileset of parsedFile.tilesets) {
            let tiles = tileset.tiles.map((_, i) => this.getTileKey(tileset, i));
            AssetCache.tilesets[this.getTilesetKey(tileset)] = {
                tileWidth: tileset.tileWidth,
                tileHeight: tileset.tileHeight,
                tiles: tiles,
                collisionIndices: [],
            };
        }

        // Load each tilemap.
        let firstFrame = parsedFile.frames[0];
        let tilemapLayers: Tilemap.TilemapLayer[] = [];
        for (let cel of firstFrame.cels) {
            if (cel.celData.type !== 'tilemap') continue;
            let layer = parsedFile.layers[cel.layerIndex];
            tilemapLayers.push({
                name: layer.name,
                tiles: A.map2D(A.batch(cel.celData.tiles, cel.celData.widthTiles), tile => this.asepriteTileToTilemapTile(tile)),
            });
        }

        if (tilemapLayers.length > 0) {
            if (parsedFile.frames.length > 1) {
                console.error('Multiple frames not supported for Aseprite tilemaps. Using just the first frame.', parsedFile)
            }
            AssetCache.tilemaps[this.getTilemapKey()] = {
                layers: tilemapLayers,
            };
        }

        this._completionPercent = 1;
        if (callback) callback();
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

        load(callback?: () => void) {
            this.loadImageDataAsDataUrl(this.imageData, this.width, this.height, (dataUrl) => {
                this._completionPercent = 0.5;
                new TextureLoader(this.key, { ...this.texture, url: dataUrl }).load(() => {
                    this._completionPercent = 1;
                    if (callback) callback();
                });
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
