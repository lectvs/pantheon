/// <reference path="../../worldObject/worldObject.ts" />

class Balancer extends WorldObject {
    private anchor: Vector2;
    private balanceBy: 'balance_by_position' | 'balance_by_visual_bounds';
    private deep: boolean;

    constructor(anchor: Pt, balanceBy: 'balance_by_position' | 'balance_by_visual_bounds', deep?: 'deep') {
        super();
        this.anchor = vec2(anchor);
        this.balanceBy = balanceBy;
        this.deep = deep === 'deep';
    }

    override postUpdate(): void {
        super.postUpdate();

        let balance = this.balanceBy === 'balance_by_position'
            ? World.Actions.balanceWorldObjectsByPosition
            : World.Actions.balanceWorldObjectsByVisualBounds;

        balance(this.children, this.x, this.y, this.anchor, this.deep);
    }
}