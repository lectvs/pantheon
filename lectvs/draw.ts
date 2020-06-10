namespace Draw {
    export type Brush = {
        color: number;
        alpha: number;
        thickness: number;
    }
}

class Draw {
    static brush: Draw.Brush = {
        color: 0x000000,
        alpha: 1,
        thickness: 1
    };

    private static graphics: PIXI.Graphics = new PIXI.Graphics();

    static fill(texture: Texture, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(brush.color, brush.alpha);
        this.graphics.drawRect(0, 0, texture.width, texture.height);
        this.graphics.endFill();
        texture.clear();
        texture.renderDisplayObject(this.graphics);
    }

    static eraseRect(texture: Texture, x: number, y: number, width: number, height: number) {
        let newTexture = texture.clone();
        newTexture.anchorX = 0;
        newTexture.anchorY = 0;

        let maskTexture = Texture.filledRect(width, height, 0xFFFFFF);
        let mask = new TextureFilter.Mask({
            type: TextureFilter.Mask.Type.LOCAL,
            mask: maskTexture,
            offsetX: x, offsetY: y,
            invert: true,
        });

        texture.clear();
        texture.render(newTexture, {
            x: 0, y: 0,
            filters: [mask],
        });
    }

    static pixel(texture: Texture, x: number, y: number, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(1, brush.color, brush.alpha, this.ALIGNMENT_INNER);
        this.graphics.clear();
        this.graphics.beginFill(0, 0);
        this.graphics.drawRect(x, y, 1, 1);
        this.graphics.endFill();
        texture.renderDisplayObject(this.graphics);
    }

    static rectangleOutline(texture: Texture, x: number, y: number, width: number, height: number, alignment: number = this.ALIGNMENT_INNER, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(brush.thickness, brush.color, brush.alpha, alignment);
        this.graphics.clear();
        this.graphics.beginFill(0, 0);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();
        texture.renderDisplayObject(this.graphics);
    }

    static rectangleSolid(texture: Texture, x: number, y: number, width: number, height: number, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(brush.color, brush.alpha);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();
        texture.renderDisplayObject(this.graphics);
    }

    static ALIGNMENT_INNER: number = 0;
    static ALIGNMENT_MIDDLE: number = 0.5;
    static ALIGNMENT_OUTER: number = 1;
}
`

Draw.pixel(texture, 34, 56, 0xFFF000, 0.5);

Draw.color = 0xFFF000;
Draw.alpha = 1;
Draw.pixel(texture, 34, 56);

`