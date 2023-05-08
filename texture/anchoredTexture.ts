class AnchoredTexture implements Texture {
    private baseTexture: Texture;

    get width() { return this.baseTexture.width; }
    get height() { return this.baseTexture.height; }

    private _anchorX: number;
    get anchorX() { return this._anchorX; }
    set anchorX(v: number) {
        if (this.immutable) {
            console.error('Cannot set anchorX on immutable texture:', this);
            return;
        }
        this._anchorX = v;
    }

    private _anchorY: number;
    get anchorY() { return this._anchorY; }
    set anchorY(v: number) {
        if (this.immutable) {
            console.error('Cannot set anchorY on immutable texture:', this);
            return;
        }
        this._anchorY = v;
    }

    get immutable() { return this.baseTexture.immutable; }
    set immutable(value: boolean) { this.baseTexture.immutable = value; }

    constructor(baseTexture: Texture, anchorX: number = 0, anchorY: number = 0) {
        this.baseTexture = baseTexture;
        this._anchorX = anchorX;
        this._anchorY = anchorY;
    }

    clear() {
        this.baseTexture.clear();
    }

    clone(source: string) {
        return new AnchoredTexture(this.baseTexture.clone(source), this.anchorX, this.anchorY);
    }

    free() {
        this.baseTexture.free();
    }

    getLocalBounds(properties: Texture.Properties) {
        let baseBounds = this.baseTexture.getLocalBounds(properties);
        baseBounds.x += this.getAdjustmentX(properties.angle ?? 0, properties.scaleX ?? 1, properties.scaleY ?? 1);
        baseBounds.y += this.getAdjustmentY(properties.angle ?? 0, properties.scaleX ?? 1, properties.scaleY ?? 1);
        return baseBounds;
    }

    getPixelAbsoluteARGB(x: number, y: number, extendMode: Texture.ExtendMode = 'transparent') {
        return this.baseTexture.getPixelAbsoluteARGB(x, y, extendMode);
    }

    getPixelRelativeARGB(x: number, y: number, extendMode: Texture.ExtendMode = 'transparent') {
        return this.baseTexture.getPixelAbsoluteARGB(x + this.anchorX*this.width, y + this.anchorY*this.height, extendMode);
    }

    getPixelsARGB() {
        return this.baseTexture.getPixelsARGB();
    }

    renderTo(texture: Texture, properties: Texture.Properties = {}) {
        properties.x = properties.x ?? 0;
        properties.y = properties.y ?? 0;
        properties.angle = properties.angle ?? 0;
        properties.scaleX = properties.scaleX ?? 1;
        properties.scaleY = properties.scaleY ?? 1;

        let adjustmentX = this.getAdjustmentX(properties.angle, properties.scaleX, properties.scaleY);
        let adjustmentY = this.getAdjustmentY(properties.angle, properties.scaleX, properties.scaleY);

        properties.x += adjustmentX;
        properties.y += adjustmentY;

        this.baseTexture.renderTo(texture, properties);
    }

    renderPIXIDisplayObject(displayObject: PIXI.DisplayObject) {
        this.baseTexture.renderPIXIDisplayObject(displayObject);
    }

    subdivide(h: number, v: number, source: string, anchorX: number = 0, anchorY: number = 0) {
        let result = this.baseTexture.subdivide(h, v, source);
        for (let subdivision of result) {
            subdivision.texture = new AnchoredTexture(subdivision.texture, anchorX, anchorY);
        }
        return result;
    }

    toCanvas() {
        return this.baseTexture.toCanvas();
    }

    toMask() {
        let mask = this.baseTexture.toMask();
        mask.offsetx = -Math.floor(this.anchorX*this.width);
        mask.offsety = -Math.floor(this.anchorY*this.height);
        return mask;
    }

    transform(properties: Texture.TransformProperties, source: string) {
        let transformedBaseTexture = this.baseTexture.transform(properties, source);
        return new AnchoredTexture(transformedBaseTexture, this.anchorX, this.anchorY);
    }

    withAnchor(anchorX: number, anchorY: number) {
        this.anchorX = anchorX;
        this.anchorY = anchorY;
        return this;
    }

    private getAdjustmentX(angle: number, scaleX: number, scaleY: number) {
        let ax = Math.floor(this.anchorX*this.width)*scaleX;
        let ay = Math.floor(this.anchorY*this.height)*scaleY;
        let rotatedAndScaled_ax = (-ax) * M.cos(angle) - (-ay) * M.sin(angle);
        return rotatedAndScaled_ax;
    }

    private getAdjustmentY(angle: number, scaleX: number, scaleY: number) {
        let ax = Math.floor(this.anchorX*this.width)*scaleX;
        let ay = Math.floor(this.anchorY*this.height)*scaleY;
        let rotatedAndScaled_ay = (-ax) * M.sin(angle) + (-ay) * M.cos(angle);
        return rotatedAndScaled_ay;
    }
}
