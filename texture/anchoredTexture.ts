class AnchoredTexture implements Texture {
    private baseTexture: Texture;

    get width() { return this.baseTexture.width; }
    get height() { return this.baseTexture.height; }

    anchorX: number;
    anchorY: number;

    get immutable() { return this.baseTexture.immutable; }
    set immutable(value: boolean) { this.baseTexture.immutable = value; }

    constructor(width: number, height: number, baseTexture?: Texture) {
        this.baseTexture = baseTexture ?? new BasicTexture(width, height, false, arguments?.callee?.caller?.name ?? "none");
        this.anchorX = 0;
        this.anchorY = 0;
    }

    clear() {
        this.baseTexture.clear();
    }

    clone() {
        return AnchoredTexture.fromBaseTexture(this.baseTexture.clone(), this.anchorX, this.anchorY);
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

    subdivide(h: number, v: number, anchorX: number = 0, anchorY: number = 0) {
        let result = this.baseTexture.subdivide(h, v);
        for (let subdivision of result) {
            subdivision.texture = AnchoredTexture.fromBaseTexture(subdivision.texture, anchorX, anchorY);
        }
        return result;
    }

    toMask() {
        let mask = this.baseTexture.toMask();
        mask.offsetx = -Math.floor(this.anchorX*this.width);
        mask.offsety = -Math.floor(this.anchorY*this.height);
        return mask;
    }

    transform(properties?: Texture.TransformProperties) {
        let transformedBaseTexture = this.baseTexture.transform(properties);
        return AnchoredTexture.fromBaseTexture(transformedBaseTexture, this.anchorX, this.anchorY);
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

namespace AnchoredTexture {
    export function fromBaseTexture(baseTexture: Texture, anchorX: number = 0, anchorY: number = 0) {
        let result = new AnchoredTexture(0, 0, baseTexture);
        result.anchorX = anchorX;
        result.anchorY = anchorY;
        return result;
    }
}