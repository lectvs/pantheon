namespace Box {
    export type WorldObjectData = {
        worldObject: WorldObject;
        anchor: Vector2;
        offsetX: number;
        offsetY: number;
    }

    export type BackgroundParams = {
        type: 'texture';
        texture: string | PIXI.Texture;
    } | {
        type: 'ninepatchScaled';
        baseTexture: string;
    }

    export type Margins = {
        left: ValueUnit;
        right: ValueUnit;
        top: ValueUnit;
        bottom: ValueUnit;
    }

    export type Padding = {
        left: ValueUnit;
        right: ValueUnit;
        top: ValueUnit;
        bottom: ValueUnit;
    }

    export type SubdivideLeftRightParams = XOR<{ leftWidth: number }, { rightWidth: number}> & {
        unit?: Unit;
    }

    export type SubdivideTopBottomParams = XOR<{ topHeight: number }, { bottomHeight: number}> & {
        unit?: Unit;
    }

    export type ValueUnit = {
        value: number;
        unit: Unit;
    }

    export type Unit = 'pixels' | 'percent';
}

/**
 * TODO:
 * - fit box size to content
 * - mask world object within bounds of its box or some ancestor box 
 * - create inner boxes with greater dimensions than outer box and add scroll functionality
 */
class Box {
    parent: Box | undefined;
    name: string | undefined;

    outerX: number;
    outerY: number;
    outerWidth: number;
    outerHeight: number;

    private _contentX: number;
    private _contentY: number;
    private _contentWidth: number;
    private _contentHeight: number;
    get contentX() { return this._contentX; }
    get contentY() { return this._contentY; }
    get contentWidth() { return this._contentWidth; }
    get contentHeight() { return this._contentHeight; }

    private _innerX: number;
    private _innerY: number;
    private _innerWidth: number;
    private _innerHeight: number;
    get innerX() { return this._innerX; }
    get innerY() { return this._innerY; }
    get innerWidth() { return this._innerWidth; }
    get innerHeight() { return this._innerHeight; }

    margins: Box.Margins;
    padding: Box.Padding;
    subdivision: Box.Subdivision | undefined;

    worldObjects: Box.WorldObjectData[];
    background: Box.Background | undefined;

    private debugSprite: PIXI.Sprite;

    constructor(x: number, y: number, width: number, height: number, parent?: Box) {
        this.parent = parent;
        this.name = undefined;

        this.outerX = x;
        this.outerY = y;
        this.outerWidth = width;
        this.outerHeight = height;

        this._contentX = x;
        this._contentY = y;
        this._contentWidth = width;
        this._contentHeight = height;

        this._innerX = x;
        this._innerY = y;
        this._innerWidth = width;
        this._innerHeight = height;
        
        this.margins = {
            left: { value: 0, unit: 'pixels' },
            right: { value: 0, unit: 'pixels' },
            top: { value: 0, unit: 'pixels' },
            bottom: { value: 0, unit: 'pixels' },
        };

        this.padding = {
            left: { value: 0, unit: 'pixels' },
            right: { value: 0, unit: 'pixels' },
            top: { value: 0, unit: 'pixels' },
            bottom: { value: 0, unit: 'pixels' },
        };

        this.worldObjects = [];
        this.debugSprite = new PIXI.Sprite();
    }

    addWorldObject(worldObject: WorldObject, anchor: Vector2 = Anchor.CENTER, offsetX: number = 0, offsetY: number = 0) {
        this.worldObjects.push({ worldObject, anchor, offsetX, offsetY });
        return this;
    }

    addBackground(params: Box.BackgroundParams) {
        if (this.background) {
            console.error('Box already has a background', this);
            return this;
        }
        this.background = new Box.Background(this, params);
        return this.addWorldObject(this.background);
    }

