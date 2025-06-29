namespace Graphics {
    export type Config<WO extends Graphics> = WorldObject.Config<WO> & {
        graphics?: PIXI.Graphics;
        graphicsTint?: number;
        graphicsAlpha?: number;
        flipX?: boolean;
        flipY?: boolean;
        offsetX?: number;
        offsetY?: number;
        angle?: number;
        angleOffset?: number;
        vangle?: number;
        scale?: number;
        scaleX?: number;
        scaleY?: number;
        skewX?: number;
        skewY?: number;
        blendMode?: PIXI.BLEND_MODES;
    }
}

class Graphics extends WorldObject {
    private graphics!: PIXI.Graphics;

    graphicsTint: number;
    graphicsAlpha: number;
    flipX: boolean;
    flipY: boolean;
    offsetX: number;
    offsetY: number;
    angle: number;
    angleOffset: number;
    vangle: number;

    scaleX: number;
    scaleY: number;
    get scale() {
        if (this.scaleX !== this.scaleY) console.error('Warning: scaleX and scaleY differ! Attempted to get scale!');
        return this.scaleX;
    }
    set scale(value: number) {
        this.scaleX = value;
        this.scaleY = value;
    }

    skewX: number;
    skewY: number;

    blendMode?: PIXI.BLEND_MODES;

    private renderObject: PIXI.Container;

    constructor(config: Graphics.Config<Graphics> = {}) {
        super(config);

        if (config.graphics || !this.graphics) this.setGraphics(config.graphics);

        this.graphicsTint = config.graphicsTint ?? 0xFFFFFF;
        this.graphicsAlpha = config.graphicsAlpha ?? 1;
        this.flipX = config.flipX ?? false;
        this.flipY = config.flipY ?? false;

        this.offsetX = config.offsetX ?? 0;
        this.offsetY = config.offsetY ?? 0;
        this.angle = config.angle ?? 0;
        this.angleOffset = config.angleOffset ?? 0;
        this.vangle = config.vangle ?? 0;
        this.scaleX = config.scaleX ?? (config.scale ?? 1);
        this.scaleY = config.scaleY ?? (config.scale ?? 1);
        this.skewX = config.skewX ?? 0;
        this.skewY = config.skewY ?? 0;

        this.blendMode = config.blendMode;

        this.renderObject = new PIXI.Sprite();
    }

    override onAdd(): void {
        super.onAdd();

        if (!this.graphics.geometry || !this.graphics.transform) {
            console.error('Attempted to use new Graphics after removing from world:', this);
            this.graphics = new PIXI.Graphics();
        }
    }

    override onRemove(): void {
        super.onRemove();
        this.graphics.destroy();
    }

    override unload(): void {
        super.unload();
        this.graphics.destroy();
    }

    override update() {
        super.update();

        this.angle += this.vangle * this.delta;
    }

    override render(): Render.Result {
        if (this.renderObject.children[0] !== this.graphics) {
            this.renderObject.removeChildren();
            this.renderObject.addChild(this.graphics);
        }
        this.renderObject.x = this.offsetX;
        this.renderObject.y = this.offsetY;
        this.renderObject.scale.x = (this.flipX ? -1 : 1) * this.scaleX;
        this.renderObject.scale.y = (this.flipY ? -1 : 1) * this.scaleY;
        this.renderObject.skew.x = this.skewX;
        this.renderObject.skew.y = this.skewY;
        this.renderObject.angle = this.angle + this.angleOffset;
        this.graphics.tint = Color.combineTints(this.getTotalTint(), this.graphicsTint);
        this.renderObject.alpha = this.getTotalAlpha() * this.graphicsAlpha;
        this.graphics.blendMode = this.blendMode ?? PIXI.BLEND_MODES.NORMAL;
        this.renderObject.mask = this.getMaskSprite()!; // undefined maskSprite => no mask
        O.putMetadata(this.renderObject, 'renderedFrom', this);

        let result: Render.Result = FrameCache.array(this.renderObject);
        result.pushAll(super.render());

        return result;
    }

    getGraphics() {
        return this.graphics;
    }

    override getVisibleLocalBounds$(): Rectangle | undefined {
        let result = FrameCache.rectangle(0, 0, 0, 0);
        this.graphics.getLocalBounds(result as any);
        return result;
    }

    setGraphics(graphics: PIXI.Graphics | undefined) {
        if (!graphics) {
            this.graphics = new PIXI.Graphics();
            return;
        }

        this.graphics = graphics;
    }
}

namespace Graphics {
    abstract class GraphicsPreset extends Graphics {
        protected dirty = false;

        override render(): Render.Result {
            if (this.dirty) {
                this.updateGraphics();
                this.dirty = false;
            }
            return super.render();
        }

        protected abstract updateGraphics(): void;
    }

    export namespace Annulus {
        export type Config = Graphics.Config<Annulus> & {
            outerRadius: number;
            innerRadius: number;
        }
    }

    export class Annulus extends GraphicsPreset {
        private _outerRadius: number;
        get outerRadius() { return this._outerRadius; }
        set outerRadius(v) {
            this._outerRadius = v;
            this.dirty = true;
        }

        private _innerRadius: number;
        get innerRadius() { return this._innerRadius; }
        set innerRadius(v) {
            this._innerRadius = v;
            this.dirty = true;
        }

        constructor(config: Annulus.Config) {
            super(config);
            this._outerRadius = config.outerRadius;
            this._innerRadius = config.innerRadius;
            this.updateGraphics();
        }

        protected override updateGraphics(): void {
            let graphics = this.getGraphics();
            graphics.clear();
            graphics.lineStyle(0, 0, 0);
            graphics.beginFill(0xFFFFFF, 1);
            graphics.drawCircle(0, 0, this.outerRadius);
            graphics.endFill();
            graphics.beginHole();
            graphics.drawCircle(0, 0, this.innerRadius);
            graphics.endHole();
        }
    }
}