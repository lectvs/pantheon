namespace Input {
    export type KeyCodesByName = {
        // General
        [Input.FULLSCREEN]: string[],

        // Game
        [Input.GAME_ADVANCE_CUTSCENE]: string[],
        [Input.GAME_PAUSE]: string[],
        [Input.GAME_CLOSE_MENU]: string[],
        [Input.GAME_SELECT]: string[],

        // Debug
        [Input.DEBUG_MOVE_CAMERA_UP]: string[],
        [Input.DEBUG_MOVE_CAMERA_DOWN]: string[],
        [Input.DEBUG_MOVE_CAMERA_LEFT]: string[],
        [Input.DEBUG_MOVE_CAMERA_RIGHT]: string[],
        [Input.DEBUG_RECORD_METRICS]: string[],
        [Input.DEBUG_SHOW_METRICS_MENU]: string[],
        [Input.DEBUG_TOGGLE_OVERLAY]: string[],
        [Input.DEBUG_FRAME_SKIP_STEP]: string[],
        [Input.DEBUG_FRAME_SKIP_RUN]: string[],
        [Input.DEBUG_FRAME_SKIP_DISABLE]: string[],
        [Input.DEBUG_SKIP_RATE]: string[],
        [Input.DEBUG_SCREENSHOT]: string[],
    } & Dict<string[]>;

    export type TouchData = {
        id: number;
        x: number;
        y: number;
        radius: number;
    }
}

class Input {
    private static eventKey: string | undefined; // Mainly for use in control binding
    private static isDownByKeyCode: Dict<boolean>;
    private static lastIsDownByKeyCode: Dict<boolean>;
    private static keysByKeycode: Dict<Input.Key>;
    private static keyCodesByName: Input.KeyCodesByName;
    private static _mouseX: number = 0;
    private static _mouseY: number = 0;
    private static _canvasMouseX: number = 0;
    private static _canvasMouseY: number = 0;
    private static _mouseRadius: number = 0;
    private static _mouseScrollDelta: number = 0;

    private static _lastMouseX: number;
    private static _lastMouseY: number;

    private static usingTouch: boolean = false;
    private static touchWentDown: boolean = false; // Did a touch event happen this frame that caused touch to start?
    private static touchWentUp: boolean = false; // Did a touch event happen this frame that caused touch to stop?
    private static touches: Input.TouchData[] = [];

    static simulateMouseWithTouches: boolean = false;
    static preventRegularKeyboardInput: boolean = false;

    static gestures: Input.Gestures;

    static init(keyCodesByName: Input.KeyCodesByName) {
        this.keyCodesByName = O.deepClone(keyCodesByName);
        this.isDownByKeyCode = {};
        this.lastIsDownByKeyCode = {};
        this.keysByKeycode = {};

        for (let name in this.keyCodesByName) {
            this.keyCodesByName[name].push(this.debugKeyCode(name));
            for (let keyCode of this.keyCodesByName[name]) {
                this.setupKeyCode(keyCode);
            }
        }

        this.gestures = new Input.Gestures();
    }

    static update() {
        if (Debug.PROGRAMMATIC_INPUT) {
            this.clearKeys();
        }
        this.updateKeys();
        this.updateMousePosition();
        this.gestures.update();
    }

    static postUpdate() {
        for (let key in this.isDownByKeyCode) {
            this.lastIsDownByKeyCode[key] = this.isDownByKeyCode[key];
        }

        this._mouseScrollDelta = 0;

        if (this.touchWentUp) {
            this._canvasMouseX = 0;
            this._canvasMouseY = 0;
            this._mouseRadius = 0;
            this.touchWentUp = false;
        }
    }

    static consume(key: string) {
        if (!this.keyCodesByName[key]) return;
        for (let keyCode of this.keyCodesByName[key]) {
            this.keysByKeycode[keyCode].consume();
        }
    }

    static reset() {
        for (let key in this.isDownByKeyCode) {
            this.isDownByKeyCode[key] = false;
        }
    }

