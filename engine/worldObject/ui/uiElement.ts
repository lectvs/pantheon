namespace UIElement {
    export type Config = {
        onClick?: Callback;
        onUpdate?: Callback;
        onStateChange?: OnStateChangeCallback;

        canInteract?: () => boolean;

        tinting?: Tinting;
        outlining?: Outlining;

        disabled?: boolean;

        maxDistanceMouseCanMoveWhileClicking?: number;

        onKeyboardLeft?: Callback;
        onKeyboardRight?: Callback;
        onKeyboardUp?: Callback;
        onKeyboardDown?: Callback;
    }

    export type State = {
        /**
         * Hovered, in mouse mode.
         */
        hovered: boolean;
        /**
         * Selected, in manual mode.
         */
        selected: boolean;
        clickedDown: boolean;
        disabled: boolean;
    }

    export type StateColoring = {
        base?: number;
        hover?: number;
        clicked?: number;
        disabled?: number;
    }

    export type Tinting = StateColoring & {
        scope?: 'texture' | 'worldobject';
    }

    export type Outlining = StateColoring;

    export type SelectionMode = 'mouse' | 'manual';

    export type Callback = (this: UIElement, state: State) => void;
    export type OnStateChangeCallback = (this: UIElement, state: State, lastState: State) => void;
}

class UIElement extends Module<WorldObject> {
    onClick: UIElement.Callback;
    onUpdate: UIElement.Callback;
    onStateChange: UIElement.OnStateChangeCallback;

    canInteract: () => boolean;

    onKeyboardLeft: UIElement.Callback | undefined;
    onKeyboardRight: UIElement.Callback | undefined;
    onKeyboardUp: UIElement.Callback | undefined;
    onKeyboardDown: UIElement.Callback | undefined;

    tinting?: UIElement.Tinting;
    outlining?: UIElement.Outlining;

    private clickedDownDistance: number | undefined;
    maxDistanceMouseCanMoveWhileClicking: number | undefined;

    selectionMode: UIElement.SelectionMode;

    state: UIElement.State;
    private lastState: UIElement.State;

    constructor(config: UIElement.Config) {
        super(WorldObject);

        this.onClick = config.onClick ?? Utils.NOOP;
        this.onUpdate = config.onUpdate ?? Utils.NOOP;
        this.onStateChange = config.onStateChange ?? Utils.NOOP;

        this.canInteract = config.canInteract ?? (() => true);

        this.onKeyboardLeft = config.onKeyboardLeft;
        this.onKeyboardRight = config.onKeyboardRight;
        this.onKeyboardUp = config.onKeyboardUp;
        this.onKeyboardDown = config.onKeyboardDown;

        this.tinting = O.clone(config.tinting);
        this.outlining = O.clone(config.outlining);

        this.maxDistanceMouseCanMoveWhileClicking = config.maxDistanceMouseCanMoveWhileClicking;

        this.selectionMode = 'mouse';

        this.state = {
            hovered: false,
            selected: false,
            clickedDown: false,
            disabled: config.disabled ?? false,
        };
        this.lastState = O.clone(this.state);
    }

    override onAdd(): void {
        super.onAdd()
        this.onStateChange(this.state, this.lastState);
    }

    override init(worldObject: WorldObject): void {
        super.init(worldObject);

        if (this.tinting && this.tinting.base === undefined) {
            this.tinting.base = this.tinting.scope === 'texture' && this.worldObject instanceof Sprite
                ? this.worldObject.textureTint
                : this.worldObject.tint;
        }

        if (this.outlining && this.outlining.base === undefined) {
            let effects = (this.worldObject as any).effects;
            if (effects instanceof Effects) {
                this.outlining.base = effects.outline.enabled ? effects.outline.color : -1;
            }
        }
    }

    override update(): void {
        super.update();

        let mouseOverlapping = this.isMouseOverlapping();

        if (mouseOverlapping && !Input.mouseD$.isZero()) {
            this.selectionMode = 'mouse';
        }

        if (this.selectionMode === 'mouse') {
            this.updateModeMouse(mouseOverlapping);
        }

        if (this.tinting) {
            UIElement.applyTinting(this, this.state, this.tinting);
        }

        if (this.outlining) {
            UIElement.applyOutlining(this, this.state, this.outlining);
        }

        this.handleStateChange();
        this.onUpdate(this.state);
    }

    private handleStateChange() {
        if (this.state.hovered !== this.lastState.hovered ||
            this.state.selected !== this.lastState.selected ||
            this.state.clickedDown !== this.lastState.clickedDown ||
            this.state.disabled !== this.lastState.disabled
        ) {
            this.onStateChange(this.state, this.lastState);
            this.lastState.hovered = this.state.hovered;
            this.lastState.selected = this.state.selected;
            this.lastState.clickedDown = this.state.clickedDown;
            this.lastState.disabled = this.state.disabled;
        }
    }

