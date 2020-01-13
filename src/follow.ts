namespace Follow {
    export type Target = string | Pt;
}

class Follow {
    target: Follow.Target;
    maxDistance: number;

    private targetHistory: number[];
    private moveThreshold: number;

    constructor(target: Follow.Target, maxDistance: number, moveThreshold: number = 2) {
        this.target = target;
        this.maxDistance = maxDistance;

        this.targetHistory = [];
        this.moveThreshold = moveThreshold;
    }

    update(sprite: Sprite) {
        this.attemptToResolveTarget(sprite);
        this.pushTargetPosition();

        let dist = 0;
        let i = 0;
        for (i = this.targetHistory.length - 4; i >= 0 && dist < this.maxDistance; i -= 2) {
            let p1 = { x: this.targetHistory[i+0], y: this.targetHistory[i+1] };
            let p2 = { x: this.targetHistory[i+2], y: this.targetHistory[i+3] };
            dist += M.distance(p1, p2);
        }

        if (i >= 0) {
            this.targetHistory.splice(0, i);
        }

        if (!_.isEmpty(this.targetHistory)) {
            let dx = this.targetHistory[0] - sprite.x;
            let dy = this.targetHistory[1] - sprite.y;
            if (dx >= this.moveThreshold) sprite.controller.right = true;
            else if (dx <= -this.moveThreshold) sprite.controller.left = true;
            if (dy >= this.moveThreshold) sprite.controller.down = true;
            else if (dy <= -this.moveThreshold) sprite.controller.up = true;
        }
    }

    renderTrail(screen: Texture) {
        for (let i = 0; i < this.targetHistory.length-1; i += 2) {
            Draw.brush.color = 0x00FF00;
            Draw.brush.alpha = 1;
            Draw.pixel(screen, this.targetHistory[i], this.targetHistory[i+1]);
        }
    }

    private attemptToResolveTarget(sprite: Sprite) {
        if (_.isString(this.target)) {
            this.target = sprite.world.worldObjectsByName[this.target] || this.target;
        }
    }

    private pushTargetPosition() {
        if (_.isString(this.target)) return;

        if (_.isEmpty(this.targetHistory)
                || this.target.x !== this.targetHistory[this.targetHistory.length-2]
                || this.target.y !== this.targetHistory[this.targetHistory.length-1]) {
            this.targetHistory.push(this.target.x, this.target.y);
        }
    }
}