/// <reference path="./module.ts" />

namespace Button {
    export type Config = {
        onClick?: Callback;
        onHover?: Callback;
        onJustHover?: Callback;
        onUnHover?: Callback;
        onJustUnHover?: Callback;
        onClickedDown?: Callback;
        onJustClickedDown?: Callback;
        onUnClickedDown?: Callback;
        onJustUnClickedDown?: Callback;

        canHover?: () => boolean;

        enableTinting?: boolean;
        hoverTint?: number;
        clickTint?: number;
        baseTint?: number;

        priority?: number;
        enabled?: boolean;
    }

    export type CompatibleWorldObject = WorldObject & {
        tint: number;
    }

    export type Callback = (this: Button) => void;
}

class Button extends Module<WorldObject> {
    onClick: Button.Callback;
    onHover: Button.Callback;
    onJustHover: Button.Callback;
    onUnHover: Button.Callback;
    onJustUnHover: Button.Callback;
    onClickedDown: Button.Callback;
    onJustClickedDown: Button.Callback;
    onUnClickedDown: Button.Callback;
    onJustUnClickedDown: Button.Callback;

    canHover: () => boolean;

    enableTinting: boolean;
    hoverTint?: number;
    clickTint?: number;
    baseTint?: number;

    priority: number;
    enabled: boolean;

    private lastHovered: boolean = false;
    private lastClickedDown: boolean = false;
    private clickedDown: boolean = false;

    private bounds: RectBounds;

    override get worldObject() { return <Button.CompatibleWorldObject>this._worldObject; }

    constructor(config: Button.Config) {
        super(WorldObject);

        this.onClick = config.onClick ?? Utils.NOOP;
        this.onHover = config.onHover ?? Utils.NOOP;
        this.onJustHover = config.onJustHover ?? Utils.NOOP;
        this.onUnHover = config.onUnHover ?? Utils.NOOP;
        this.onJustUnHover = config.onJustUnHover ?? Utils.NOOP;
        this.onClickedDown = config.onClickedDown ?? Utils.NOOP;
        this.onJustClickedDown = config.onJustClickedDown ?? Utils.NOOP;
        this.onUnClickedDown = config.onUnClickedDown ?? Utils.NOOP;
        this.onJustUnClickedDown = config.onJustUnClickedDown ?? Utils.NOOP;
        this.canHover = config.canHover ?? (() => true);
        this.enableTinting = config.enableTinting ?? true;
        this.hoverTint = config.hoverTint;
        this.clickTint = config.clickTint;
        this.baseTint = config.baseTint;
        this.priority = config.priority ?? 0;
        this.enabled = config.enabled ?? true;
        this.bounds = new RectBounds(0, 0, 0, 0);
    }

    override init(worldObject: WorldObject): void {
        super.init(worldObject);

        if (this.baseTint === undefined) {
            this.baseTint = this.worldObject.tint;
        }

        this.bounds.parent = worldObject;
    }

    override update() {
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
        
        if (this.enableTinting) {
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
            this.onHover();
            if (!this.lastHovered) {
                this.onJustHover();
            }
            if (this.clickedDown) {
                this.onClickedDown();
                if (!this.lastClickedDown) {
                    this.onJustClickedDown();
                }
            }
        } else {
            this.onUnHover();
            if (this.lastHovered) {
                this.onJustUnHover();
            }
        }

        if (hovered) {
            this.onHover();
        } else {
            this.onUnHover();
        }

        if (hovered && !this.lastHovered) {
            this.onJustHover();
        }

        this.lastHovered = hovered;
        this.lastClickedDown = this.clickedDown;
    }

    click() {
        this.onClick();
    }

    getBounds$() {
        let localBounds = this.worldObject.getVisibleLocalBounds$();
        let worldObjectBounds = (this.worldObject as any).bounds as Bounds | undefined;
        if ((!worldObjectBounds || worldObjectBounds instanceof NullBounds) && localBounds) {
            this.bounds.x = localBounds.x;
            this.bounds.y = localBounds.y;
            this.bounds.width = localBounds.width;
            this.bounds.height = localBounds.height;
            return this.bounds;
        }
        if (worldObjectBounds) {
            return worldObjectBounds;
        }
        console.error('Object not compatible with Button:', this.worldObject);
        return this.bounds;
    }

    isHovered() {
        if (!this.enabled) return false;
        if (!this.canHover()) return false;
        if (!this.worldObject.world) return false;

        if (!this.isOverlappingMouse()) return false;

        let mouseBounds = this.worldObject.world.getWorldMouseBounds$();
        return Button.getClosestButton(mouseBounds, this.worldObject.world) === this;
    }

    isClickedDown() {
        return this.clickedDown;
    }

    isOverlappingMouse() {
        if (!this.worldObject.world) return false;
        let mouseBounds = this.worldObject.world.getWorldMouseBounds$();
        return this.getBounds$().overlaps(mouseBounds);
    }
}

namespace Button {
    export function getClosestButton(targetBounds: CircleBounds, world: World) {
        let buttons = world.select.modules$(Button).filterInPlace(button => button.worldObject.isActive() && button.enabled && button.getBounds$().overlaps(targetBounds) && button.canHover());
        if (A.isEmpty(buttons)) {
            return undefined;
        }

        buttons.sort((b1, b2) => {
            if (b1.priority !== b2.priority) return b2.priority - b1.priority;
            let b1dist = distanceTo(targetBounds.x, targetBounds.y, b1.getBounds$().getBoundingBox$());
            let b2dist = distanceTo(targetBounds.x, targetBounds.y, b2.getBounds$().getBoundingBox$());
            return b1dist - b2dist;
        });
        return buttons[0];
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