    build() {
        this._contentX = this.outerX + Box.valueUnitToPixels(this.margins.left, this.outerWidth);
        this._contentY = this.outerY + Box.valueUnitToPixels(this.margins.top, this.outerHeight);
        this._contentWidth = this.outerWidth - Box.valueUnitToPixels(this.margins.left, this.outerWidth) - Box.valueUnitToPixels(this.margins.right, this.outerWidth);
        this._contentHeight = this.outerHeight - Box.valueUnitToPixels(this.margins.top, this.outerHeight) - Box.valueUnitToPixels(this.margins.bottom, this.outerHeight);
        
        this._innerX = this._contentX + Box.valueUnitToPixels(this.padding.left, this._contentWidth);
        this._innerY = this._contentY + Box.valueUnitToPixels(this.padding.top, this._contentHeight);
        this._innerWidth = this._contentWidth - Box.valueUnitToPixels(this.padding.left, this._contentWidth) - Box.valueUnitToPixels(this.padding.right, this._contentWidth);
        this._innerHeight = this._contentHeight - Box.valueUnitToPixels(this.padding.top, this._contentHeight) - Box.valueUnitToPixels(this.padding.bottom, this._contentHeight);

        for (let data of this.worldObjects) {
            data.worldObject.localx = this._contentX + this._contentWidth * data.anchor.x + data.offsetX;
            data.worldObject.localy = this._contentY + this._contentHeight * data.anchor.y + data.offsetY;

            if (data.worldObject instanceof SpriteText) {
                data.worldObject.maxWidth = this._contentWidth;
            }
        }
        
        if (this.subdivision) this.subdivision.build();
        return this;
    }

    debugRender() {
        let boxes = this.getSelfAndSubBoxes$();

        let result: Render.Result = FrameCache.array();

        for (let box of boxes) {
            box.debugSprite.x = box.outerX;
            box.debugSprite.y = box.outerY;
    
            box.debugSprite.texture = Textures.outlineRect(box.outerWidth, box.outerHeight, 0x00FF00);
            result.push(box.debugSprite);
        }

        return result;
    }

    getSelfAndSubBoxes$(): Box[] {
        if (this.subdivision) {
            let result = this.subdivision._getAllSubBoxes$();
            result.unshift(this);
            return result;
        }
        return FrameCache.array(this);
    }

    getAllWorldObjects$() {
        let boxes = this.getSelfAndSubBoxes$();
        let result: WorldObject[] = FrameCache.array();
        for (let box of boxes) {
            for (let data of box.worldObjects) {
                result.push(data.worldObject);
            }
        }
        return result;
    }

    getSubBoxByName(name: string) {
        if (this.name === name) return this;
        if (this.subdivision) return this.subdivision._getSubBoxByName(name);
        console.error(`Cannot find sub-box with name '${name}'`, this);
        return undefined;
    }

    named(name: string) {
        this.name = name;
        return this;
    }

    marginLeft(value: number, unit: Box.Unit = 'pixels') {
        this.margins.left = { value, unit };
        return this;
    }

    marginRight(value: number, unit: Box.Unit = 'pixels') {
        this.margins.right = { value, unit };
        return this;
    }

    marginTop(value: number, unit: Box.Unit = 'pixels') {
        this.margins.top = { value, unit };
        return this;
    }

    marginBottom(value: number, unit: Box.Unit = 'pixels') {
        this.margins.bottom = { value, unit };
        return this;
    }

    marginLeftRight(value: number, unit: Box.Unit = 'pixels') {
        this.marginLeft(value, unit)
        this.marginRight(value, unit);
        return this;
    }

    marginTopBottom(value: number, unit: Box.Unit = 'pixels') {
        this.marginTop(value, unit)
        this.marginBottom(value, unit);
        return this;
    }

    margin(value: number, unit?: Box.Unit): Box;
    margin(left: number, right: number, top: number, bottom: number, unit?: Box.Unit): Box;
    margin(leftOrValue: number, rightOrUnit?: Box.Unit | number, top?: number, bottom?: number, unit?: Box.Unit) {
        if (rightOrUnit === undefined) {
            rightOrUnit = 'pixels';
        }

        let left = leftOrValue;
        let right = typeof rightOrUnit === 'string' ? leftOrValue : rightOrUnit;
        top = top ?? leftOrValue;
        bottom = bottom ?? leftOrValue;
        unit = typeof rightOrUnit === 'string' ? rightOrUnit : (unit ?? 'pixels');

        this.marginLeft(left, unit);
        this.marginRight(right, unit);
        this.marginTop(top, unit);
        this.marginBottom(bottom, unit);

        return this;
    }