    private updateModeMouse(mouseOverlapping: boolean) {
        if (Input.justUp(Input.GAME_SELECT)) {
            if (mouseOverlapping && this.state.clickedDown && !this.hasMovedMouseTooFarToClick()) {
                this.click();
            }
        }

        if (this.clickedDownDistance !== undefined) {
            this.clickedDownDistance += Input.mouseD$.magnitude;
        }
        
        if (mouseOverlapping) {
            this.setHovered(true);
        } else {
            this.setHovered(false);
        }

        if (this.state.clickedDown) {
            if (!mouseOverlapping || Input.isUp(Input.GAME_SELECT)) {
                this.setClickedDown(false);
                this.clickedDownDistance = undefined;
            }
        } else {
            if (mouseOverlapping && Input.justDown(Input.GAME_SELECT)) {
                this.setClickedDown(true);
                if (this.clickedDownDistance === undefined) this.clickedDownDistance = 0;
            }
        }
    }

    click() {
        this.onClick(this.state);
    }

    isMouseOverlapping() {
        if (this.state.disabled) return false;
        if (this.worldObject.isControlRevoked()) return false;
        if (!this.canInteract()) return false;
        if (!this.worldObject.world) return false;

        let mouseBounds = this.worldObject.world.getWorldMouseBounds$();
        if (!this.isOverlapping(mouseBounds)) return false;

        let maskBounds = this.worldObject.getMaskWorldBounds$();
        if (maskBounds) {
            let overlap = G.getRectangleOverlap$(maskBounds, this.getInteractBounds$().getBoundingBox$());
            if (!overlap || !this.isRectOverlapping$(overlap, mouseBounds)) {
                return false;
            }
        }

        return UIElement.getClosestUIElement(mouseBounds, this.worldObject.world) === this;
    }

    isOverlapping(bounds: Bounds) {
        let boundsX = bounds.x;
        let boundsY = bounds.y;

        if (this.worldObject.shouldIgnoreCamera() && this.worldObject.world) {
            bounds.x -= this.worldObject.world.camera.worldOffsetX;
            bounds.y -= this.worldObject.world.camera.worldOffsetY;
        }

        let result = this.getInteractBounds$().isOverlapping(bounds);

        bounds.x = boundsX;
        bounds.y = boundsY;

        return result;
    }

    isRectOverlapping$(rect: Rect, bounds: Bounds) {
        let boundsX = bounds.x;
        let boundsY = bounds.y;

        if (this.worldObject.shouldIgnoreCamera() && this.worldObject.world) {
            bounds.x -= this.worldObject.world.camera.worldOffsetX;
            bounds.y -= this.worldObject.world.camera.worldOffsetY;
        }

        let result = G.areRectanglesOverlapping(rect, bounds.getBoundingBox$());

        bounds.x = boundsX;
        bounds.y = boundsY;

        return result;
    }

    distanceTo(bounds: Bounds) {
        let boundsX = bounds.x;
        let boundsY = bounds.y;

        if (this.worldObject.shouldIgnoreCamera() && this.worldObject.world) {
            bounds.x -= this.worldObject.world.camera.worldOffsetX;
            bounds.y -= this.worldObject.world.camera.worldOffsetY;
        }

        let boundsBox = bounds.getBoundingBox$();

        let result = UIElement.distanceTo(boundsBox.centerX, boundsBox.centerY, this.getInteractBounds$().getBoundingBox$());

        bounds.x = boundsX;
        bounds.y = boundsY;

        return result;
    }

    private localBounds = new RectBounds(0, 0, 0, 0);
    getInteractBounds$() {
        if ('bounds' in this.worldObject && (this.worldObject.bounds as Bounds).isOverlapping && !(this.worldObject.bounds instanceof NullBounds)) {
            return this.worldObject.bounds as Bounds;
        }
        let objLocalBounds = this.worldObject.getVisibleLocalBounds$();
        this.localBounds.parent = this.worldObject;
        if (objLocalBounds) {
            this.localBounds.x = objLocalBounds.x;
            this.localBounds.y = objLocalBounds.y;
            this.localBounds.width = objLocalBounds.width;
            this.localBounds.height = objLocalBounds.height;
        } else {
            this.localBounds.x = 0;
            this.localBounds.y = 0;
            this.localBounds.width = 0;
            this.localBounds.height = 0;
        }
        return this.localBounds;
    }

