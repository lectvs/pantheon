namespace UIElement {
    export type Config = {
        onClick?: Callback;
        onHover?: Callback;
        onJustHovered?: Callback;
        onUnhover?: Callback;
        onJustUnhovered?: Callback;
        onClickedDown?: Callback;
        onJustClickedDown?: Callback;

        canInteract?: () => boolean;
        enabled?: boolean;

        blockLevel?: number;
    }

    export type Callback = (this: UIElement) => void;
}

class UIElement extends Module<WorldObject> {
    onClick: UIElement.Callback;
    onHover: UIElement.Callback;
    onJustHovered: UIElement.Callback;
    onUnhover: UIElement.Callback;
    onJustUnhovered: UIElement.Callback;
    onClickedDown: UIElement.Callback;
    onJustClickedDown: UIElement.Callback;

    canInteract: () => boolean;
    enabled: boolean;
    blockLevel: number;

    private lastHovered: boolean = false;
    private lastClickedDown: boolean = false;
    private clickedDown: boolean = false;

    constructor(config: UIElement.Config) {
        super(WorldObject);

        this.onClick = config.onClick ?? Utils.NOOP;
        this.onHover = config.onHover ?? Utils.NOOP;
        this.onJustHovered = config.onJustHovered ?? Utils.NOOP;
        this.onUnhover = config.onUnhover ?? Utils.NOOP;
        this.onJustUnhovered = config.onJustUnhovered ?? Utils.NOOP;
        this.onClickedDown = config.onClickedDown ?? Utils.NOOP;
        this.onJustClickedDown = config.onJustClickedDown ?? Utils.NOOP;

        this.canInteract = config.canInteract ?? (() => true);
        this.enabled = config.enabled ?? true;
        this.blockLevel = config.blockLevel ?? 0;
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
        
        if (hovered) {
            this.onHover();
            if (!this.lastHovered) {
                this.onJustHovered();
            }
            if (this.clickedDown) {
                this.onClickedDown();
                if (!this.lastClickedDown) {
                    this.onJustClickedDown();
                }
            }
        } else {
            this.onUnhover();
            if (this.lastHovered) {
                this.onJustUnhovered();
            }
        }

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

        if (!this.isOverlappingMouse()) return false;

        let mouseBounds = this.worldObject.world.getWorldMouseBounds$();
        return UIElement.getClosestUIElement(mouseBounds, this.worldObject.world) === this;
    }

    isOverlappingMouse() {
        if (!this.worldObject.world) return false;
        let mouseBounds = this.worldObject.world.getWorldMouseBounds$();
        return this.getInteractBounds().overlaps(mouseBounds);
    }

    private localBounds = new RectBounds(0, 0, 0, 0);
    getInteractBounds() {
        if ('bounds' in this.worldObject && (this.worldObject.bounds as Bounds).overlaps) {
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
                                        && uiElement.getInteractBounds().overlaps(targetBounds));
        
        if (A.isEmpty(uiElements)) {
            return undefined;
        }

        uiElements.sort((e1, e2) => {
            let cmpLayer = -World.Actions.getRenderOrder(e1.worldObject, e2.worldObject);
            if (cmpLayer !== 0) return cmpLayer;
            let e1dist = distanceTo(targetBounds.x, targetBounds.y, e1.getInteractBounds().getBoundingBox$());
            let e2dist = distanceTo(targetBounds.x, targetBounds.y, e2.getInteractBounds().getBoundingBox$());
            return e1dist - e2dist;
        });

        return uiElements[0];
    }

    function distanceTo(x: number, y: number, rect: Rect) {
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