    padLeft(value: number, unit: Box.Unit = 'pixels') {
        this.padding.left = { value, unit };
        return this;
    }

    padRight(value: number, unit: Box.Unit = 'pixels') {
        this.padding.right = { value, unit };
        return this;
    }

    padTop(value: number, unit: Box.Unit = 'pixels') {
        this.padding.top = { value, unit };
        return this;
    }

    padBottom(value: number, unit: Box.Unit = 'pixels') {
        this.padding.bottom = { value, unit };
        return this;
    }

    padLeftRight(value: number, unit: Box.Unit = 'pixels') {
        this.padLeft(value, unit)
        this.padRight(value, unit);
        return this;
    }

    padTopBottom(value: number, unit: Box.Unit = 'pixels') {
        this.padTop(value, unit)
        this.padBottom(value, unit);
        return this;
    }

    pad(value: number, unit?: Box.Unit): Box;
    pad(left: number, right: number, top: number, bottom: number, unit?: Box.Unit): Box;
    pad(leftOrValue: number, rightOrUnit?: Box.Unit | number, top?: number, bottom?: number, unit?: Box.Unit) {
        if (rightOrUnit === undefined) {
            rightOrUnit = 'pixels';
        }

        let left = leftOrValue;
        let right = typeof rightOrUnit === 'string' ? leftOrValue : rightOrUnit;
        top = top ?? leftOrValue;
        bottom = bottom ?? leftOrValue;
        unit = typeof rightOrUnit === 'string' ? rightOrUnit : (unit ?? 'pixels');

        this.padLeft(left, unit);
        this.padRight(right, unit);
        this.padTop(top, unit);
        this.padBottom(bottom, unit);

        return this;
    }

    subdivideInner() {
        let subdivision = new Box.Subdivision.Inner(this);
        this.subdivision = subdivision;
        return this;
    }

    subdivideLeftRight(params: Box.SubdivideLeftRightParams) {
        let unit = params.unit ?? 'pixels';
        let width = params.leftWidth ? { left: { value: params.leftWidth, unit }} : { right: { value: params.rightWidth!, unit }};
        let subdivision = new Box.Subdivision.LeftRight(this, width);
        this.subdivision = subdivision;
        return subdivision;
    }

    subdivideTopBottom(params: Box.SubdivideTopBottomParams) {
        let unit = params.unit ?? 'pixels';
        let height = params.topHeight ? { top: { value: params.topHeight, unit }} : { bottom: { value: params.bottomHeight!, unit }};
        let subdivision = new Box.Subdivision.TopBottom(this, height);
        this.subdivision = subdivision;
        return subdivision;
    }

    subdivideX(n: number) {
        let subdivision = new Box.Subdivision.X(this, n);
        this.subdivision = subdivision;
        return subdivision;
    }

    subdivideY(n: number) {
        let subdivision = new Box.Subdivision.Y(this, n);
        this.subdivision = subdivision;
        return subdivision;
    }

    subdivideXY(xn: number, yn: number) {
        let subdivision = new Box.Subdivision.XY(this, xn, yn);
        this.subdivision = subdivision;
        return subdivision;
    }
}

namespace Box {
    export function valueUnitToPixels(valueUnit: ValueUnit, total: number) {
        if (valueUnit.unit === 'pixels') return valueUnit.value;
        if (valueUnit.unit === 'percent') return total * valueUnit.value / 100;
        assertUnreachable(valueUnit.unit);
        return 0;
    }

    export class Subdivision {
        parent: Box;
        private subBoxes: Box[][];

        constructor(parent: Box, subBoxes: Box[][]) {
            this.parent = parent;
            this.subBoxes = subBoxes;
        }

        _getAllSubBoxes$() {
            let result: Box[] = FrameCache.array();
            for (let subBoxList of this.subBoxes) {
                for (let subBox of subBoxList) {
                    result.pushAll(subBox.getSelfAndSubBoxes$());
                }
            }
            return result;
        }

        _getSubBoxByName(name: string) {
            for (let subBoxList of this.subBoxes) {
                for (let subBox of subBoxList) {
                    if (subBox.name === name) {
                        return subBox;
                    }
                }
            }
            return undefined;
        }

