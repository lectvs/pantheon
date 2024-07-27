namespace UIElement {
    export type Config = {
        onClick?: Callback;
        onUpdate?: UpdateCallback;
        onJustHovered?: Callback;
        onJustUnhovered?: Callback;
        onJustClickedDown?: Callback;
        onJustUnClickedDown?: Callback;

        canInteract?: () => boolean;
        enabled?: boolean;

        blockLevel?: number;

        tinting?: {
            base?: number;
            hover?: number;
            clicked?: number;
        };
    }

    export type Callback = (this: UIElement) => void;
    export type UpdateCallback = (this: UIElement, hovered: boolean, clickedDown: boolean) => void;
}

class UIElement extends Module<WorldObject> {
    onClick: UIElement.Callback;
    onUpdate: UIElement.UpdateCallback;
    onJustHovered: UIElement.Callback;
    onJustUnhovered: UIElement.Callback;
    onJustClickedDown: UIElement.Callback;
    onJustUnClickedDown: UIElement.Callback;

    canInteract: () => boolean;
    enabled: boolean;
    blockLevel: number;

    tintingEnabled: boolean;
    baseTint?: number;
    hoverTint?: number;
    clickTint?: number;

    private lastHovered: boolean = false;
    private lastClickedDown: boolean = false;
    private clickedDown: boolean = false;

    constructor(config: UIElement.Config) {
        super(WorldObject);

        this.onClick = config.onClick ?? Utils.NOOP;
        this.onUpdate = config.onUpdate ?? Utils.NOOP;
        this.onJustHovered = config.onJustHovered ?? Utils.NOOP;
        this.onJustUnhovered = config.onJustUnhovered ?? Utils.NOOP;
        this.onJustClickedDown = config.onJustClickedDown ?? Utils.NOOP;
        this.onJustUnClickedDown = config.onJustUnClickedDown ?? Utils.NOOP;

        this.canInteract = config.canInteract ?? (() => true);
        this.enabled = config.enabled ?? true;
        this.blockLevel = config.blockLevel ?? 0;

        this.tintingEnabled = !!config.tinting;
        if (config.tinting) {
            this.baseTint = config.tinting.base;
            this.hoverTint = config.tinting.hover;
            this.clickTint = config.tinting.clicked;
        }
    }

    override init(worldObject: WorldObject): void {
        super.init(worldObject);

        if (this.baseTint === undefined && 'tint' in this.worldObject && M.isNumber(this.worldObject.tint)) {
            this.baseTint = this.worldObject.tint;
        }
    }

    override update(): void {
        super.update();

        let hovered = this.isHovered();

        if (hovered && Input.justDown(Input.GAME_SELECT)) {
            this.clickedDown = true;
        }

        if (Input.justUp(Input.GAME_SELECT)) {
            if (hovered && this.clickedDown) {
                this.click();
            }
            this.clickedDown = false;
        }

        if (this.tintingEnabled && 'tint' in this.worldObject) {
            if (hovered) {
                if (this.clickedDown) {
                    if (this.clickTint !== undefined) this.worldObject.tint = this.clickTint;
                } else {
                    if (this.hoverTint !== undefined) this.worldObject.tint = this.hoverTint;
                }
            } else {
                if (this.baseTint !== undefined) this.worldObject.tint = this.baseTint;
            }
        }
        
        if (hovered) {
            if (!this.lastHovered) {
                this.onJustHovered();
            }
        } else {
            if (this.lastHovered) {
                this.onJustUnhovered();
            }
        }

        if (hovered && this.clickedDown) {
            if (!this.lastClickedDown) {
                this.onJustClickedDown();
            }
        } else {
            if (this.lastClickedDown) {
                this.onJustUnClickedDown();
            }
        }

        this.onUpdate(hovered, this.clickedDown);

        this.lastHovered = hovered;
        this.lastClickedDown = this.clickedDown;
    }

    click() {
        this.onClick();
    }

    isHovered() {
        if (!this.enabled) return false;
        if (!this.canInteract()) return false;
        if (!this.worldObject.world) return false;

        let mouseBounds = this.worldObject.world.getWorldMouseBounds$();

        if (!this.isOverlapping(mouseBounds)) return false;

        return UIElement.getClosestUIElement(mouseBounds, this.worldObject.world) === this;
    }

    isOverlapping(bounds: Bounds) {
        let boundsX = bounds.x;
        let boundsY = bounds.y;

        if (this.worldObject.shouldIgnoreCamera() && this.worldObject.world) {
            bounds.x -= this.worldObject.world.camera.worldOffsetX;
            bounds.y -= this.worldObject.world.camera.worldOffsetY;
        }

        let result = this.getInteractBounds$().overlaps(bounds);

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

        let result = UIElement.distanceTo(bounds.x, bounds.y, this.getInteractBounds$().getBoundingBox$());

        bounds.x = boundsX;
        bounds.y = boundsY;

        return result;
    }

    private localBounds = new RectBounds(0, 0, 0, 0);
    getInteractBounds$() {
        if ('bounds' in this.worldObject && (this.worldObject.bounds as Bounds).overlaps && !(this.worldObject.bounds instanceof NullBounds)) {
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
}

namespace UIElement {
    export function getClosestUIElement(targetBounds: CircleBounds, world: World) {
        let uiElements = world.select.modules$(UIElement);
        let maxBlockLevel = M.max(uiElements, uiElement => uiElement.blockLevel);

        uiElements.filterInPlace(uiElement => uiElement.enabled
                                        && uiElement.blockLevel >= maxBlockLevel
                                        && uiElement.worldObject.isActive()
                                        && uiElement.canInteract()
                                        && uiElement.isOverlapping(targetBounds));
        
        if (A.isEmpty(uiElements)) {
            return undefined;
        }

        uiElements.sort((e1, e2) => {
            let cmpLayer = -World.Actions.getRenderOrder(e1.worldObject, e2.worldObject);
            if (cmpLayer !== 0) return cmpLayer;
            let e1dist = e1.distanceTo(targetBounds);
            let e2dist = e2.distanceTo(targetBounds);
            return e1dist - e2dist;
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
}
