class LciLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private lciFile: Preload.LciFile;
    private pixiLoader: PIXI.Loader;

    private lciDocument: Lci.Document | undefined;

    constructor(key: string, lciFile: Preload.LciFile) {
        this.key = key;
        this.lciFile = lciFile;
        this._completionPercent = 0;
        this.pixiLoader = new PIXI.Loader();
    }

    getKey(): string {
        return this.key;
    }

    load(callback: () => void, onError: (message: string) => void) {
        let url = Preload.getAssetUrl(this.key, this.lciFile.url, 'lci');
        if (url.endsWith('.aseprite') || url.endsWith('.ase')) {
            this.loadDotAseprite(callback, onError);
        } else {
            this.loadDotLci(callback, onError);
        }
    }

    private loadDotLci(callback: () => void, onError: (message: string) => void) {
        let url = Preload.getAssetUrl(this.key, this.lciFile.url, 'lci');
        this.pixiLoader.add(this.key, url);
        this.pixiLoader.onError.add(() => onError('Failed to load LCI document'));
        this.pixiLoader.load(() => this.onLoadLci(callback, onError));
    }

    private onLoadLci(callback: () => void, onError: (message: string) => void) {
        this.lciDocument = Lci.parseDocument(this.pixiLoader.resources[this.key].data);
        if (!this.lciDocument) {
            onError('Failed to parse LCI document');
            return;
        }
        AssetCache.lciDocuments[this.key] = this.lciDocument;
        new LoaderSystem(this.lciDocument.layers
            .filter(layer => !layer.isDataLayer)
            .map(layer => new TextureLoader(Lci.getLayerTextureKey(this.key, layer.name), {
                ...this.lciFile,
                anchor: layer.properties.anchor ? vec2(layer.properties.anchor) : Anchor.TOP_LEFT,
                url: layer.image,
            }))
        ).load(t => null, () => {
            this.onLoadTextures(callback, onError);
        }, onError);
    }

    private onLoadTextures(callback: () => void, onError: (message: string) => void) {
        if (!this.lciDocument) return;

        let fullTexture = newPixiRenderTexture(this.lciDocument.width, this.lciDocument.height, 'LciLoader.load');
        if (this.lciFile.anchor) {
            fullTexture.defaultAnchor.set(this.lciFile.anchor.x, this.lciFile.anchor.y);
        }

        let sprite = new PIXI.Sprite();

        for (let layer of this.lciDocument.layers) {
            if (layer.isDataLayer) continue;
            if (!layer.visible) continue;

            let layerTexture = AssetCache.textures[Lci.getLayerTextureKey(this.key, layer.name)];
            if (!layerTexture) {
                onError(`Failed to load LCI layer texture: ${Lci.getLayerTextureKey(this.key, layer.name)}`);
                return;
            }
            sprite.texture = layerTexture;
            sprite.anchor = layerTexture.defaultAnchor;
            sprite.x = layer.position.x + (layer.properties.offset?.x ?? 0);
            sprite.y = layer.position.y + (layer.properties.offset?.y ?? 0);
            sprite.alpha = layer.opacity / 255;
            sprite.blendMode = layer.blendMode ?? 0;
            renderToRenderTexture(sprite, fullTexture);
        }

        TextureUtils.setImmutable(fullTexture);
        AssetCache.textures[this.key] = fullTexture;

        this._completionPercent = 1;
        callback();
    }

    private loadDotAseprite(callback: () => void, onError: (message: string) => void) {
        new AsepriteLoader(this.key, {
            url: this.lciFile.url,
            anchor: this.lciFile.anchor,
            renderSeparateLayers: true,
            renderInvisibleLayers: true,
        }).load(() => this.onLoadAseprite(callback, onError), onError);
    }

    private onLoadAseprite(callback: () => void, onError: (message: string) => void) {
        let textureRestrictBounds = this.transformAsepriteTextures();
        this.lciDocument = Lci._fromAsepriteFile(this.key, textureRestrictBounds);
        if (!this.lciDocument) {
            onError('Failed to create LCI document from Aseprite file');
            return;
        }
        AssetCache.lciDocuments[this.key] = this.lciDocument;
        this._completionPercent = 1;
        callback();
    }

    private transformAsepriteTextures() {
        let asepriteFile = AssetCache.getAsepriteFile(this.key)!;
        let initialLciDocument = Lci._fromAsepriteFile(this.key, {}, false);

        if (asepriteFile.frames.length !== 1) {
            throw Error(`Cannot load LCI document from Aseprite file: invalid number of frames (${asepriteFile.frames.length})`);
        }

        // Move layer textures to expected LCI paths.
        for (let i = 0; i < asepriteFile.layers.length; i++) {
            let data = asepriteFile.layers[i].name;
            let layerName = Lci.extractLayerName(data);
            let layerTextureKey = Lci.getLayerTextureKey(this.key, layerName);
            let initialLayer = initialLciDocument.layers.find(layer => layer.name === layerName);
            if (!initialLayer) {
                throw Error('Error loading LCI document from Aseprite file');
            }
            if (!initialLayer.isDataLayer) {
                AssetCache.textures[layerTextureKey] = AssetCache.getTexture(`${this.key}/layer/${data}`);
            }
            delete AssetCache.textures[`${this.key}/layer/${data}`];
            delete AssetCache.textures[`${this.key}/layer/${i}`];
            delete AssetCache.textures[`${this.key}/0/layer/${data}`];
            delete AssetCache.textures[`${this.key}/0/layer/${i}`];
        }

        delete AssetCache.textures[`${this.key}/0`];

        let textureRestrictBounds: Dict<Rectangle | undefined> = {};

        // Crop restricted layers.
        for (let i = 0; i < asepriteFile.layers.length; i++) {
            let data = asepriteFile.layers[i].name;
            let layerName = Lci.extractLayerName(data);
            let layerTextureKey = Lci.getLayerTextureKey(this.key, layerName);
            let initialLayer = initialLciDocument.layers.find(layer => layer.name === layerName)!;
            if (initialLayer.isDataLayer) continue;
            AssetCache.getTexture(layerTextureKey).defaultAnchor.set(initialLayer.properties.anchor.x, initialLayer.properties.anchor.y);
            if (initialLayer.properties.restrict) {
                let restrictedBounds = Lci.getRestrictedBounds(layerTextureKey);
                let originalLayerTexture = AssetCache.getTexture(layerTextureKey);
                AssetCache.textures[layerTextureKey] = TextureUtils.crop(AssetCache.textures[layerTextureKey], restrictedBounds, 'LciLoader.transformAsepriteTextures');
                TextureUtils.setImmutable(AssetCache.textures[layerTextureKey] as PIXI.RenderTexture);
                freePixiRenderTexture(originalLayerTexture as PIXI.RenderTexture);
                textureRestrictBounds[layerTextureKey] = restrictedBounds;
            }
        }

        return textureRestrictBounds;
    }
}