        _getSubBox(xi: number, yi: number) {
            if (yi < 0 || yi >= this.subBoxes.length || xi < 0 || xi >= this.subBoxes[yi].length) {
                console.error(`Tried to reference subBox (${xi}, ${yi}) which is outside the box bounds`, this);
                return new Box(0, 0, 0, 0);
            }
            return this.subBoxes[yi][xi];
        }

        build() {
            let currentY = this.parent.innerY;
            for (let subBoxList of this.subBoxes) {
                let currentX = this.parent.innerX;
                for (let subBox of subBoxList) {
                    subBox.outerX = currentX;
                    subBox.outerY = currentY;
                    subBox.build();
                    currentX += subBox.outerWidth;
                }
                if (subBoxList.length > 0) {
                    currentY += subBoxList[0].outerHeight;
                }
            }
            return this.parent;
        }
    }

    export namespace Subdivision {
        export class Inner extends Subdivision {
            private _box: Box;

            constructor(parent: Box) {
                let box = new Box(0, 0, 0, 0, parent);
                super(parent, [[box]]);
                this._box = box;
            }
    
            box(fn: (box: Box) => void) {
                fn(this._box);
                return this.build();
            }

            override build(): Box {
                this._box.outerWidth = this.parent.innerWidth;
                this._box.outerHeight = this.parent.innerHeight;
                return super.build();
            }
        }

        export class LeftRight extends Subdivision {
            private _left: Box;
            private _right: Box;

            constructor(parent: Box, private width: XOR<{ left: ValueUnit }, { right: ValueUnit }>) {
                let left = new Box(0, 0, 0, 0, parent);
                let right = new Box(0, 0, 0, 0, parent);
                super(parent, [[left, right]]);
                this._left = left;
                this._right = right;
            }
    
            left(fn: (box: Box) => void) {
                fn(this._left);
                return this;
            }
    
            right(fn: (box: Box) => void) {
                fn(this._right);
                return this;
            }

            leftRight(left: (left: Box) => void, right: (right: Box) => void) {
                left(this._left);
                right(this._right);
                return this.build();
            }

            override build(): Box {
                if (this.width.left) {
                    this._left.outerWidth = valueUnitToPixels(this.width.left, this.parent.innerWidth);
                    this._left.outerHeight = this.parent.innerHeight;
                    this._right.outerWidth = this.parent.innerWidth - this._left.outerWidth;
                    this._right.outerHeight = this.parent.innerHeight;
                } else {
                    this._right.outerWidth = valueUnitToPixels(this.width.right, this.parent.innerWidth);
                    this._right.outerHeight = this.parent.innerHeight;
                    this._left.outerWidth = this.parent.innerWidth - this._right.outerWidth;
                    this._left.outerHeight = this.parent.innerHeight;
                }
                return super.build();
            }
        }

        export class TopBottom extends Subdivision {
            private _top: Box;
            private _bottom: Box;

            constructor(parent: Box, private height: XOR<{ top: ValueUnit }, { bottom: ValueUnit }>) {
                let top = new Box(0, 0, 0, 0, parent);
                let bottom = new Box(0, 0, 0, 0, parent);
                super(parent, [[top], [bottom]]);
                this._top = top;
                this._bottom = bottom;
            }
    
            top(fn: (box: Box) => void) {
                fn(this._top);
                return this;
            }
    
            bottom(fn: (box: Box) => void) {
                fn(this._bottom);
                return this;
            }

            topBottom(top: (top: Box) => void, bottom: (bottom: Box) => void) {
                top(this._top);
                bottom(this._bottom);
                return this.build();
            }

            override build(): Box {
                if (this.height.top) {
                    this._top.outerHeight = valueUnitToPixels(this.height.top, this.parent.innerHeight);
                    this._top.outerWidth = this.parent.innerWidth;
                    this._bottom.outerHeight = this.parent.innerHeight - this._top.outerHeight;
                    this._bottom.outerWidth = this.parent.innerWidth;
                } else {
                    this._bottom.outerHeight = valueUnitToPixels(this.height.bottom, this.parent.innerHeight);
                    this._bottom.outerWidth = this.parent.innerWidth;
                    this._top.outerHeight = this.parent.innerHeight - this._bottom.outerHeight;
                    this._top.outerWidth = this.parent.innerWidth;
                }
                return super.build();
            }
        }

