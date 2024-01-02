/// <reference path="../utils/lazy.ts" />

namespace Draw {
    export type Alignment = 'inner' | 'outer';

    export type FillAndOutlineConfig = {
        fill?: {
            color: number;
            alpha?: number;
        };
        outline?: {
            color: number;
            alpha?: number;
            thickness?: number;
            alignment?: Draw.Alignment;
        };
    }
}

class Draw {
    private static graphics: PIXI.Graphics = new PIXI.Graphics();

    static fill(texture: PIXI.RenderTexture, config: { color: number, alpha?: number }) {
        this.graphics.lineStyle(0, 0, 0);
        this.graphics.clear();
        this.graphics.beginFill(config.color, config.alpha ?? 1);
        this.graphics.drawRect(0, 0, texture.width, texture.height);
        this.graphics.endFill();
        renderToRenderTexture(this.graphics, texture, 'clearTextureFirst');
    }

    static annulus(texture: PIXI.RenderTexture, x: number, y: number, innerRadius: number, outerRadius: number, config: Draw.FillAndOutlineConfig) {
        if (innerRadius <= 0) {
            this.circle(texture, x, y, outerRadius, config);
            return;
        }
        let values = Draw.getFillAndOutlineConfigValues(config);
        if (values.fillAlpha === 0 && values.outlineAlpha === 0) return;
        this.graphics.lineStyle(values.outlineThickness, values.outlineColor, values.outlineAlpha, Draw.getAlignmentNumber(values.outlineAlignment));
        this.graphics.clear();
        this.graphics.beginFill(values.fillColor, values.fillAlpha);
        this.graphics.drawCircle(x, y, outerRadius);
        this.graphics.endFill();
        this.graphics.beginHole();
        this.graphics.drawCircle(x, y, innerRadius);
        this.graphics.endHole();
        renderToRenderTexture(this.graphics, texture);
    }

    static circle(texture: PIXI.RenderTexture, x: number, y: number, radius: number, config: Draw.FillAndOutlineConfig) {
        let values = Draw.getFillAndOutlineConfigValues(config);
        if (values.fillAlpha === 0 && values.outlineAlpha === 0) return;
        this.graphics.lineStyle(values.outlineThickness, values.outlineColor, values.outlineAlpha, Draw.getAlignmentNumber(values.outlineAlignment));
        this.graphics.clear();
        this.graphics.beginFill(values.fillColor, values.fillAlpha);
        this.graphics.drawCircle(x, y, radius);
        this.graphics.endFill();
        renderToRenderTexture(this.graphics, texture);
    }

    static ellipse(texture: PIXI.RenderTexture, x: number, y: number, radiusX: number, radiusY: number, config: Draw.FillAndOutlineConfig) {
        let values = Draw.getFillAndOutlineConfigValues(config);
        if (values.fillAlpha === 0 && values.outlineAlpha === 0) return;
        this.graphics.lineStyle(values.outlineThickness, values.outlineColor, values.outlineAlpha, Draw.getAlignmentNumber(values.outlineAlignment));
        this.graphics.clear();
        this.graphics.beginFill(values.fillColor, values.fillAlpha);
        this.graphics.drawEllipse(x, y, radiusX, radiusY);
        this.graphics.endFill();
        renderToRenderTexture(this.graphics, texture);
    }

    static pixel(texture: PIXI.RenderTexture, x: number, y: number, config: { color: number, alpha?: number }) {
        if (config.alpha === 0) return;
        let pixelSprite = Draw.PIXEL_SPRITE.get();
        pixelSprite.x = x;
        pixelSprite.y = y;
        pixelSprite.tint = config.color;
        pixelSprite.alpha = config.alpha ?? 1;
        renderToRenderTexture(pixelSprite, texture);
    }

    static line(texture: PIXI.RenderTexture, x1: number, y1: number, x2: number, y2: number, config: { color: number, alpha?: number, thickness?: number }) {
        if (config.alpha === 0) return;
        this.graphics.lineStyle(config.thickness ?? 1, config.color, config.alpha ?? 1, 0.5);
        this.graphics.clear();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        renderToRenderTexture(this.graphics, texture);
    }

    static polygon(texture: PIXI.RenderTexture, points: Pt[], config: Draw.FillAndOutlineConfig) {
        let values = Draw.getFillAndOutlineConfigValues(config);
        if (values.fillAlpha === 0 && values.outlineAlpha === 0) return;
        this.graphics.lineStyle(values.outlineThickness, values.outlineColor, values.outlineAlpha, Draw.getAlignmentNumber(values.outlineAlignment));
        this.graphics.clear();
        this.graphics.beginFill(values.fillColor, values.fillAlpha);
        this.graphics.drawPolygon(points.map(point => new PIXI.Point(point.x, point.y)));
        this.graphics.endFill();
        renderToRenderTexture(this.graphics, texture);
    }

    static rectangle(texture: PIXI.RenderTexture, x: number, y: number, width: number, height: number, config: Draw.FillAndOutlineConfig) {
        let values = Draw.getFillAndOutlineConfigValues(config);
        if (values.fillAlpha === 0 && values.outlineAlpha === 0) return;
        this.graphics.lineStyle(values.outlineThickness, values.outlineColor, values.outlineAlpha, Draw.getAlignmentNumber(values.outlineAlignment));
        this.graphics.clear();
        this.graphics.beginFill(values.fillColor, values.fillAlpha);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();
        renderToRenderTexture(this.graphics, texture);
    }

    static roundedRectangle(texture: PIXI.RenderTexture, x: number, y: number, width: number, height: number, radius: number, config: Draw.FillAndOutlineConfig) {
        let values = Draw.getFillAndOutlineConfigValues(config);
        if (values.fillAlpha === 0 && values.outlineAlpha === 0) return;
        this.graphics.lineStyle(values.outlineThickness, values.outlineColor, values.outlineAlpha, Draw.getAlignmentNumber(values.outlineAlignment));
        this.graphics.clear();
        this.graphics.beginFill(values.fillColor, values.fillAlpha);
        this.graphics.drawRoundedRect(x, y, width, height, radius + 2);  // +2 to align 1px radius corner
        this.graphics.endFill();
        renderToRenderTexture(this.graphics, texture);
    }

    private static getAlignmentNumber(alignment: Draw.Alignment | undefined) {
        if (alignment === 'inner') return 0;
        if (alignment === 'outer') return 1;
        return 0;  // Default to inner
    }

    private static getFillAndOutlineConfigValues(config: Draw.FillAndOutlineConfig) {
        return {
            fillColor: config.fill ? config.fill.color : 0,
            fillAlpha: config.fill ? (config.fill.alpha ?? 1) : 0,
            outlineColor: config.outline ? config.outline.color : 0,
            outlineAlpha: config.outline ? (config.outline.alpha ?? 1) : 0,
            outlineThickness: config.outline ? (config.outline.thickness ?? 1) : 0,
            outlineAlignment: config.outline ? (config.outline.alignment ?? 'inner') : 'inner',
        };
    }

    private static PIXEL_SPRITE = new LazyValue(() => {
        let texture = newPixiRenderTexture(1, 1, 'Draw.PIXEL_TEXTURE');
        Draw.fill(texture, { color: 0xFFFFFF });
        return new PIXI.Sprite(texture);
    });
}
