class LciLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private texture: Preload.Texture;
    private pixiLoader: PIXI.Loader;

    private lci: Lci.Document | undefined;

    constructor(key: string, texture: Preload.Texture) {
        this.key = key;
        this.texture = texture;
        this._completionPercent = 0;
        this.pixiLoader = new PIXI.Loader();
    }

    load(callback?: () => void) {
        let url = Preload.getAssetUrl(this.key, this.texture.url, 'lci');
        this.pixiLoader.add(this.key, url);
        this.pixiLoader.load(() => this.onLoadLci(callback));
    }

    private onLoadLci(callback?: () => void) {
        this.lci = Lci.parseDocument(this.pixiLoader.resources[this.key].data);
        if (!this.lci) return;
        AssetCache.lciDocuments[this.key] = this.lci;
        new LoaderSystem(this.lci.layers
            .filter(layer => !layer.isDataLayer)
            .map(layer => new TextureLoader(Lci.getLayerTextureKey(this.key, layer.name), {
                ...this.texture,
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
        if (!this.lci) return;
        let fullTexture = new AnchoredTexture(new BasicTexture(this.lci.width, this.lci.height, 'LciLoader.onLoadTextures'));
        if (this.texture.anchor) {
            fullTexture.anchorX = this.texture.anchor.x;
            fullTexture.anchorY = this.texture.anchor.y;
        }

        let sprite = new PIXI.Sprite();

        for (let layer of this.lci.layers) {
            if (layer.isDataLayer) continue;
            if (!layer.visible) continue;

            let layerTexture = AssetCache.pixiTextures[Lci.getLayerTextureKey(this.key, layer.name)];
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
            fullTexture.renderPIXIDisplayObject(sprite);
        }
        AssetCache.pixiTextures[this.key] = fullTexture.getPixiTexture();
        AssetCache.pixiTextures[this.key].defaultAnchor.set(fullTexture.getPixiTextureAnchorX(), fullTexture.getPixiTextureAnchorY());
    }
}