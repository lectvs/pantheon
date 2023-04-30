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
    } & Dict<string[]>;
}

class Input {
    private static eventKey: string; // Mainly for use in control binding
    private static isDownByKeyCode: Dict<boolean>;
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

    private static isUsingTouch: boolean = false;
    private static touchWentDown: boolean = false; // Did a touch event happen this frame that caused touch to start?
    private static touchWentUp: boolean = false; // Did a touch event happen this frame that caused touch to stop?

    static simulateMouseWithTouches: boolean = false;
    static preventRegularKeyboardInput: boolean = false;

    static init() {
        this.keyCodesByName = O.deepClone(Options.getOption(Options.CONTROLS));
        this.isDownByKeyCode = {};
        this.keysByKeycode = {};

        for (let name in this.keyCodesByName) {
            this.keyCodesByName[name].push(this.debugKeyCode(name));
            for (let keyCode of this.keyCodesByName[name]) {
                this.setupKeyCode(keyCode);
            }
        }

        TouchManager.onTouchDown = () => this.handleTouchDown();
        TouchManager.onTouchUp = () => this.handleTouchUp();
    }

    static update() {
        if (Debug.PROGRAMMATIC_INPUT) {
            this.clearKeys();
        }
        this.updateKeys();
        this.updateMousePosition();
    }

    static postUpdate() {
        this._mouseScrollDelta = 0;

        if (this.touchWentUp) {
            this._canvasMouseX = 0;
            this._canvasMouseY = 0;
            this._mouseRadius = 0;
            this.touchWentUp = false;
        }
    }

    static consume(key: string) {
        for (let keyCode of this.keyCodesByName[key] || []) {
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

    static addControlBinding(controlName: string, keyCode: string) {
        let controls: Dict<string[]> = Options.getOption(Options.CONTROLS);
        let controlBindings = controls[controlName];
        if (!controlBindings) {
            console.error(`Cannot add control binding for '${controlName}' since the control does not exist`);
            return;
        }
        if (!_.contains(controlBindings, keyCode)) {
            controlBindings.push(keyCode);
        }
        Options.saveOptions();
        this.init();
    }

    static removeControlBinding(controlName: string, keyCode: string) {
        let controls: Dict<string[]> = Options.getOption(Options.CONTROLS);
        let controlBindings = controls[controlName];
        if (!controlBindings) {
            console.error(`Cannot remove control binding for '${controlName}' since the control does not exist`);
            return;
        }
        A.removeAll(controlBindings, keyCode);
        Options.saveOptions();
        this.init();
    }

    static updateControlBinding(controlName: string, oldKeyCode: string, newKeyCode: string) {
        let controls: Dict<string[]> = Options.getOption(Options.CONTROLS);
        let controlBindings = controls[controlName];
        if (!controlBindings) {
            console.error(`Cannot update control binding for '${controlName}' since the control does not exist`);
            return;
        }

        if (!_.contains(controlBindings, oldKeyCode)) {
            console.error(`Cannot update control binding '${oldKeyCode}' for '${controlName}' since that key is not bound to that control`);
            return;
        }

        for (let i = 0; i < controlBindings.length; i++) {
            if (controlBindings[i] === oldKeyCode) {
                controlBindings[i] = newKeyCode;
                break;
            }
        }
        
        Options.saveOptions();
        this.init();
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
            if (TouchManager.isTouching) {
                this._canvasMouseX = TouchManager.touch.x;
                this._canvasMouseY = TouchManager.touch.y;
                this._mouseRadius = TouchManager.touch.radius;
            }
        } else if (IS_MOBILE) {
            if (this.isDownByKeyCode[this.MOUSE_KEYCODES[0]]) {
                this._canvasMouseX = global.renderer.plugins.interaction.mouse.global.x;
                this._canvasMouseY = global.renderer.plugins.interaction.mouse.global.y;
                this._mouseRadius = IS_MOBILE ? 10 : 0;
            }
        } else {
            this._canvasMouseX = global.renderer.plugins.interaction.mouse.global.x;
            this._canvasMouseY = global.renderer.plugins.interaction.mouse.global.y;
        }
        if (Fullscreen.enabled) {
            let cw = global.renderer.width / global.renderer.resolution;
            let ch = global.renderer.height / global.renderer.resolution;
            let iw = window.innerWidth;
            let ih = window.innerHeight;
            let ratioW = iw/cw;
            let ratioH = ih/ch;
            if (ratioW < ratioH) {
                let h = ch*ch*ratioW/ih;
                let y1 = (ch - h) / 2;
                this._canvasMouseY = ch * (this._canvasMouseY - y1) / h;
            } else if (ratioW > ratioH) {
                let w = cw*cw*ratioH/iw;
                let x1 = (cw - w) / 2;
                this._canvasMouseX = cw * (this._canvasMouseX - x1) / w;
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

    static get mouseX() {
        return this._mouseX;
    }

    static get mouseY() {
        return this._mouseY;
    }

    static get mousePosition() {
        return new Vector2(this.mouseX, this.mouseY);
    }

    static get lastMouseX() {
        return this._lastMouseX;
    }

    static get lastMouseY() {
        return this._lastMouseY;
    }

    static get lastMousePosition() {
        return new Vector2(this.lastMouseX, this.lastMouseY);
    }

    static get canvasMouseX() {
        return this._canvasMouseX;
    }

    static get canvasMouseY() {
        return this._canvasMouseY;
    }

    static get canvasMousePosition() {
        return new Vector2(this.canvasMouseX, this.canvasMouseY);
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

    static handleKeyDownEvent(event: KeyboardEvent) {
        let keyCode = Input.getKeyFromEventKey(event.key);
        this.eventKey = keyCode;
        if (this.isDownByKeyCode[keyCode] !== undefined) {
            event.preventDefault();
        }
        this.isDownByKeyCode[keyCode] = true;

        // Handle fullscreen toggle
        if (!this.preventRegularKeyboardInput && _.contains(this.keyCodesByName[Input.FULLSCREEN], keyCode)) {
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

    static handleTouchDown() {
        if (this.simulateMouseWithTouches) {
            this.isDownByKeyCode[this.MOUSE_KEYCODES[0]] = true;
            this.isUsingTouch = true;
            this.touchWentDown = true;
        }
    }

    static handleTouchUp() {
        if (this.simulateMouseWithTouches) {
            this.isDownByKeyCode[this.MOUSE_KEYCODES[0]] = false;
            this.touchWentUp = true;
        }
    }

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

    export class Key {
        private _isDown: boolean;
        private _lastDown: boolean;

        constructor() {
            this._isDown = false;
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

    /**
     * Translate possible capital letters/symbols to their lowercase key form.
     */
    export function getKeyFromEventKey(key: string) {
        if (!key) return key;
        if (key.length === 1 && 'A' <= key && key <= 'Z') return key.toLowerCase();
        if (key in CAPS_TO_KEYS) return CAPS_TO_KEYS[key];
        return key;
    }

    const CAPS_TO_KEYS = {
        '~': '`', '!': '1', '@': '2', '#': '3', '$': '4',  '%': '5', '^': '6',  '&': '7', '*': '8', '(': '9', ')': '0',
        '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': '\'', '<': ',', '>': '.', '?': '/',
    };
}
