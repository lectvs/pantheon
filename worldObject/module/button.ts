/// <reference path="./module.ts" />

namespace Button {
    export type Config = {
        onClick: () => void;
        hoverTint: number;
        clickTint: number;
        baseTint?: number;
        onHover?: () => void;
        enabled?: boolean;
    }

    export type CompatibleWorldObject = WorldObject & {
        bounds: Bounds;
        tint: number;
    }
}

class Button extends Module<WorldObject> {
    onClick: () => void;
    onHover: () => void;
    hoverTint: number;
    clickTint: number;
    baseTint: number;

    enabled: boolean;

    private clickedDownOn: boolean = false;

    get worldObject() { return <Button.CompatibleWorldObject>this._worldObject; }

    constructor(config: Button.Config) {
        super(WorldObject);

        this.onClick = config.onClick;
        this.onHover = config.onHover;
        this.hoverTint = config.hoverTint;
        this.clickTint = config.clickTint;
        this.baseTint = config.baseTint ?? 0xFFFFFF;
        this.enabled = config.enabled ?? true;
    }

    update() {
        super.update();

        let hovered = this.isHovered();
        let clicked = this.clickedDownOn && Input.isDown(Input.GAME_SELECT);
        
        this.worldObject.tint = hovered ? (clicked ? this.clickTint : this.hoverTint) : this.baseTint;

        if (hovered && this.onHover) {
            this.onHover();
        }

        if (hovered && Input.justDown(Input.GAME_SELECT)) {
            if (hovered) this.clickedDownOn = true;
        }

        if (Input.justUp(Input.GAME_SELECT)) {
            if (hovered && this.clickedDownOn) {
                this.click();
            }
            this.clickedDownOn = false;
        }
    }

    click() {
        this.onClick();
    }

    isHovered() {
        if (!this.enabled) return false;

        let mouseBounds = this.worldObject.world.getWorldMouseBounds();

        if (!this.worldObject.bounds.isOverlapping(mouseBounds)) return false;

        if (IS_MOBILE) {
            return Button.getClosestButton(mouseBounds, this.worldObject.world) === this;
        }
        
        return true;
    }
}

namespace Button {
    export function getClosestButton(targetBounds: CircleBounds, world: World) {
        let buttons = world.select.modules(Button).filter(button => button.worldObject.isActive() && button.enabled && button.worldObject.bounds.isOverlapping(targetBounds));
        return M.argmin(buttons, button => distanceTo(targetBounds.x, targetBounds.y, button.worldObject.bounds.getBoundingBox()));
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