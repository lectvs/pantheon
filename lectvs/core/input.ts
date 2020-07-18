namespace Input {
    export type KeyCodesByName = {
        // Game
        [Input.GAME_ADVANCE_DIALOG]: string[],
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
    } & Dict<string[]>;
}

class Input {
    private static isDownByKeyCode: {[keyCode: string]: boolean};
    private static keysByKeycode: {[keyCode: string]: Input.Key};
    private static keyCodesByName: {[name: string]: string[]};
    private static _mouseX: number = 0;
    private static _mouseY: number = 0;
    private static _canvasMouseX: number = 0;
    private static _canvasMouseY: number = 0;

    static init() {
        this.keyCodesByName = O.deepClone(Options.getOption('controls'));
        this.isDownByKeyCode = {};
        this.keysByKeycode = {};

        for (let name in this.keyCodesByName) {
            this.keyCodesByName[name].push(this.debugKeyCode(name));
            for (let keyCode of this.keyCodesByName[name]) {
                this.setupKeyCode(keyCode);
            }
        }
    }

    static update() {
        if (Debug.PROGRAMMATIC_INPUT) {
            this.clearKeys();
        }
        this.updateKeys();
        this.updateMousePosition();
    }

    static consume(key: string) {
        for (let keyCode of this.keyCodesByName[key] || []) {
            this.keysByKeycode[keyCode].consume();
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
        let controls: Dict<string[]> = Options.getOption('controls');
        let controlBindings = controls[controlName];
        if (!controlBindings) {
            error(`Cannot add control binding for '${controlName}' since the control does not exist`);
            return;
        }
        if (!_.contains(controlBindings, keyCode)) {
            controlBindings.push(keyCode);
        }
        Options.saveOptions();
        this.init();
    }

    static removeControlBinding(controlName: string, keyCode: string) {
        let controls: Dict<string[]> = Options.getOption('controls');
        let controlBindings = controls[controlName];
        if (!controlBindings) {
            error(`Cannot remove control binding for '${controlName}' since the control does not exist`);
            return;
        }
        A.removeAll(controlBindings, keyCode);
        Options.saveOptions();
        this.init();
    }

    static updateControlBinding(controlName: string, oldKeyCode: string, newKeyCode: string) {
        let controls: Dict<string[]> = Options.getOption('controls');
        let controlBindings = controls[controlName];
        if (!controlBindings) {
            error(`Cannot update control binding for '${controlName}' since the control does not exist`);
            return;
        }

        if (!_.contains(controlBindings, oldKeyCode)) {
            error(`Cannot update control binding '${oldKeyCode}' for '${controlName}' since that key is not bound to that control`);
            return;
        }

        for (let i = 0; i < controlBindings.length; i++) {
            if (controlBindings[i] === oldKeyCode) {
                controlBindings[i] = newKeyCode;
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
            this.keysByKeycode[keyCode].update(this.isDownByKeyCode[keyCode]);
        }
    }

    private static clearKeys() {
        for (let keyCode in this.isDownByKeyCode) {
            this.isDownByKeyCode[keyCode] = false;
        }
    }

    private static updateMousePosition() {
        this._canvasMouseX = global.renderer.plugins.interaction.mouse.global.x;
        this._canvasMouseY = global.renderer.plugins.interaction.mouse.global.y;
        if (this.isMouseOnCanvas) {
            this._mouseX = Math.floor(this._canvasMouseX);
            this._mouseY = Math.floor(this._canvasMouseY);
        }
    }

    private static setupKeyCode(keyCode: string) {
        this.isDownByKeyCode[keyCode] = false;
        this.keysByKeycode[keyCode] = this.keysByKeycode[keyCode] || new Input.Key();
    }

    static isDown(key: string) {
        return this.keyCodesByName[key] && this.keyCodesByName[key].some(keyCode => this.keysByKeycode[keyCode].isDown);
    }

    static isUp(key: string) {
        return this.keyCodesByName[key] && this.keyCodesByName[key].every(keyCode => this.keysByKeycode[keyCode].isUp);
    }

    static justDown(key: string) {
        return this.keyCodesByName[key] && this.keyCodesByName[key].some(keyCode => this.keysByKeycode[keyCode].justDown);
    }

    static justUp(key: string) {
        return this.keyCodesByName[key] && this.keyCodesByName[key].some(keyCode => this.keysByKeycode[keyCode].justUp)
                && this.keyCodesByName[key].every(keyCode => this.keysByKeycode[keyCode].isUp || this.keysByKeycode[keyCode].justUp);
    }

    static get mouseX() {
        return this._mouseX;
    }

    static get mouseY() {
        return this._mouseY;
    }

    static get mousePosition(): Pt {
        return { x: this.mouseX, y: this.mouseY };
    }

    static get canvasMouseX() {
        return this._canvasMouseX;
    }

    static get canvasMouseY() {
        return this._canvasMouseY;
    }

    static get canvasMousePosition(): Pt {
        return { x: this.canvasMouseX, y: this.canvasMouseY };
    }

    static get isMouseOnCanvas() {
        return 0 <= this.canvasMouseX && this.canvasMouseX < global.gameWidth && 0 <= this.canvasMouseY && this.canvasMouseY < global.gameHeight;
    }

    static handleKeyDownEvent(event: KeyboardEvent) {
        if (this.isDownByKeyCode[event.key] !== undefined) {
            this.isDownByKeyCode[event.key] = true;
            event.preventDefault();
        }
    }

    static handleKeyUpEvent(event: KeyboardEvent) {
        if (this.isDownByKeyCode[event.key] !== undefined) {
            this.isDownByKeyCode[event.key] = false;
            event.preventDefault();
        }
    }

    static handleMouseDownEvent(event: MouseEvent) {
        let keyCode = this.MOUSE_KEYCODES[event.button];
        if (keyCode && this.isDownByKeyCode[keyCode] !== undefined) {
            this.isDownByKeyCode[keyCode] = true;
            event.preventDefault();
        }
    }

    static handleMouseUpEvent(event: MouseEvent) {
        let keyCode = this.MOUSE_KEYCODES[event.button];
        if (keyCode && this.isDownByKeyCode[keyCode] !== undefined) {
            this.isDownByKeyCode[keyCode] = false;
            event.preventDefault();
        }
    }

    static MOUSE_KEYCODES: string[] = ["MouseLeft", "MouseMiddle", "MouseRight", "MouseBack", "MouseForward"];
    static DEBUG_PREFIX: string = "debug::";

}

namespace Input {
    export const GAME_ADVANCE_DIALOG = 'game_advanceDialog';
    export const GAME_PAUSE = 'game_pause';
    export const GAME_CLOSE_MENU = 'game_closeMenu';
    export const GAME_SELECT = 'game_select';

    export const DEBUG_MOVE_CAMERA_UP = 'debug_moveCameraUp';
    export const DEBUG_MOVE_CAMERA_DOWN = 'debug_moveCameraDown';
    export const DEBUG_MOVE_CAMERA_LEFT = 'debug_moveCameraLeft';
    export const DEBUG_MOVE_CAMERA_RIGHT = 'debug_moveCameraRight';
    export const DEBUG_RECORD_METRICS = 'debug_recordMetrics';
    export const DEBUG_SHOW_METRICS_MENU = 'debug_showMetricsMenu';

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
}
