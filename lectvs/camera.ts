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

    private debugOffsetX: number;
    private debugOffsetY: number;
    private preRenderStoredX: number;
    private preRenderStoredY: number;

    get worldOffsetX() { return this.x - this.width/2; }
    get worldOffsetY() { return this.y - this.height/2; }

    constructor(config: Camera.Config, world: World) {
        _.defaults(config, {
            width: global.gameWidth,
            height: global.gameHeight,
            bounds: { x: -Infinity, y: -Infinity, width: Infinity, height: Infinity },
            movement: { type: 'snap' },
        });
        _.defaults(config, {
            // Needs to use new values for config
            mode: { type: 'focus', point: { x: config.width/2, y: config.height/2 } },
        });
        
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
        this.debugOffsetX = 0;
        this.debugOffsetY = 0;

        this.initPosition(world);
    }

    update(world: World, delta: number) {
        if (this.mode.type === 'follow') {
            let target = this.mode.target;
            if (_.isString(target)) {
                target = world.getWorldObjectByName(target);
            }
            this.moveTowardsPoint(target.x + this.mode.offset.x, target.y + this.mode.offset.y, delta);
        } else if (this.mode.type === 'focus') {
            this.moveTowardsPoint(this.mode.point.x, this.mode.point.y, delta);
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

        if (Debug.MOVE_CAMERA_WITH_ARROWS && global.theater && world === global.theater.currentWorld) {
            if (Input.isDown('debugMoveCameraLeft'))  this.debugOffsetX -= 1;
            if (Input.isDown('debugMoveCameraRight')) this.debugOffsetX += 1;
            if (Input.isDown('debugMoveCameraUp'))    this.debugOffsetY -= 1;
            if (Input.isDown('debugMoveCameraDown'))  this.debugOffsetY += 1;
        }
    }

    preRender(world: World) {
        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;

        this.x += this._shakeX;
        this.y += this._shakeY;

        if (Debug.MOVE_CAMERA_WITH_ARROWS && global.theater && world === global.theater.currentWorld) {
            this.x += this.debugOffsetX;
            this.y += this.debugOffsetY;
        }

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }

    postRender() {
        this.x = this.preRenderStoredX;
        this.y = this.preRenderStoredY;
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

    initPosition(world: World) {
        if (this.mode.type === 'follow') {
            let target = this.mode.target;
            if (_.isString(target)) {
                target = world.getWorldObjectByName(target);
            }
            this.x = target.x + this.mode.offset.x;
            this.y = target.y + this.mode.offset.y;
        } else if (this.mode.type === 'focus') {
            this.x = this.mode.point.x;
            this.y = this.mode.point.y;
        }
    }

    moveTowardsPoint(x: number, y: number, delta: number) {
        if (this.movement.type === 'snap') {
            this.x = x;
            this.y = y;
        } else if (this.movement.type === 'smooth') {
            let hw = this.movement.deadZoneWidth/2;
            let hh = this.movement.deadZoneHeight/2;
            let dx = x - this.x;
            let dy = y - this.y;

            if (Math.abs(dx) > hw) {
                let tx = Math.abs(hw / dx);
                let targetx = this.x + (1-tx)*dx;
                this.x = M.lerp(this.x, targetx, 0.25);
            }

            if (Math.abs(dy) > hh) {
                let ty = Math.abs(hh / dy);
                let targety = this.y + (1-ty)*dy;
                this.y = M.lerp(this.y, targety, 0.25);
            }
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

    setMovementSmooth(deadZoneWidth: number = 0, deadZoneHeight: number = 0) {
        this.setMovement({
            type: 'smooth',
            deadZoneWidth: deadZoneWidth,
            deadZoneHeight: deadZoneHeight,
        });
    }
}

namespace Camera {
    export namespace Mode {
        export function FOLLOW(target: string | WorldObject, offsetX: number = 0, offsetY: number = 0): FollowMode {
            return { type: 'follow', target, offset: { x: offsetX, y: offsetY } };
        }
        export function FOCUS(x: number, y: number): FocusMode {
            return { type: 'focus', point: { x, y } };
        }
    }
}