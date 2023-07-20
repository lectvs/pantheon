/// <reference path="./module.ts" />

namespace Button {
    export type Config = {
        onClick?: Callback;
        onHover?: Callback;
        onJustHovered?: Callback;
        onUnhover?: Callback;
        onJustUnhovered?: Callback;
        onClickedDown?: Callback;
        onJustClickedDown?: Callback;

        canHover?: () => boolean;

        hoverTint?: number;
        clickTint?: number;
        baseTint?: number;

        priority?: number;
        enabled?: boolean;
    }

    export type CompatibleWorldObject = WorldObject & {
        bounds: Bounds;
        tint: number;
    }

    export type Callback = (this: Button) => void;
}

class Button extends Module<WorldObject> {
    onClick: Button.Callback;
    onHover: Button.Callback;
    onJustHovered: Button.Callback;
    onUnhover: Button.Callback;
    onJustUnhovered: Button.Callback;
    onClickedDown: Button.Callback;
    onJustClickedDown: Button.Callback;

    canHover: () => boolean;

    hoverTint?: number;
    clickTint?: number;
    baseTint?: number;

    priority: number;
    enabled: boolean;

    private lastHovered: boolean = false;
    private lastClickedDown: boolean = false;
    private clickedDown: boolean = false;

    get worldObject() { return <Button.CompatibleWorldObject>this._worldObject; }

    constructor(config: Button.Config) {
        super(WorldObject);

        this.onClick = config.onClick ?? Utils.NOOP;
        this.onHover = config.onHover ?? Utils.NOOP;
        this.onJustHovered = config.onJustHovered ?? Utils.NOOP;
        this.onUnhover = config.onUnhover ?? Utils.NOOP;
        this.onJustUnhovered = config.onJustUnhovered ?? Utils.NOOP;
        this.onClickedDown = config.onClickedDown ?? Utils.NOOP;
        this.onJustClickedDown = config.onJustClickedDown ?? Utils.NOOP;
        this.canHover = config.canHover ?? (() => true);
        this.hoverTint = config.hoverTint;
        this.clickTint = config.clickTint;
        this.baseTint = config.baseTint;
        this.priority = config.priority ?? 0;
        this.enabled = config.enabled ?? true;
    }

    init(worldObject: WorldObject): void {
        super.init(worldObject);

        if (this.baseTint === undefined) {
            this.baseTint = this.worldObject.tint;
        }
    }

    update() {
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
            if (this.clickedDown) {
                if (this.clickTint !== undefined) this.worldObject.tint = this.clickTint;
            } else {
                if (this.hoverTint !== undefined) this.worldObject.tint = this.hoverTint;
            }
        } else {
            if (this.baseTint !== undefined) this.worldObject.tint = this.baseTint;
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
        if (!this.canHover()) return false;

        if (!this.isOverlappingMouse()) return false;

        let mouseBounds = this.worldObject.world.getWorldMouseBounds();
        return Button.getClosestButton(mouseBounds, this.worldObject.world) === this;
    }

    isOverlappingMouse() {
        let mouseBounds = this.worldObject.world.getWorldMouseBounds();
        return this.worldObject.bounds.isOverlapping(mouseBounds);
    }
}

namespace Button {
    export function getClosestButton(targetBounds: CircleBounds, world: World) {
        let buttons = world.select.modules(Button).filter(button => button.worldObject.isActive() && button.enabled && button.worldObject.bounds.isOverlapping(targetBounds) && button.canHover());
        if (_.isEmpty(buttons)) {
            return undefined;
        }

        buttons.sort((b1, b2) => {
            if (b1.priority !== b2.priority) return b2.priority - b1.priority;
            let b1dist = distanceTo(targetBounds.x, targetBounds.y, b1.worldObject.bounds.getBoundingBox());
            let b2dist = distanceTo(targetBounds.x, targetBounds.y, b2.worldObject.bounds.getBoundingBox());
            return b1dist - b2dist;
        });
        return buttons[0];
    }

    function distanceTo(x: number, y: number, rect: Rect) {
        if (G.rectContainsPt(rect, vec2(x, y))) return 0;

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