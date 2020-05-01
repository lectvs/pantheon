namespace Debug {
    export type Config = {
        mousePositionFont: SpriteText.Font;
    }
}

class DebugValues {
    init(config: Debug.Config) {
        Debug.DEBUG = true;
        Debug.ALL_PHYSICS_BOUNDS = false;
        Debug.MOVE_CAMERA_WITH_ARROWS = true;
        Debug.SHOW_MOUSE_POSITION = true;
        Debug.MOUSE_POSITION_FONT = config.mousePositionFont;
        Debug.SKIP_RATE = 1;
        Debug.PROGRAMMATIC_INPUT = false;
        Debug.AUTOPLAY = true;
        Debug.SKIP_MAIN_MENU = true;
    }

    private _DEBUG: boolean;
    get DEBUG() { return this._DEBUG; }
    set DEBUG(value: boolean) { this._DEBUG = value; }

    private _ALL_PHYSICS_BOUNDS: boolean;
    get ALL_PHYSICS_BOUNDS() { return this.DEBUG && this._ALL_PHYSICS_BOUNDS; }
    set ALL_PHYSICS_BOUNDS(value: boolean) { this._ALL_PHYSICS_BOUNDS = value; }

    private _MOVE_CAMERA_WITH_ARROWS: boolean;
    get MOVE_CAMERA_WITH_ARROWS() { return this.DEBUG && this._MOVE_CAMERA_WITH_ARROWS; }
    set MOVE_CAMERA_WITH_ARROWS(value: boolean) { this._MOVE_CAMERA_WITH_ARROWS = value; }

    private _SHOW_MOUSE_POSITION: boolean;
    get SHOW_MOUSE_POSITION() { return this.DEBUG && this._SHOW_MOUSE_POSITION; }
    set SHOW_MOUSE_POSITION(value: boolean) { this._SHOW_MOUSE_POSITION = value; }
    MOUSE_POSITION_FONT: SpriteText.Font;

    private _SKIP_RATE: number;
    get SKIP_RATE() { return this.DEBUG ? this._SKIP_RATE : 1; }
    set SKIP_RATE(value: number) { this._SKIP_RATE = value; }

    private _PROGRAMMATIC_INPUT: boolean;
    get PROGRAMMATIC_INPUT() { return this.DEBUG && this._PROGRAMMATIC_INPUT; }
    set PROGRAMMATIC_INPUT(value: boolean) { this._PROGRAMMATIC_INPUT = value; }

    private _AUTOPLAY: boolean;
    get AUTOPLAY() { return this.DEBUG && this._AUTOPLAY; }
    set AUTOPLAY(value: boolean) { this._AUTOPLAY = value; }

    private _SKIP_MAIN_MENU: boolean;
    get SKIP_MAIN_MENU() { return this.DEBUG && this._SKIP_MAIN_MENU; }
    set SKIP_MAIN_MENU(value: boolean) { this._SKIP_MAIN_MENU = value; }
}

var Debug = new DebugValues();

var debug = console.info;
// function debug(message?: any, ...optionalParams: any[]) {
//     if (DEBUG) {
//         console.log(message, ...optionalParams);
//     }
// }

function get(name: string) {
    let worldObject = global.game.theater.currentWorld.getWorldObjectByName(name);
    if (worldObject) return worldObject;
    return undefined;
}