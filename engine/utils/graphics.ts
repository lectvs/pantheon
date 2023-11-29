namespace Graphics {
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

    // TODO PIXI
    // export function fill(texture: Texture, config: { color: number, alpha?: number }) {
    //     this.graphics.lineStyle(0, 0, 0);
    //     this.graphics.clear();
    //     this.graphics.beginFill(config.color, config.alpha ?? 1);
    //     this.graphics.drawRect(0, 0, texture.width, texture.height);
    //     this.graphics.endFill();
    //     texture.clear();
    //     texture.renderPIXIDisplayObject(this.graphics);
    // }

    // TODO PIXI
    // export function eraseRect(texture: Texture, x: number, y: number, width: number, height: number) {
    //     let newTexture = texture.clone('Draw.eraseRect');

    //     let mask = new TextureFilters.Mask({
    //         type: 'local',
    //         mask: Texture.filledRect(width, height, 0xFFFFFF),
    //         offsetX: x, offsetY: y,
    //         invert: true,
    //     });

    //     texture.clear();
    //     newTexture.renderTo(texture, {
    //         x: 0, y: 0,
    //         filters: [mask],
    //     });
    // }

    export function annulus(x: number, y: number, innerRadius: number, outerRadius: number, config: Draw.FillAndOutlineConfig) {
        if (innerRadius <= 0) {
            return circle(x, y, outerRadius, config);
        }
        let values = getFillAndOutlineConfigValues(config);
        let graphics = new PIXI.Graphics();
        if (values.fillAlpha === 0 && values.outlineAlpha === 0) return graphics;
        graphics.x = x;
        graphics.y = y;
        graphics.lineStyle(values.outlineThickness, values.outlineColor, values.outlineAlpha, getAlignmentNumber(values.outlineAlignment));
        graphics.clear();
        graphics.beginFill(values.fillColor, values.fillAlpha);
        graphics.drawCircle(x, y, outerRadius);
        graphics.endFill();
        graphics.beginHole();
        graphics.drawCircle(x, y, innerRadius);
        graphics.endHole();
        return graphics;
    }

    export function circle(x: number, y: number, radius: number, config: Draw.FillAndOutlineConfig) {
        let values = getFillAndOutlineConfigValues(config);
        let graphics = new PIXI.Graphics();
        if (values.fillAlpha === 0 && values.outlineAlpha === 0) return graphics;
        graphics.x = x;
        graphics.y = y;
        graphics.lineStyle(values.outlineThickness, values.outlineColor, values.outlineAlpha, getAlignmentNumber(values.outlineAlignment));
        graphics.clear();
        graphics.beginFill(values.fillColor, values.fillAlpha);
        graphics.drawCircle(x, y, radius);
        graphics.endFill();
        return graphics;
    }

    export function ellipse(x: number, y: number, radiusX: number, radiusY: number, config: Draw.FillAndOutlineConfig) {
        let values = getFillAndOutlineConfigValues(config);
        let graphics = new PIXI.Graphics();
        if (values.fillAlpha === 0 && values.outlineAlpha === 0) return graphics;
        graphics.x = x;
        graphics.y = y;
        graphics.lineStyle(values.outlineThickness, values.outlineColor, values.outlineAlpha, getAlignmentNumber(values.outlineAlignment));
        graphics.clear();
        graphics.beginFill(values.fillColor, values.fillAlpha);
        graphics.drawEllipse(x, y, radiusX, radiusY);
        graphics.endFill();
        return graphics;
    }

    // TODO PIXI
    // export function pixel(x: number, y: number, config: { color: number, alpha?: number }) {
    //     if (config.alpha === 0) return;
    //     Draw.PIXEL_TEXTURE.renderTo(texture, {
    //         x: x, y: y,
    //         tint: config.color,
    //         alpha: config.alpha ?? 1,
    //     });
    // }

    export function line(x1: number, y1: number, x2: number, y2: number, config: { color: number, alpha?: number, thickness?: number }) {
        let graphics = new PIXI.Graphics();
        if (config.alpha === 0) return graphics;
        graphics.lineStyle(config.thickness ?? 1, config.color, config.alpha ?? 1, 0.5);
        graphics.clear();
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
        return graphics;
    }

    export function polygon(points: Pt[], config: Draw.FillAndOutlineConfig) {
        let values = getFillAndOutlineConfigValues(config);
        let graphics = new PIXI.Graphics();
        if (values.fillAlpha === 0 && values.outlineAlpha === 0) return graphics;
        graphics.lineStyle(values.outlineThickness, values.outlineColor, values.outlineAlpha, getAlignmentNumber(values.outlineAlignment));
        graphics.clear();
        graphics.beginFill(values.fillColor, values.fillAlpha);
        graphics.drawPolygon(points.map(point => new PIXI.Point(point.x, point.y)));
        graphics.endFill();
        return graphics;
    }

    export function rectangle(x: number, y: number, width: number, height: number, config: Draw.FillAndOutlineConfig) {
        let values = getFillAndOutlineConfigValues(config);
        let graphics = new PIXI.Graphics();
        if (values.fillAlpha === 0 && values.outlineAlpha === 0) return graphics;
        graphics.x = x;
        graphics.y = y;
        graphics.lineStyle(values.outlineThickness, values.outlineColor, values.outlineAlpha, getAlignmentNumber(values.outlineAlignment));
        graphics.clear();
        graphics.beginFill(values.fillColor, values.fillAlpha);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();
        return graphics;
    }

    function getAlignmentNumber(alignment: Draw.Alignment | undefined) {
        if (alignment === 'inner') return 0;
        if (alignment === 'outer') return 1;
        return 0;  // Default to inner
    }

    function getFillAndOutlineConfigValues(config: Draw.FillAndOutlineConfig) {
        return {
            fillColor: config.fill ? config.fill.color : 0,
            fillAlpha: config.fill ? (config.fill.alpha ?? 1) : 0,
            outlineColor: config.outline ? config.outline.color : 0,
            outlineAlpha: config.outline ? (config.outline.alpha ?? 1) : 0,
            outlineThickness: config.outline ? (config.outline.thickness ?? 1) : 0,
            outlineAlignment: config.outline ? (config.outline.alignment ?? 'inner') : 'inner',
        };
    }
}