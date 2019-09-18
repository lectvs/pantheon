class PIXIRenderTextureSprite extends PIXI.Sprite {
    _renderTexture: PIXI.RenderTexture;
    get renderTexture() { return this._renderTexture; }

    constructor(width: number, height: number) {
        let renderTexture = PIXI.RenderTexture.create({ width, height });
        super(renderTexture);
        
        this._renderTexture = renderTexture;
    }

    clear() {
        global.renderer.render(Utils.NOOP_DISPLAYOBJECT, this._renderTexture, true);
    }
    
    resize(width: number, height: number) {
        this._renderTexture.resize(width, height);
    }
}
