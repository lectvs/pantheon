/// <reference path="../utils/o_object.ts"/>

namespace Camera {
    export type Config = {
        width?: number;
        height?: number;
        bounds?: Boundaries;
        mode?: Mode;
        movement?: Movement;
    }

    export type Mode = {
        getTargetPt: (camera: Camera) => Pt;
        offsetX: number;
        offsetY: number;
    }

    export type Movement = {
        speed: number;
        deadZoneWidth: number;
        deadZoneHeight: number;
    }
}

class Camera {
    readonly world: World;

    x: number;
    y: number;
    width: number;
    height: number;

    bounds: Boundaries;
    mode: Camera.Mode;
    movement: Camera.Movement;

    shakeIntensity: number;
    private _shakeX: number;
    private _shakeY: number;

    private debugOffsetX: number;
    private debugOffsetY: number;

    get worldOffsetX() { return this.x - this.width/2 + this._shakeX + this.debugOffsetX; }
    get worldOffsetY() { return this.y - this.height/2 + this._shakeY + this.debugOffsetY; }

    constructor(config: Camera.Config, world: World) {
        this.world = world;

        this.width = config.width ?? global.gameWidth;
        this.height = config.height ?? global.gameHeight;

        this.bounds = O.withDefaults(config.bounds ?? {}, {
            top: -Infinity,
            bottom: Infinity,
            left: -Infinity,
            right: Infinity,
        });
        this.mode = _.clone(config.mode) ?? Camera.Mode.FOCUS(this.width/2, this.height/2);
        this.movement = _.clone(config.movement) ?? Camera.Movement.SNAP();

        this.shakeIntensity = 0;
        this._shakeX = 0;
        this._shakeY = 0;
        this.debugOffsetX = 0;
        this.debugOffsetY = 0;

        this.initPosition();
    }

    update() {
        let target = this.mode.getTargetPt(this);
        this.moveTowardsPoint(target.x + this.mode.offsetX, target.y + this.mode.offsetY);

        if (this.shakeIntensity > 0) {
            let pt = Random.inCircle(this.shakeIntensity);
            this._shakeX = pt.x;
            this._shakeY = pt.y;
        } else {
            this._shakeX = 0;
            this._shakeY = 0;
        }

        this.clampToBounds();

        if (Debug.MOVE_CAMERA_WITH_ARROWS && global.theater && this.world === global.theater.currentWorld) {
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_LEFT))  this.debugOffsetX -= 1;
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_RIGHT)) this.debugOffsetX += 1;
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_UP))    this.debugOffsetY -= 1;
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_DOWN))  this.debugOffsetY += 1;
        }
    }

    private clampToBounds() {
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

    private moveTowardsPoint(x: number, y: number) {
        let hw = this.movement.deadZoneWidth/2;
        let hh = this.movement.deadZoneHeight/2;
        let dx = x - this.x;
        let dy = y - this.y;

        if (Math.abs(dx) > hw) {
            let tx = Math.abs(hw / dx);
            let targetx = this.x + (1-tx)*dx;
            this.x = M.lerpTime(this.x, targetx, this.movement.speed, this.world.delta);
        }

        if (Math.abs(dy) > hh) {
            let ty = Math.abs(hh / dy);
            let targety = this.y + (1-ty)*dy;
            this.y = M.lerpTime(this.y, targety, this.movement.speed, this.world.delta);
        }
    }
    
    initPosition() {
        let target = this.mode.getTargetPt(this);
        this.x = target.x;
        this.y = target.y;
    }

    setMode(mode: Camera.Mode) {
        this.mode = mode;
    }

    setModeFocus(x: number, y: number) {
        this.setMode(Camera.Mode.FOCUS(x, y));
    }

    setModeFollow(target: string | Pt, offsetX: number = 0, offsetY: number = 0) {
        this.setMode(Camera.Mode.FOLLOW(target, offsetX, offsetY));
    }

    setMovement(movement: Camera.Movement) {
        this.movement = movement;
    }

    setMovementSnap() {
        this.setMovement(Camera.Movement.SNAP());
    }

    setMovementSmooth(speed: number, deadZoneWidth: number = 0, deadZoneHeight: number = 0) {
        this.setMovement(Camera.Movement.SMOOTH(speed, deadZoneWidth, deadZoneHeight));
    }
}

namespace Camera {
    export namespace Mode {
        export function FOLLOW(target: string | Pt, offsetX: number = 0, offsetY: number = 0): Mode {
            return {
                getTargetPt: (camera: Camera) => {
                    if (_.isString(target)) {
                        let worldObject = camera.world.select.name(target, false);
                        return worldObject ?? pt(camera.x, camera.y);
                    }
                    return target;
                },
                offsetX,
                offsetY,
            };
        }
        export function FOCUS(x: number, y: number): Mode {
            let focusPt = pt(x, y);
            return {
                getTargetPt: (camera: Camera) => focusPt,
                offsetX: 0,
                offsetY: 0,
            };
        }
    }

    export namespace Movement {
        export function SNAP(): Movement {
            return {
                speed: Infinity,
                deadZoneWidth: 0,
                deadZoneHeight: 0,
            };
        }

        export function SMOOTH(speed: number, deadZoneWidth: number = 0, deadZoneHeight: number = 0): Movement {
            return {
                speed: speed,
                deadZoneWidth: deadZoneWidth,
                deadZoneHeight: deadZoneHeight,
            };
        }
    }
}