    static debugKeyDown(name: string) {
        if (!Debug.PROGRAMMATIC_INPUT) return;
        this.keysByKeycode[this.debugKeyCode(name)].setDown();
    }

    static debugKeyJustDown(name: string) {
        if (!Debug.PROGRAMMATIC_INPUT) return;
        this.keysByKeycode[this.debugKeyCode(name)].setJustDown();
    }

    static debugKeyUp(name: string) {
        if (!Debug.PROGRAMMATIC_INPUT) return;
        this.keysByKeycode[this.debugKeyCode(name)].setUp();
    }

    static debugKeyJustUp(name: string) {
        if (!Debug.PROGRAMMATIC_INPUT) return;
        this.keysByKeycode[this.debugKeyCode(name)].setJustUp();
    }

    private static debugKeyCode(name: string) {
        return this.DEBUG_PREFIX + name;
    }

    private static updateKeys() {
        for (let keyCode in this.keysByKeycode) {
            if (!this.preventRegularKeyboardInput || keyCode.includes('Mouse')) {
                this.keysByKeycode[keyCode].update(this.isDownByKeyCode[keyCode]);
            } else {
                this.keysByKeycode[keyCode].setUp();
            }
        }
    }

    private static clearKeys() {
        for (let keyCode in this.isDownByKeyCode) {
            this.isDownByKeyCode[keyCode] = false;
        }
    }

    private static updateMousePosition() {
        if (this.isUsingTouch && this.simulateMouseWithTouches) {
            if (this.isTouching) {
                this._canvasMouseX = this.touch!.x;
                this._canvasMouseY = this.touch!.y;
                this._mouseRadius = this.touch!.radius;
            }
        } else if (IS_MOBILE) {
            if (this.isDownByKeyCode[this.MOUSE_KEYCODES[0]]) {
                this._canvasMouseX = Main.rendererPlugins.interaction.mouse.global.x / global.upscale;
                this._canvasMouseY = Main.rendererPlugins.interaction.mouse.global.y / global.upscale;
                this._mouseRadius = IS_MOBILE ? 10 : 0;
            }
        } else {
            this._canvasMouseX = Main.rendererPlugins.interaction.mouse.global.x / global.upscale;
            this._canvasMouseY = Main.rendererPlugins.interaction.mouse.global.y / global.upscale;
        }
        if (Fullscreen.enabled) {
            let iw = window.innerWidth;
            let ih = window.innerHeight;
            let ratioW = iw/W;
            let ratioH = ih/H;
            if (ratioW < ratioH) {
                let h = H*H*ratioW/ih;
                let y1 = (H - h) / 2;
                this._canvasMouseY = H * (this._canvasMouseY - y1) / h;
            } else if (ratioW > ratioH) {
                let w = W*W*ratioH/iw;
                let x1 = (W - w) / 2;
                this._canvasMouseX = W * (this._canvasMouseX - x1) / w;
            }
        }

        this._lastMouseX = this._mouseX;
        this._lastMouseY = this._mouseY;

        //if (this.isMouseOnCanvas) {
            this._mouseX = Math.floor(this._canvasMouseX);
            this._mouseY = Math.floor(this._canvasMouseY);
        //}

        if (this.touchWentDown) {
            this._lastMouseX = this._mouseX;
            this._lastMouseY = this._mouseY;
            this.touchWentDown = false;
        }
    }

    private static setupKeyCode(keyCode: string) {
        this.isDownByKeyCode[keyCode] = false;
        this.keysByKeycode[keyCode] = this.keysByKeycode[keyCode] || new Input.Key();
    }
    
    static consumeEventKey() {
        this.eventKey = undefined;
    }

    /**
     * Used to detect keypress when updating key binds.
     */
    static getEventKey() {
        return this.eventKey;
    }

    static isDown(key: string) {
        if (key === Input.GAME_ADVANCE_CUTSCENE && global.skippingCutscene) return true;
        return this.keyCodesByName[key] && this.keyCodesByName[key].some(keyCode => this.keysByKeycode[keyCode].isDown);
    }

