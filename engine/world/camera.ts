/// <reference path="../utils/o_object.ts"/>

namespace Camera {
    export type Config = {
        width?: number;
        height?: number;
        bounds?: Bndries;
        mode?: Mode;
        movement?: Movement;
        screenShakePhysicallyMovesCamera?: boolean;
    }

    export type Mode = {
        getTargetPt: (camera: Camera) => Pt;
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

    bounds: Bndries;
    mode: Camera.Mode;
    movement: Camera.Movement;

    // Readonly because world only sets the screen shake filter once.
    readonly screenShakePhysicallyMovesCamera: boolean;
    shakeIntensity: number;
    private _shakeX: number;
    get shakeX() { return this._shakeX; }
    private _shakeY: number;
    get shakeY() { return this._shakeY; }

    waverIntensityX: number;
    waverIntensityY: number;
    waverSpeed: number;
    private _waverX: number;
    private _waverY: number;
    private waverPerlin: Perlin;

    private debugOffsetX: number;
    private debugOffsetY: number;

    get width() { return this.world.getScreenWidth(); }
    get height() { return this.world.getScreenHeight(); }
    get worldOffsetX() { return this.left + this._waverX + this.debugOffsetX + (this.screenShakePhysicallyMovesCamera ? this.shakeX : 0); }
    get worldOffsetY() { return this.top + this._waverY + this.debugOffsetY + (this.screenShakePhysicallyMovesCamera ? this.shakeY : 0); }

    get left() { return this.x - this.width/2; }
    get right() { return this.x + this.width/2; }
    get top() { return this.y - this.height/2; }
    get bottom() { return this.y + this.height/2; }

    constructor(config: Camera.Config, world: World) {
        this.world = world;

        this.x = 0;
        this.y = 0;

        this.bounds = O.withDefaults(config.bounds ?? {}, {
            top: -Infinity,
            bottom: Infinity,
            left: -Infinity,
            right: Infinity,
        });
        this.mode = config.mode ? O.clone(config.mode) : Camera.Mode.FOCUS(this.width/2, this.height/2);
        this.movement = config.movement ? O.clone(config.movement) : Camera.Movement.SNAP();

        this.screenShakePhysicallyMovesCamera = config.screenShakePhysicallyMovesCamera ?? true;
        this.shakeIntensity = 0;
        this._shakeX = 0;
        this._shakeY = 0;

        this.waverIntensityX = 0;
        this.waverIntensityY = 0;
        this.waverSpeed = 1;
        this._waverX = 0;
        this._waverY = 0;
        this.waverPerlin = new Perlin();

        this.debugOffsetX = 0;
        this.debugOffsetY = 0;

        this.snapPosition();
    }

    update() {
        let target = this.mode.getTargetPt(this);
        this.moveTowardsPoint(target.x, target.y);

        if (this.shakeIntensity > 0) {
            let pt = Random.inCircle(this.shakeIntensity);
            this._shakeX = pt.x;
            this._shakeY = pt.y;
        } else {
            this._shakeX = 0;
            this._shakeY = 0;
        }

        if (this.waverIntensityX > 0 || this.waverIntensityY > 0) {
            let xf = this.waverPerlin.get(this.world.time * this.waverSpeed, -101.5);
            let yf = this.waverPerlin.get(this.world.time * this.waverSpeed, 402.7);
            this._waverX = this.waverIntensityX * xf;
            this._waverY = this.waverIntensityY * yf;
        } else {
            this._waverX = 0;
            this._waverY = 0;
        }

        this.clampToBounds();

        if (Debug.MOVE_CAMERA_WITH_ARROWS && this.world === global.world) {
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_LEFT))  this.debugOffsetX -= 1;
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_RIGHT)) this.debugOffsetX += 1;
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_UP))    this.debugOffsetY -= 1;
            if (Input.isDown(Input.DEBUG_MOVE_CAMERA_DOWN))  this.debugOffsetY += 1;
        }
    }

    getWorldRect$() {
        return FrameCache.rectangle(this.left, this.top, this.width, this.height);
    }

    private clampToBounds() {
        if (this.bounds.left > -Infinity && this.left < this.bounds.left) {
            this.x += this.bounds.left - this.left;
        }
        if (this.bounds.right < Infinity && this.right > this.bounds.right) {
            this.x += this.bounds.right - this.right;
        }
        if (this.bounds.top > -Infinity && this.top < this.bounds.top) {
            this.y += this.bounds.top - this.top;
        }
        if (this.bounds.bottom < Infinity && this.bottom > this.bounds.bottom) {
            this.y += this.bounds.bottom - this.bottom;
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
            if (this.movement.speed === Infinity) {
                this.x = targetx;
            } else {
                this.x = M.lerpTime(this.x, targetx, this.movement.speed, this.world.delta);
            }
        }

        if (Math.abs(dy) > hh) {
            let ty = Math.abs(hh / dy);
            let targety = this.y + (1-ty)*dy;
            if (this.movement.speed === Infinity) {
                this.y = targety;
            } else {
                this.y = M.lerpTime(this.y, targety, this.movement.speed, this.world.delta);
            }
        }
    }

    snapPosition() {
        let target = this.mode.getTargetPt(this);
        this.x = target.x;
        this.y = target.y;
    }

    setMode(mode: Camera.Mode) {
        this.mode = O.clone(mode);
    }

    setModeFocus(x: number, y: number) {
        this.setMode(Camera.Mode.FOCUS(x, y));
    }

    setModeFollow(target: string | Pt, offsetX: number = 0, offsetY: number = 0, snapToScreenBounds: boolean = false) {
        this.setMode(Camera.Mode.FOLLOW(target, offsetX, offsetY, snapToScreenBounds));
    }

    setModeFree() {
        this.setMode(Camera.Mode.FREE());
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
        export function FOCUS(x: number, y: number): Mode {
            let focusPt = vec2(x, y);
            return {
                getTargetPt: (camera: Camera) => focusPt,
            };
        }
        export function FOLLOW(target: string | Pt, offsetX: number = 0, offsetY: number = 0, snapToScreenBounds: boolean = false): Mode {
            return {
                getTargetPt: (camera: Camera) => {
                    let position: Vector2;
                    if (St.isString(target)) {
                        let worldObject = camera.world.select.name(target, 'unchecked');
                        position = worldObject ? vec2(worldObject.x + offsetX, worldObject.y + offsetY) : vec2(camera.x, camera.y);
                    } else {
                        position = vec2(target.x + offsetX, target.y + offsetY);
                    }

                    if (snapToScreenBounds) {
                        position.x = Math.floor(position.x / camera.width) * camera.width + camera.width/2;
                        position.y = Math.floor(position.y / camera.height) * camera.height + camera.height/2;
                    }

                    return position;
                },
            };
        }
        export function FREE(): Mode {
            return {
                getTargetPt: (camera: Camera) => camera,
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