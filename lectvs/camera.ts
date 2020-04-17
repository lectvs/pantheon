/// <reference path="./utils/o_object.ts"/>

namespace Camera {
    export type Config = {
        width?: number;
        height?: number;
        bounds?: Bounds;
        mode?: Mode;
        movement?: Movement;
    }

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

    bounds: Bounds;
    mode: Camera.Mode;
    movement: Camera.Movement;

    shakeIntensity: number;
    private _shakeX: number;
    private _shakeY: number;

    get worldOffsetX() { return this.x + this._shakeX - this.width/2; }
    get worldOffsetY() { return this.y + this._shakeY - this.height/2; }

    constructor(config: Camera.Config) {
        _.defaults(config, {
            width: global.gameWidth,
            height: global.gameHeight,
            bounds: { x: -Infinity, y: -Infinity, width: Infinity, height: Infinity },
            mode: { type: 'focus', point: { x: config.width/2, y: config.height/2 } },
            movement: { type: 'snap' },
        });

        this.x = config.width/2;
        this.y = config.height/2;
        this.width = config.width;
        this.height = config.height;

        this.bounds = O.withDefaults(config.bounds, {
            top: -Infinity,
            bottom: Infinity,
            left: -Infinity,
            right: Infinity,
        });
        this.mode = _.clone(config.mode);
        this.movement = _.clone(config.movement);

        this.shakeIntensity = 0;
        this._shakeX = 0;
        this._shakeY = 0;
    }

    update(world: World) {
        if (this.mode.type === 'follow') {
            let target = this.mode.target;
            if (_.isString(target)) {
                target = world.getWorldObjectByName(target);
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

        this.clampToBounds();
    }

    clampToBounds() {
        if (this.bounds.left > -Infinity && this.x - this.width/2 < this.bounds.left) {
            this.x = this.bounds.left + this.width/2;
        }
        if (this.bounds.right < Infinity && this.x + this.width/2 > this.bounds.right) {
            this.x = this.bounds.right - this.width/2;
        }
        if (this.bounds.top > -Infinity && this.y - this.height/2 < this.bounds.top) {
            this.y = this.bounds.top + this.height/2;
        }
        if (this.bounds.bottom < Infinity && this.y + this.height/2 > this.bounds.bottom) {
            this.y = this.bounds.bottom - this.height/2;
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

    setMode(mode: Camera.Mode) {
        this.mode = mode;
    }

    setModeFollow(target: string | WorldObject, offsetX?: number, offsetY?: number) {
        this.setMode({
            type: 'follow',
            target: target,
            offset: { x: offsetX || 0, y: offsetY || 0 },
        });
    }

    setModeFocus(x: number, y: number) {
        this.setMode({
            type: 'focus',
            point: { x: x, y: y },
        });
    }

    setMovement(movement: Camera.Movement) {
        this.movement = movement;
    }

    setMovementSnap() {
        this.setMovement({
            type: 'snap',
        });
    }

    setMovementSmooth(speed: number, deadZoneWidth: number, deadZoneHeight: number) {
        this.setMovement({
            type: 'smooth',
            speed: speed,
            deadZoneWidth: deadZoneWidth,
            deadZoneHeight: deadZoneHeight,
        });
    }
}

namespace Camera {
    export namespace Mode {
        export function FOLLOW(target: string | WorldObject, offsetX?: number, offsetY?: number): FollowMode {
            return { type: 'follow', target, offset: { x: O.getOrDefault(offsetX, 0), y: O.getOrDefault(offsetY, 0) } };
        }
        export function FOCUS(x: number, y: number): FocusMode {
            return { type: 'focus', point: { x, y } };
        }
    }
}