/// <reference path="./basicTexture.ts"/>

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
        texture.renderPIXIDisplayObject(this.graphics);
    }

    static eraseRect(texture: Texture, x: number, y: number, width: number, height: number) {
        let newTexture = texture.clone('Draw.eraseRect');

        let mask = new TextureFilters.Mask({
            type: 'local',
            mask: Texture.filledRect(width, height, 0xFFFFFF),
            offsetX: x, offsetY: y,
            invert: true,
        });

        texture.clear();
        newTexture.renderTo(texture, {
            x: 0, y: 0,
            filters: [mask],
        });
    }

    static annulusSolid(texture: Texture, x: number, y: number, innerRadius: number, outerRadius: number, brush: Draw.Brush = Draw.brush) {
        if (innerRadius <= 0) {
            this.circleSolid(texture, x, y, outerRadius, brush);
            return;
        }
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(brush.color, brush.alpha);
        this.graphics.drawCircle(x, y, outerRadius);
        this.graphics.endFill();
        this.graphics.beginHole();
        this.graphics.drawCircle(x, y, innerRadius);
        this.graphics.endHole();
        texture.renderPIXIDisplayObject(this.graphics);
    }

    static circleOutline(texture: Texture, x: number, y: number, radius: number, alignment: number = this.ALIGNMENT_INNER, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(brush.thickness, brush.color, brush.alpha, alignment);
        this.graphics.clear();
        this.graphics.beginFill(0, 0);
        this.graphics.drawCircle(x, y, radius);
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    }

    static circleSolid(texture: Texture, x: number, y: number, radius: number, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(brush.color, brush.alpha);
        this.graphics.drawCircle(x, y, radius);
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    }

    static ellipseOutline(texture: Texture, x: number, y: number, radiusX: number, radiusY: number, alignment: number = this.ALIGNMENT_INNER, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(brush.thickness, brush.color, brush.alpha, alignment);
        this.graphics.clear();
        this.graphics.beginFill(0, 0);
        this.graphics.drawEllipse(x, y, radiusX, radiusY);
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    }

    static ellipseSolid(texture: Texture, x: number, y: number, radiusX: number, radiusY: number, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(brush.color, brush.alpha);
        this.graphics.drawEllipse(x, y, radiusX, radiusY);
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    }

    static pixel(texture: Texture, x: number, y: number, brush: Draw.Brush = Draw.brush) {
        Draw.PIXEL_TEXTURE.renderTo(texture, {
            x: x, y: y,
            tint: brush.color,
            alpha: brush.alpha,
        });
    }

    static line(texture: Texture, x1: number, y1: number, x2: number, y2: number, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(brush.thickness, brush.color, brush.alpha, this.ALIGNMENT_MIDDLE);
        this.graphics.clear();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        texture.renderPIXIDisplayObject(this.graphics);
    }

    static polygonOutline(texture: Texture, points: Pt[], alignment: number = this.ALIGNMENT_INNER, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(brush.thickness, brush.color, brush.alpha, alignment);
        this.graphics.clear();
        this.graphics.beginFill(0, 0);
        this.graphics.drawPolygon(points.map(point => new PIXI.Point(point.x, point.y)));
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    }

    static polygonSolid(texture: Texture, points: Pt[], brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(brush.color, brush.alpha);
        this.graphics.drawPolygon(points.map(point => new PIXI.Point(point.x, point.y)));
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    }

    static rectangleOutline(texture: Texture, x: number, y: number, width: number, height: number, alignment: number = this.ALIGNMENT_INNER, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(brush.thickness, brush.color, brush.alpha, alignment);
        this.graphics.clear();
        this.graphics.beginFill(0, 0);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    }

    static rectangleSolid(texture: Texture, x: number, y: number, width: number, height: number, brush: Draw.Brush = Draw.brush) {
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(brush.color, brush.alpha);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();
        texture.renderPIXIDisplayObject(this.graphics);
    }

    static ALIGNMENT_INNER: number = 0;
    static ALIGNMENT_MIDDLE: number = 0.5;
    static ALIGNMENT_OUTER: number = 1;

    private static _PIXEL_TEXTURE: Texture;
    static get PIXEL_TEXTURE() {
        if (!this._PIXEL_TEXTURE) this._PIXEL_TEXTURE = Texture.filledRect(1, 1, 0xFFFFFF);
        return this._PIXEL_TEXTURE;
    }
}