    static isUp(key: string) {
        return this.keyCodesByName[key] && this.keyCodesByName[key].every(keyCode => this.keysByKeycode[keyCode].isUp);
    }

    static justDown(key: string) {
        if (key === Input.GAME_ADVANCE_CUTSCENE && global.skippingCutscene) return true;
        return this.keyCodesByName[key] && this.keyCodesByName[key].some(keyCode => this.keysByKeycode[keyCode].justDown);
    }

    static justUp(key: string) {
        return this.keyCodesByName[key] && this.keyCodesByName[key].some(keyCode => this.keysByKeycode[keyCode].justUp)
                && this.keyCodesByName[key].every(keyCode => this.keysByKeycode[keyCode].isUp || this.keysByKeycode[keyCode].justUp);
    }

    static isKeyCodeDown(keyCode: string) {
        return this.isDownByKeyCode[keyCode];
    }

    static isKeyCodeJustDown(keyCode: string) {
        return this.isDownByKeyCode[keyCode] && !this.lastIsDownByKeyCode[keyCode];
    }

    static axis(negKey: string, posKey: string) {
        return (this.isDown(negKey) ? -1 : 0) + (this.isDown(posKey) ? 1 : 0);
    }

    static get mouseX() {
        return this._mouseX;
    }

    static get mouseY() {
        return this._mouseY;
    }

    static get mousePosition$() {
        return FrameCache.vec2(this.mouseX, this.mouseY);
    }

    static get lastMouseX() {
        return this._lastMouseX;
    }

    static get lastMouseY() {
        return this._lastMouseY;
    }

    static get lastMousePosition$() {
        return FrameCache.vec2(this.lastMouseX, this.lastMouseY);
    }

    static get canvasMouseX() {
        return this._canvasMouseX;
    }

    static get canvasMouseY() {
        return this._canvasMouseY;
    }

    static get canvasMousePosition$() {
        return FrameCache.vec2(this.canvasMouseX, this.canvasMouseY);
    }

    static get isMouseOnCanvas() {
        return 0 <= this.canvasMouseX && this.canvasMouseX < global.gameWidth && 0 <= this.canvasMouseY && this.canvasMouseY < global.gameHeight;
    }

    static get mouseScrollDelta() {
        return this._mouseScrollDelta;
    }

    static get mouseRadius() {
        return this._mouseRadius;
    }

    static get mouseSpeed() {
        if (Main.delta === 0) return 0;
        return M.distance(this.mouseX, this.mouseY, this.lastMouseX, this.lastMouseY) / Main.delta;
    }

    static get isUsingTouch() {
        return this.usingTouch;
    }

    static get isTouching() {
        return this.touches.length > 0;
    }

    static get touch() {
        return this.isTouching ? this.touches[0] : undefined;
    }

    static handleKeyDownEvent(event: KeyboardEvent) {
        let keyCode = Input.getKeyFromEventKey(event.key);
        this.eventKey = keyCode;
        if (this.isDownByKeyCode[keyCode] !== undefined && event.key === 'Tab') {
            event.preventDefault();
        }
        this.isDownByKeyCode[keyCode] = true;

        // Handle fullscreen toggle
        if (!this.preventRegularKeyboardInput && this.keyCodesByName[Input.FULLSCREEN].includes(keyCode)) {
            Fullscreen.toggleFullscreen();
        }
    }

    static handleKeyUpEvent(event: KeyboardEvent) {
        let keyCode = Input.getKeyFromEventKey(event.key);
        if (this.eventKey === keyCode) this.eventKey = undefined;
        if (this.isDownByKeyCode[keyCode] !== undefined) {
            event.preventDefault();
        }
        this.isDownByKeyCode[keyCode] = false;
    }

