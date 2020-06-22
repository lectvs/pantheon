namespace Debug {
    export type Config = {
        debug: boolean;
        cheatsEnabled: boolean;
        allPhysicsBounds: boolean;
        moveCameraWithArrows: boolean; 
        showMousePosition: boolean;
        mousePositionFont: SpriteText.Font;
        skipRate: number;
        programmaticInput: boolean;
        autoplay: boolean;
        skipMainMenu: boolean;
    }
}

class Debug {
    static init(config: Debug.Config) {
        Debug.DEBUG = config.debug;
        Debug.CHEATS_ENABLED = config.cheatsEnabled;
        Debug.ALL_PHYSICS_BOUNDS = config.allPhysicsBounds;
        Debug.MOVE_CAMERA_WITH_ARROWS = config.moveCameraWithArrows;
        Debug.SHOW_MOUSE_POSITION = config.showMousePosition;
        Debug.MOUSE_POSITION_FONT = config.mousePositionFont;
        Debug.SKIP_RATE = config.skipRate;
        Debug.PROGRAMMATIC_INPUT = config.programmaticInput;
        Debug.AUTOPLAY = config.autoplay;
        Debug.SKIP_MAIN_MENU = config.skipMainMenu;
    }

    private static _DEBUG: boolean;
    static get DEBUG() { return this._DEBUG; }
    static set DEBUG(value: boolean) { this._DEBUG = value; }

    private static _CHEATS_ENABLED: boolean;
    static get CHEATS_ENABLED() { return this.DEBUG && this._CHEATS_ENABLED; }
    static set CHEATS_ENABLED(value: boolean) { this._CHEATS_ENABLED = value; }

    private static _ALL_PHYSICS_BOUNDS: boolean;
    static get ALL_PHYSICS_BOUNDS() { return this.DEBUG && this._ALL_PHYSICS_BOUNDS; }
    static set ALL_PHYSICS_BOUNDS(value: boolean) { this._ALL_PHYSICS_BOUNDS = value; }

    private static _MOVE_CAMERA_WITH_ARROWS: boolean;
    static get MOVE_CAMERA_WITH_ARROWS() { return this.DEBUG && this._MOVE_CAMERA_WITH_ARROWS; }
    static set MOVE_CAMERA_WITH_ARROWS(value: boolean) { this._MOVE_CAMERA_WITH_ARROWS = value; }

    private static _SHOW_MOUSE_POSITION: boolean;
    static get SHOW_MOUSE_POSITION() { return this.DEBUG && this._SHOW_MOUSE_POSITION; }
    static set SHOW_MOUSE_POSITION(value: boolean) { this._SHOW_MOUSE_POSITION = value; }
    static MOUSE_POSITION_FONT: SpriteText.Font;

    private static _SKIP_RATE: number;
    static get SKIP_RATE() { return this.DEBUG ? this._SKIP_RATE : 1; }
    static set SKIP_RATE(value: number) { this._SKIP_RATE = value; }

    private static _PROGRAMMATIC_INPUT: boolean;
    static get PROGRAMMATIC_INPUT() { return this.DEBUG && this._PROGRAMMATIC_INPUT; }
    static set PROGRAMMATIC_INPUT(value: boolean) { this._PROGRAMMATIC_INPUT = value; }

    private static _AUTOPLAY: boolean;
    static get AUTOPLAY() { return this.DEBUG && this._AUTOPLAY; }
    static set AUTOPLAY(value: boolean) { this._AUTOPLAY = value; }

    private static _SKIP_MAIN_MENU: boolean;
    static get SKIP_MAIN_MENU() { return this.DEBUG && this._SKIP_MAIN_MENU; }
    static set SKIP_MAIN_MENU(value: boolean) { this._SKIP_MAIN_MENU = value; }
}

function get(name: string) {
    let worldObject = global.game.theater.currentWorld.getWorldObjectByName(name);
    if (worldObject) return worldObject;
    return undefined;
}