namespace Camera {
    export type Mode = FollowMode | FocusMode;

    export type FollowMode = {
        type: 'follow';
        target: string | WorldObject;
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

    shakeIntensity: number;
    private _shakeX: number;
    private _shakeY: number;

    private matrix: PIXI.Matrix;
    get rendererMatrix() {
        this.matrix.tx = -(this.x + this._shakeX - this.width/2);
        this.matrix.ty = -(this.y + this._shakeY - this.height/2);
        return this.matrix;
    }

    constructor(width: number, height: number) {
        this.x = width/2;
        this.y = height/2;
        this.width = width;
        this.height = height;

        this.setModeFocus(width/2, height/2);
        this.setMovementSnap();

        this.shakeIntensity = 0;
        this._shakeX = 0;
        this._shakeY = 0;

        this.matrix = new PIXI.Matrix(1, 0, 0, 1, this.x, this.y);
    }

    update() {
        if (this.mode.type === 'follow') {
            let target = this.mode.target;
            if (_.isString(target)) {
                target = global.world.getWorldObjectByName(target);
            }
            this.moveTowardsPoint(target.x + this.mode.offset.x, target.y + this.mode.offset.y);
        } else if (this.mode.type === 'focus') {
            this.moveTowardsPoint(this.mode.point.x, this.mode.point.y);
        }

        if (this.shakeIntensity > 0) {
            let pt = Random.inCircle(this.shakeIntensity);
            this._shakeX = pt.x;
            this._shakeY = pt.y;
        } else {
            this._shakeX = 0;
            this._shakeY = 0;
        }
    }

    moveTowardsPoint(x: number, y: number) {
        if (this.movement.type === 'snap') {
            this.x = x;
            this.y = y;
        } else if (this.movement.type === 'smooth') {
            // TODO: implement smooth movement
            this.x = x;
            this.y = y;
        }
    }

    setModeFollow(target: string | WorldObject, offsetX?: number, offsetY?: number) {
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