    static handleMouseDownEvent(event: MouseEvent) {
        let keyCode = this.MOUSE_KEYCODES[event.button];
        this.eventKey = keyCode;
        if (keyCode && this.isDownByKeyCode[keyCode] !== undefined) {
            if (this.isMouseOnCanvas) {
                // Prevent game-clicks outside the canvas
                this.isDownByKeyCode[keyCode] = true;
            }
            // Prevent default for all inputs except LMB
            if (event.button !== 0) event.preventDefault();
        }
        if (IS_MOBILE && keyCode === this.MOUSE_KEYCODES[0]) {
            this.touchWentDown = true;
        }
    }

    static handleMouseUpEvent(event: MouseEvent) {
        let keyCode = this.MOUSE_KEYCODES[event.button];
        if (this.eventKey === keyCode) this.eventKey = undefined;
        if (keyCode && this.isDownByKeyCode[keyCode] !== undefined) {
            this.isDownByKeyCode[keyCode] = false;
            event.preventDefault();
        }
        if (IS_MOBILE && keyCode === this.MOUSE_KEYCODES[0]) {
            this.touchWentUp = true;
        }
    }

    static handleMouseScrollEvent(event: WheelEvent, preventScrollOnCanvas: boolean) {
        this._mouseScrollDelta = Math.sign(event.deltaY);
        if (preventScrollOnCanvas && this.isMouseOnCanvas && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
        }
    }

    static handleTouchStartEvent(event: TouchEvent) {
        if (this.isTouching) return;

        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            let touchData = this.getTouchData(touch);
            this.touches.push(touchData);
        }

        if (this.isTouching) {
            this.onTouchDown();
        }
    }

    static handleTouchMoveEvent(event: TouchEvent) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            let index = this.touches.findIndex(td => td.id === touch.identifier);
            if (index >= 0) {
                this.touches[index] = this.getTouchData(touch);
            }
        }
    }

    static handleTouchEndEvent(event: TouchEvent) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            let index = this.touches.findIndex(td => td.id === touch.identifier);
            if (index >= 0) {
                this.touches.splice(index, 1);
            }
        }
        if (!this.isTouching && this.onTouchUp) {
            this.onTouchUp();
        }
    }

    static handleTouchCancelEvent(event: TouchEvent) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            let index = this.touches.findIndex(td => td.id === touch.identifier);
            if (index >= 0) {
                this.touches.splice(index, 1);
            }
        }
        if (!this.isTouching) {
            this.onTouchUp();
        }
    }

    private static onTouchDown() {
        if (this.simulateMouseWithTouches) {
            this.isDownByKeyCode[this.MOUSE_KEYCODES[0]] = true;
            this.usingTouch = true;
            this.touchWentDown = true;
        }
    }

    private static onTouchUp() {
        if (this.simulateMouseWithTouches) {
            this.isDownByKeyCode[this.MOUSE_KEYCODES[0]] = false;
            this.touchWentUp = true;
        }
    }

    private static getTouchData(touch: Touch): Input.TouchData {
        let bounds = Main.rendererView.getBoundingClientRect();
        return {
            id: touch.identifier,
            x: M.map(touch.pageX, bounds.left, bounds.right, 0, global.gameWidth),
            y: M.map(touch.pageY, bounds.top, bounds.bottom, 0, global.gameHeight),
            radius: 10,
        };
    }

    static KEYCODES = {
        Space: ' ',
        Alt: 'Alt',
        ArrowDown: 'ArrowDown',
        ArrowLeft: 'ArrowLeft',
        ArrowRight: 'ArrowRight',
        ArrowUp: 'ArrowUp',
        Backspace: 'Backspace',
        CapsLock: 'CapsLock',
        Ctrl: 'Control',
        Del: 'Delete',
        End: 'End',
        Enter: 'Enter',
        Esc: 'Escape',
        Home: 'Home',
        Ins: 'Insert',
        Win: 'Meta',
        PgDn: 'PageDown',
        PgUp: 'PageUp',
        Shift: 'Shift',
        Tab: 'Tab',
    } as const;

    static MOUSE_KEYCODES: string[] = ["MouseLeft", "MouseMiddle", "MouseRight", "MouseBack", "MouseForward"];
    static DEBUG_PREFIX: string = "debug::";
}

