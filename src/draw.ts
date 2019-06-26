
class Draw {
    private static graphics: PIXI.Graphics = new PIXI.Graphics();
    private static _options: RenderOptions;
    private static _fillColor: number = 0x000000;
    private static _fillAlpha: number = 1;
    
    static lineStyle(width: number, color: number, alpha: number = 1, alignment: number = Draw.ALIGNMENT_INNER) {
        this.graphics.lineStyle(width, color, alpha, alignment);
        return this;
    }

    static noStroke() {
        return this.lineStyle(0, 0x000000, 0);
    }

    static fillColor(color: number, alpha: number = 1) {
        this._fillColor = color;
        this._fillAlpha = alpha;
        return this;
    }

    static noFill() {
        return this.fillColor(0x000000, 0);
    }

    static options(options: RenderOptions) {
        this._options = options;
        return this;
    }

    static drawRectangle(x: number, y: number, width: number, height: number) {
        this.graphics.clear();
        this.graphics.beginFill(this._fillColor, this._fillAlpha);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();

        this.render();

        return this;
    }

    private static render() {
        this._options.renderer.render(this.graphics, this._options.renderTexture, false, this._options.matrix);
    }

    static ALIGNMENT_INNER: number = 0;
    static ALIGNMENT_MIDDLE: number = 0.5;
    static ALIGNMENT_OUTER: number = 1;
}