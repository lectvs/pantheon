class PIXIRenderTextureSprite extends PIXI.Sprite {
    renderTexture: PIXI.RenderTexture;

    constructor(width: number, height: number) {
        let renderTexture = PIXI.RenderTexture.create({ width, height });
        super(renderTexture);
        
        this.renderTexture = renderTexture;
    }

    clear(renderer: PIXI.Renderer) {
        renderer.render(Utils.NOOP_DISPLAYOBJECT, this.renderTexture, true);
    }
    
    resize(width: number, height: number) {
        this.renderTexture.resize(width, height);
    }
}