namespace Input {
    export const FULLSCREEN = 'fullscreen';

    export const GAME_ADVANCE_CUTSCENE = 'game_advanceCutscene';
    export const GAME_PAUSE = 'game_pause';
    export const GAME_CLOSE_MENU = 'game_closeMenu';
    export const GAME_SELECT = 'game_select';

    export const DEBUG_MOVE_CAMERA_UP = 'debug_moveCameraUp';
    export const DEBUG_MOVE_CAMERA_DOWN = 'debug_moveCameraDown';
    export const DEBUG_MOVE_CAMERA_LEFT = 'debug_moveCameraLeft';
    export const DEBUG_MOVE_CAMERA_RIGHT = 'debug_moveCameraRight';
    export const DEBUG_RECORD_METRICS = 'debug_recordMetrics';
    export const DEBUG_SHOW_METRICS_MENU = 'debug_showMetricsMenu';
    export const DEBUG_TOGGLE_OVERLAY = 'debug_toggleOverlay';
    export const DEBUG_FRAME_SKIP_STEP = 'debug_frameSkipStep';
    export const DEBUG_FRAME_SKIP_RUN = 'debug_frameSkipRun';
    export const DEBUG_FRAME_SKIP_DISABLE = 'debug_frameSkipDisable';
    export const DEBUG_SKIP_RATE = 'debug_skipRate';
    export const DEBUG_SCREENSHOT = 'debug_screenshot';

    export class Key {
        private _isDown: boolean;
        private _lastDown: boolean;

        constructor() {
            this._isDown = false;
            this._lastDown = false;
        }

        get isDown() { return this._isDown; }
        get isUp() { return !this._isDown; }
        get justDown() { return this._isDown && !this._lastDown; }
        get justUp() { return !this._isDown && this._lastDown; }

        update(isDown: boolean) {
            this._lastDown = this._isDown;
            this._isDown = isDown;
        }

        consume() {
            this._lastDown = this._isDown;
        }

        reset() {
            this.setUp();
        }

        setDown() {
            this._isDown = true;
            this._lastDown = true;
        }

        setJustDown() {
            this._isDown = true;
            this._lastDown = false;
        }

        setUp() {
            this._isDown = false;
            this._lastDown = false;
        }

        setJustUp() {
            this._isDown = false;
            this._lastDown = true;
        }
    }

    export namespace Gestures {
        export type Drag = {
            start: Vector2;
            end: Vector2;
            d: Vector2;
        }
    }

    export class Gestures {
        drag: Gestures.Drag | undefined;

        private lastTouch: Pt | undefined;

        update() {
            let touch = Input.isUsingTouch
                ? Input.touch
                : Input.isKeyCodeDown(Input.MOUSE_KEYCODES[0]) ? Input.mousePosition$.clone() : undefined;
            
            if (touch) {
                if (!this.lastTouch) {
                    this.drag = {
                        start: vec2(touch),
                        end: vec2(touch),
                        d: Vector2.ZERO,
                    };
                }

                if (this.drag) {
                    this.drag.end.set(touch);
                    this.drag.d.set(this.drag.end).subtract(this.drag.start);
                }
            } else {
                this.drag = undefined;
            }

            this.lastTouch = touch;
        }
    }

    /**
     * Translate possible capital letters/symbols to their lowercase key form.
     */
    export function getKeyFromEventKey(key: string) {
        if (!key) return key;
        if (key.length === 1 && 'A' <= key && key <= 'Z') return key.toLowerCase();
        if (key in CAPS_TO_KEYS) return CAPS_TO_KEYS[key];
        return key;
    }

    const CAPS_TO_KEYS: Dict<string> = {
        '~': '`', '!': '1', '@': '2', '#': '3', '$': '4',  '%': '5', '^': '6',  '&': '7', '*': '8', '(': '9', ')': '0',
        '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': '\'', '<': ',', '>': '.', '?': '/',
    };
}
