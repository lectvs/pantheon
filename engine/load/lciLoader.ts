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

    load(callback?: () => void) {
        let url = Preload.getAssetUrl(this.key, this.lciFile.url, 'lci');
        this.pixiLoader.add(this.key, url);
        this.pixiLoader.load(() => this.onLoadLci(callback));
    }

    private onLoadLci(callback?: () => void) {
        this.lciDocument = Lci.parseDocument(this.pixiLoader.resources[this.key].data);
        if (!this.lciDocument) {
            console.error('Failed to parse LCI document:', this.key);
            return;
        }
        AssetCache.lciDocuments[this.key] = this.lciDocument;
        new LoaderSystem(this.lciDocument.layers
            .filter(layer => !layer.isDataLayer)
            .map(layer => new TextureLoader(Lci.getLayerTextureKey(this.key, layer.name), {
                ...this.lciFile,
                anchor: layer.properties.anchor ? vec2(layer.properties.anchor) : Anchor.TOP_LEFT,
                url: layer.image
            }))
        ).load(t => null, () => {
            this.onLoadTextures();
            this._completionPercent = 1;
            if (callback) callback();
        });
    }

    private onLoadTextures() {
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
                console.error(`Failed to load LCI layer texture: ${Lci.getLayerTextureKey(this.key, layer.name)}`);
                continue;
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
    }
}