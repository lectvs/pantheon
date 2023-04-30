namespace Debug {
    export type Config = {
        debug: boolean;
        font: string;
        fontStyle: SpriteText.Style;
        showAllPhysicsBounds: boolean;
        showTouches: boolean;
        moveCameraWithArrows: boolean; 
        showOverlay: boolean;
        overlayFeeds: ((world: World) => string)[];
        skipRate: number;
        programmaticInput: boolean;
        autoplay: boolean;
        skipMainMenuStage: () => World;
        frameStepEnabled: boolean;
        resetOptionsAtStart: boolean;
        experiments: Dict<Experiment>;
    }
}

class Debug {
    static init(config: Debug.Config) {
        Debug.DEBUG = config.debug;
        Debug.DEBUG_TOGGLE_ENABLED = Debug.DEBUG;
        Debug.FONT = config.font;
        Debug.FONT_STYLE = config.fontStyle;
        Debug.SHOW_ALL_PHYSICS_BOUNDS = config.showAllPhysicsBounds;
        Debug.SHOW_TOUCHES = config.showTouches;
        Debug.MOVE_CAMERA_WITH_ARROWS = config.moveCameraWithArrows;
        Debug.SHOW_OVERLAY = Debug.DEBUG && config.showOverlay;
        Debug.OVERLAY_FEEDS = config.overlayFeeds;
        Debug.SKIP_RATE = config.skipRate;
        Debug.PROGRAMMATIC_INPUT = config.programmaticInput;
        Debug.AUTOPLAY = config.autoplay;
        Debug.SKIP_MAIN_MENU_STAGE = config.skipMainMenuStage;
        Debug.FRAME_STEP_ENABLED = config.frameStepEnabled;
        Debug.RESET_OPTIONS_AT_START = config.resetOptionsAtStart;
        Debug.EXPERIMENTS = config.experiments;
    }

    static update() {
        for (let experiment in Debug.EXPERIMENTS) {
            Debug.EXPERIMENTS[experiment].update(experiment);
        }

        if (Input.justDown(Input.DEBUG_FRAME_SKIP_STEP) || Input.justDown(Input.DEBUG_FRAME_SKIP_RUN)) {
            Debug.FRAME_STEP_ENABLED = true;
        }

        if (Input.justDown(Input.DEBUG_FRAME_SKIP_DISABLE)) {
            Debug.FRAME_STEP_ENABLED = false;
        }

        Debug._SKIP_RATE_KEY_MODIFIER = Input.isDown(Input.DEBUG_SKIP_RATE) ? 10 : 1;
    }

    private static _DEBUG: boolean;
    static get DEBUG() { return this._DEBUG; }
    static set DEBUG(value: boolean) { this._DEBUG = value; }
    static DEBUG_TOGGLE_ENABLED: boolean;
    
    static FONT: string;
    static FONT_STYLE: SpriteText.Style;

    private static _SHOW_ALL_PHYSICS_BOUNDS: boolean;
    static get SHOW_ALL_PHYSICS_BOUNDS() { return this.DEBUG && this._SHOW_ALL_PHYSICS_BOUNDS; }
    static set SHOW_ALL_PHYSICS_BOUNDS(value: boolean) { this._SHOW_ALL_PHYSICS_BOUNDS = value; }

    private static _SHOW_TOUCHES: boolean;
    static get SHOW_TOUCHES() { return this.DEBUG && this._SHOW_TOUCHES; }
    static set SHOW_TOUCHES(value: boolean) { this._SHOW_TOUCHES = value; }

    private static _MOVE_CAMERA_WITH_ARROWS: boolean;
    static get MOVE_CAMERA_WITH_ARROWS() { return this.DEBUG && this._MOVE_CAMERA_WITH_ARROWS; }
    static set MOVE_CAMERA_WITH_ARROWS(value: boolean) { this._MOVE_CAMERA_WITH_ARROWS = value; }

    static SHOW_OVERLAY: boolean;
    static OVERLAY_FEEDS: ((world: World) => string)[];

    private static _SKIP_RATE: number;
    private static _SKIP_RATE_KEY_MODIFIER: number = 1;
    static get SKIP_RATE() { return this.DEBUG ? this._SKIP_RATE * this._SKIP_RATE_KEY_MODIFIER : 1; }
    static set SKIP_RATE(value: number) { this._SKIP_RATE = value; }

    private static _PROGRAMMATIC_INPUT: boolean;
    static get PROGRAMMATIC_INPUT() { return this.DEBUG && this._PROGRAMMATIC_INPUT; }
    static set PROGRAMMATIC_INPUT(value: boolean) { this._PROGRAMMATIC_INPUT = value; }

    private static _AUTOPLAY: boolean;
    static get AUTOPLAY() { return this.DEBUG && this._AUTOPLAY; }
    static set AUTOPLAY(value: boolean) { this._AUTOPLAY = value; }

    private static _SKIP_MAIN_MENU_STAGE: () => World;
    static get SKIP_MAIN_MENU_STAGE() { return this.DEBUG ? this._SKIP_MAIN_MENU_STAGE : undefined; }
    static set SKIP_MAIN_MENU_STAGE(value: () => World) { this._SKIP_MAIN_MENU_STAGE = value; }

    private static _FRAME_STEP_ENABLED: boolean;
    static get FRAME_STEP_ENABLED() { return this.DEBUG && this._FRAME_STEP_ENABLED; }
    static set FRAME_STEP_ENABLED(value: boolean) { this._FRAME_STEP_ENABLED = value; }
    static frameStepSkipFrame() {
        return this.FRAME_STEP_ENABLED && !(Input.justDown(Input.DEBUG_FRAME_SKIP_STEP) || Input.isDown(Input.DEBUG_FRAME_SKIP_RUN));
    }

    private static _RESET_OPTIONS_AT_START: boolean;
    static get RESET_OPTIONS_AT_START() { return this.DEBUG && this._RESET_OPTIONS_AT_START; }
    static set RESET_OPTIONS_AT_START(value: boolean) { this._RESET_OPTIONS_AT_START = value; }

    static EXPERIMENTS: Dict<Experiment>;
}

function get(nameOrType: string | (new (...args) => WorldObject)) {
    let worldObject = _.isString(nameOrType)
                        ? global.world.select.nameAll(nameOrType)
                        : global.world.select.typeAll(nameOrType);
    if (_.isEmpty(worldObject)) return undefined;
    if (worldObject.length === 1) return worldObject[0];
    return worldObject;
}