        export class X extends Subdivision {
            private _boxes: Box[];

            constructor(parent: Box, n: number) {
                let boxes = A.sequence(n, _ => new Box(0, 0, 0, 0, parent));
                super(parent, [[...boxes]]);
                this._boxes = boxes;
            }

            box(i: number, fn: (box: Box) => void) {
                fn(this._boxes[i]);
                return this;
            }

            boxes(fn: (box: Box, i: number) => void) {
                for (let i = 0; i < this._boxes.length; i++) {
                    fn(this._boxes[i], i);
                }
                return this.build();
            }

            override build(): Box {
                for (let box of this._boxes) {
                    box.outerWidth = this.parent.innerWidth / this.boxes.length;
                    box.outerHeight = this.parent.innerHeight;
                }
                return super.build();
            }
        }

        export class Y extends Subdivision {
            private _boxes: Box[];

            constructor(parent: Box, n: number) {
                let boxes = A.sequence(n, _ => new Box(0, 0, 0, 0, parent));
                super(parent, [...boxes.map(box => [box])]);
                this._boxes = boxes;
            }

            box(i: number, fn: (box: Box) => void) {
                fn(this._boxes[i]);
                return this;
            }

            boxes(fn: (box: Box, i: number) => void) {
                for (let i = 0; i < this._boxes.length; i++) {
                    fn(this._boxes[i], i);
                }
                return this.build();
            }

            override build(): Box {
                for (let box of this._boxes) {
                    box.outerHeight = this.parent.innerHeight / this._boxes.length;
                    box.outerWidth = this.parent.innerWidth;
                }
                return super.build();
            }
        }

        export class XY extends Subdivision {
            private _boxes: Box[][];

            constructor(parent: Box, xn: number, yn: number) {
                let boxes = A.sequence(yn, _ => A.sequence(xn, _ => new Box(0, 0, 0, 0, parent)));
                super(parent, [...boxes.map(b => [...b])]);
                this._boxes = boxes;
            }

            box(xi: number, yi: number, fn: (box: Box) => void) {
                fn(this._boxes[yi][xi]);
                return this;
            }

            boxes(fn: (box: Box, xi: number, yi: number) => void) {
                for (let yi = 0; yi < this._boxes.length; yi++) {
                    for (let xi = 0; xi < this._boxes[yi].length; xi++) {
                        fn(this._boxes[yi][xi], xi, yi);
                    }
                }
                return this.build();
            }

            override build(): Box {
                for (let boxList of this._boxes) {
                    for (let box of boxList) {
                        box.outerWidth = this.parent.innerWidth / boxList.length;
                        box.outerHeight = this.parent.innerHeight / this._boxes.length;
                    }
                }
                return super.build();
            }
        }
    }

    export class Background extends Sprite {

        params: BackgroundParams;

        private currentWidth: number;
        private currentHeight: number;

        constructor(private box: Box, params: BackgroundParams) {
            super({
                textureAnchor: Anchor.CENTER,
            });

            this.params = O.clone(params);
            this.currentWidth = 0;
            this.currentHeight = 0;
        }

        override postUpdate(): void {
            super.postUpdate();

            if (this.currentWidth !== this.box.contentWidth || this.currentHeight !== this.box.contentHeight) {
                this.currentWidth = this.box.contentWidth;
                this.currentHeight = this.box.contentHeight;
                this.updateTexture();
            }
        }

        private updateTexture() {
            if (this.params.type === 'texture') {
                this.setTexture(this.params.texture);
                this.scaleX = this.currentWidth / this.getTexture().width;
                this.scaleY = this.currentHeight / this.getTexture().height;
            } else if (this.params.type === 'ninepatchScaled') {
                this.setTexture(Textures.ninepatchScaled(this.params.baseTexture, this.box.contentWidth, this.box.contentHeight));
            } else {
                assertUnreachable(this.params);
            }
        }
    }
}
