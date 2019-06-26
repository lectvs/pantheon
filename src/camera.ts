namespace Camera {
    export type Mode = FollowMode | FocusMode;

    export type FollowMode = {
        type: 'follow';
        target: WorldObject;
        offset: Pt;
    }

    export type FocusMode = {
        type: 'focus';
        point: Pt;
    }

    export type Movement = SnapMovement | SmoothMovement;

    export type SnapMovement = {
        type: 'snap';
    }

    export type SmoothMovement = {
        type: 'smooth';
        speed: number;
        deadZoneWidth: number;
        deadZoneHeight: number;
    }
}

class Camera {
    x: number;
    y: number;
    width: number;
    height: number;

    mode: Camera.Mode;
    movement: Camera.Movement;

    private matrix: PIXI.Matrix;
    get rendererMatrix() {
        this.matrix.tx = -(this.x - this.width/2);
        this.matrix.ty = -(this.y - this.height/2);
        return this.matrix;
    }

    constructor(width: number, height: number) {
        this.x = width/2;
        this.y = height/2;
        this.width = width;
        this.height = height;

        this.setModeFocus(width/2, height/2);
        this.setMovementSnap();

        this.matrix = new PIXI.Matrix(1, 0, 0, 1, this.x, this.y);
    }

    update(options: UpdateOptions) {
        if (this.mode.type === 'follow') {
            this.moveTowardsPoint(this.mode.target.x + this.mode.offset.x, this.mode.target.y + this.mode.offset.y, options);
        } else if (this.mode.type === 'focus') {
            this.moveTowardsPoint(this.mode.point.x, this.mode.point.y, options);
        }
    }

    moveTowardsPoint(x: number, y: number, options: UpdateOptions) {
        if (this.movement.type === 'snap') {
            this.x = x;
            this.y = y;
        } else if (this.movement.type === 'smooth') {
            // TODO: implement smooth movement
            this.x = x;
            this.y = y;
        }
    }

    setModeFollow(target: WorldObject, offsetX?: number, offsetY?: number) {
        this.mode = {
            type: 'follow',
            target: target,
            offset: { x: offsetX || 0, y: offsetY || 0 },
        };
    }

    setModeFocus(x: number, y: number) {
        this.mode = {
            type: 'focus',
            point: { x: x, y: y },
        };
    }

    setMovementSnap() {
        this.movement = {
            type: 'snap',
        };
    }

    setMovementSmooth(speed: number, deadZoneWidth: number, deadZoneHeight: number) {
        this.movement = {
            type: 'smooth',
            speed: speed,
            deadZoneWidth: deadZoneWidth,
            deadZoneHeight: deadZoneHeight,
        };
    }
}