namespace Texture {
    export type Properties = {
        x?: number;
        y?: number;
        scaleX?: number;
        scaleY?: number;
        angle?: number;
        tint?: number;
        alpha?: number;
    }
}

class Texture {
    renderTextureSprite: PIXIRenderTextureSprite;
    get width() { return this.renderTextureSprite.width; }
    get height() { return this.renderTextureSprite.height; }
    anchorX: number;
    anchorY: number;
    get pivotX() { return this.anchorX * this.width; }
    get pivotY() { return this.anchorY * this.height; }
    set pivotX(value: number) { this.anchorX = value / this.width;}
    set pivotY(value: number) { this.anchorY = value / this.height;}

    constructor(width: number, height: number) {
        this.renderTextureSprite = new PIXIRenderTextureSprite(width, height);
        this.anchorX = 0;
        this.anchorY = 0;
    }

    clear() {
        this.renderTextureSprite.clear();
    }

    render(texture: Texture, properties?: Texture.Properties) {
        texture.setRenderTextureSpriteProperties(properties);
        this.renderDisplayObject(texture.renderTextureSprite);
    }

    renderDisplayObject(displayObject: PIXI.DisplayObject) {
        Main.renderer.render(displayObject, this.renderTextureSprite.renderTexture, false);
    }

    private setRenderTextureSpriteProperties(properties: Texture.Properties) {
        if (!properties) properties = {};
        this.renderTextureSprite.x = O.getOrDefault(properties.x, 0);
        this.renderTextureSprite.y = O.getOrDefault(properties.y, 0);
        this.renderTextureSprite.scale.x = O.getOrDefault(properties.scaleX, 1);
        this.renderTextureSprite.scale.y = O.getOrDefault(properties.scaleY, 1);
        this.renderTextureSprite.angle = O.getOrDefault(properties.angle, 0);
        this.renderTextureSprite.tint = O.getOrDefault(properties.tint, 0xFFFFFF);
        this.renderTextureSprite.alpha = O.getOrDefault(properties.alpha, 1);

        this.renderTextureSprite.anchor.x = this.anchorX;
        this.renderTextureSprite.anchor.y = this.anchorY;
    }
}

namespace Texture {
    
}
