class Input {
    private static isDownByKeyCode: {[keyCode: string]: boolean};
    private static keysByKeycode: {[keyCode: string]: Input.Key};
    private static keyCodesByName: {[name: string]: string[]};
    private static _mouseX: number = 0;
    private static _mouseY: number = 0;
    private static _globalMouseX: number = 0;
    private static _globalMouseY: number = 0;

    static setKeys(keyCodesByName: {[name: string]: string[]}) {
        this.keyCodesByName = _.clone(keyCodesByName);
        this.isDownByKeyCode = {};
        this.keysByKeycode = {};

        for (let name in keyCodesByName) {
            for (let keyCode of keyCodesByName[name]) {
                this.isDownByKeyCode[keyCode] = false;
                this.keysByKeycode[keyCode] = this.keysByKeycode[keyCode] || new Input.Key();
            }
        }

        for (let keyCode of Input.MOUSE_KEYCODES) {
            this.isDownByKeyCode[keyCode] = false;
            this.keysByKeycode[keyCode] = new Input.Key();
        }
    }

    static update() {
        this.updateKeys();
        this.updateMousePosition();
    }

    private static updateKeys() {
        for (let keyCode in this.keysByKeycode) {
            this.keysByKeycode[keyCode].update(this.isDownByKeyCode[keyCode]);
        }
    }

    private static updateMousePosition() {
        this._globalMouseX = Main.renderer.plugins.interaction.mouse.global.x;
        this._globalMouseY = Main.renderer.plugins.interaction.mouse.global.y;
        if (this.isMouseOnCanvas) {
            this._mouseX = Math.floor(this._globalMouseX);
            this._mouseY = Math.floor(this._globalMouseY);
        }
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

    static get mousePosition() {
        return new Point(this.mouseX, this.mouseY);
    }

    static get globalMouseX() {
        return this._globalMouseX;
    }

    static get globalMouseY() {
        return this._globalMouseY;
    }

    static get globalMousePosition() {
        return new Point(this.globalMouseX, this.globalMouseY);
    }

    static get isMouseOnCanvas() {
        return 0 <= this.globalMouseX && this.globalMouseX < Main.width && 0 <= this.globalMouseY && this.globalMouseY < Main.height;
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
}

namespace Input {
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
    }
}