    pressLeft() {
        if (this.onKeyboardLeft) this.onKeyboardLeft(this.state);
    }

    pressRight() {
        if (this.onKeyboardRight) this.onKeyboardRight(this.state);
    }

    pressUp() {
        if (this.onKeyboardUp) this.onKeyboardUp(this.state);
    }

    pressDown() {
        if (this.onKeyboardDown) this.onKeyboardDown(this.state);
    }

    setHovered(hovered: boolean) {
        if (this.state.hovered === hovered) return;
        this.state.hovered = hovered;
        this.handleStateChange();
    }

    setClickedDown(clickedDown: boolean) {
        if (this.state.clickedDown === clickedDown) return;
        this.state.clickedDown = clickedDown;
        this.handleStateChange();
    }

    setSelected(selected: boolean) {
        if (this.state.selected === selected) return;
        this.state.selected = selected;
        this.handleStateChange();
    }

    setDisabled(disabled: boolean) {
        if (this.state.disabled === disabled) return;
        this.state.disabled = disabled;
        this.handleStateChange();
    }

    private hasMovedMouseTooFarToClick() {
        if (this.clickedDownDistance === undefined) return false;
        if (this.maxDistanceMouseCanMoveWhileClicking === undefined) return false;
        return this.clickedDownDistance > this.maxDistanceMouseCanMoveWhileClicking;
    }
}

namespace UIElement {
    export function getClosestUIElement(targetBounds: CircleBounds, world: World) {
        let uiElements = world.select.modules$(UIElement);
        uiElements.filterInPlace(uiElement => !uiElement.state.disabled
                                        && uiElement.worldObject.isActive()
                                        && !uiElement.worldObject.isControlRevoked()
                                        && uiElement.canInteract()
                                        && uiElement.isOverlapping(targetBounds));
        
        if (A.isEmpty(uiElements)) {
            return undefined;
        }

        uiElements.sort((e1, e2) => {
            let e1dist = e1.distanceTo(targetBounds);
            let e2dist = e2.distanceTo(targetBounds);
            if (e1dist - e2dist !== 0) return e1dist - e2dist;
            let cmpLayer = -World.Actions.getRenderOrder(e1.worldObject, e2.worldObject);
            return cmpLayer;
        });

        return uiElements[0];
    }

    export function distanceTo(x: number, y: number, rect: Rect) {
        if (G.rectContainsPt(rect, tmp.vec2(x, y))) return 0;

        if (rect.x <= x && x <= rect.x + rect.width) {
            return Math.min(Math.abs(rect.y - y), Math.abs(rect.y + rect.height - y));
        }

        if (rect.y <= y && y <= rect.y + rect.height) {
            return Math.min(Math.abs(rect.x - x), Math.abs(rect.x + rect.width - x));
        }

        return Math.min(
            M.distance(x, y, rect.x, rect.y),
            M.distance(x, y, rect.x + rect.width, rect.y),
            M.distance(x, y, rect.x, rect.y + rect.height),
            M.distance(x, y, rect.x + rect.width, rect.y + rect.height),
        );
    }

    export function applyTinting(uiElement: UIElement, state: UIElement.State, tinting: UIElement.Tinting) {
        let tintKey = 'tint';
        if (tinting.scope === 'texture') {
            if (uiElement.worldObject instanceof Sprite) {
                tintKey = 'textureTint';
            } else {
                console.error("Tinting scope is 'texture' but WorldObject is not a Sprite!", uiElement, uiElement.worldObject);
            }
        }

        let color = getStateColor(state, tinting);

        if (color !== undefined) {
            (uiElement.worldObject as any)[tintKey] = color;
        }
    }

    export function applyOutlining(uiElement: UIElement, state: UIElement.State, tinting: UIElement.Tinting) {
        if (!('effects' in uiElement.worldObject) || !(uiElement.worldObject.effects instanceof Effects)) {
            console.error("Outlining applied but WorldObject does not have effects!", uiElement, uiElement.worldObject);
        }

        let color = getStateColor(state, tinting);

        if (color !== undefined) {
            if (color < 0) {
                ((uiElement.worldObject as any).effects as Effects).outline.disable();
            } else {
                ((uiElement.worldObject as any).effects as Effects).outline.enable(color);
            }
        }
    }

    function getStateColor(state: UIElement.State, coloring: UIElement.StateColoring) {
        if (state.disabled) {
            return coloring.disabled;
        }
        if (state.hovered || state.selected) {
            if (state.clickedDown && coloring.clicked !== undefined) return coloring.clicked;
            return coloring.hover;
        }
        return coloring.base;
    }
}
