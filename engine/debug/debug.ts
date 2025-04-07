namespace Debug {
    export type Config = {
        debug?: boolean;
        font?: string;
        fontStyle?: SpriteText.Style;
        showAllPhysicsBounds?: boolean;
        showTouches?: boolean;
        moveCameraWithArrows?: boolean; 
        showOverlay?: boolean;
        overlayFeeds?: ((world: World) => string | number)[];
        skipRate?: number;
        skipRateKeyModifier?: number;
        programmaticInput?: boolean;
        autoplay?: boolean;
        skipMainMenuStage?: () => World;
        frameStepEnabled?: boolean;
        resetOptionsAtStart?: boolean;
        forceMobile?: boolean;
        experiments?: Dict<Experiment>;
    }
}

class Debug {
    static init(config: Debug.Config) {
        Debug.DEBUG = config.debug ?? false;
        Debug.FONT = config.font ?? SpriteText.DEFAULT_FONT;
        Debug.FONT_STYLE = config.fontStyle ?? { color: 0xFFFFFF };
        Debug.SHOW_ALL_PHYSICS_BOUNDS = config.showAllPhysicsBounds ?? false;
        Debug.SHOW_TOUCHES = config.showTouches ?? true;
        Debug.MOVE_CAMERA_WITH_ARROWS = config.moveCameraWithArrows ?? true;
        Debug.SHOW_OVERLAY = Debug.DEBUG && (config.showOverlay ?? false);
        Debug.OVERLAY_FEEDS = config.overlayFeeds ?? [];
        Debug.SKIP_RATE = config.skipRate ?? 1;
        Debug.SKIP_RATE_KEY_MODIFIER_MAX = config.skipRateKeyModifier ?? 10;
        Debug.PROGRAMMATIC_INPUT = config.programmaticInput ?? false;
        Debug.AUTOPLAY = config.autoplay ?? false;
        Debug.SKIP_MAIN_MENU_STAGE = config.skipMainMenuStage;
        Debug.FRAME_STEP_ENABLED = config.frameStepEnabled ?? false;
        Debug.RESET_OPTIONS_AT_START = config.resetOptionsAtStart ?? false;
        Debug.FORCE_MOBILE = config.forceMobile ?? false;
        Debug.EXPERIMENTS = config.experiments ?? {};
    }

    static update() {
        for (let experiment in Debug.EXPERIMENTS) {
            Debug.EXPERIMENTS[experiment].update(experiment);
        }

        if (Debug.isDebugInputAllowed()) {
            if (Input.justDown(Input.DEBUG_TOGGLE_OVERLAY)) {
                Debug.SHOW_OVERLAY = Debug.DEBUG && !Debug.SHOW_OVERLAY;
            }

            if (Input.justDown(Input.DEBUG_FRAME_SKIP_STEP) || Input.justDown(Input.DEBUG_FRAME_SKIP_RUN)) {
                Debug.FRAME_STEP_ENABLED = true;
            }

            if (Input.justDown(Input.DEBUG_FRAME_SKIP_DISABLE)) {
                Debug.FRAME_STEP_ENABLED = false;
            }

            if (Debug.DEBUG && Input.justDown(Input.DEBUG_SCREENSHOT)) {
                Main.takeScreenshot(1, 'clipboard');
            }

            Debug._SKIP_RATE_KEY_MODIFIER = Input.isDown(Input.DEBUG_SKIP_RATE) ? Debug.SKIP_RATE_KEY_MODIFIER_MAX : 1;
        }
    }

    static isDebugInputAllowed() {
        if (global.world) {
            return global.world.allowDebugInput;
        }
        return true;
    }

    private static _DEBUG: boolean;
    static get DEBUG() { return this._DEBUG; }
    static set DEBUG(value: boolean) { this._DEBUG = value; }
    
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
    static OVERLAY_FEEDS: ((world: World) => string | number)[];

    private static _SKIP_RATE: number;
    private static _SKIP_RATE_KEY_MODIFIER: number = 1;
    static SKIP_RATE_KEY_MODIFIER_MAX: number;
    static get SKIP_RATE() { return this.DEBUG ? M.clamp(this._SKIP_RATE * this._SKIP_RATE_KEY_MODIFIER, 1, Infinity) : 1; }
    static set SKIP_RATE(value: number) { this._SKIP_RATE = value; }

    private static _PROGRAMMATIC_INPUT: boolean;
    static get PROGRAMMATIC_INPUT() { return this.DEBUG && this._PROGRAMMATIC_INPUT; }
    static set PROGRAMMATIC_INPUT(value: boolean) { this._PROGRAMMATIC_INPUT = value; }

    private static _AUTOPLAY: boolean;
    static get AUTOPLAY() { return this.DEBUG && this._AUTOPLAY; }
    static set AUTOPLAY(value: boolean) { this._AUTOPLAY = value; }

    private static _SKIP_MAIN_MENU_STAGE: Factory<World> | undefined;
    static get SKIP_MAIN_MENU_STAGE(): Factory<World> | undefined { return this.DEBUG ? this._SKIP_MAIN_MENU_STAGE : undefined; }
    static set SKIP_MAIN_MENU_STAGE(value: Factory<World> | undefined) { this._SKIP_MAIN_MENU_STAGE = value; }

    private static _FRAME_STEP_ENABLED: boolean;
    static get FRAME_STEP_ENABLED() { return this.DEBUG && this._FRAME_STEP_ENABLED; }
    static set FRAME_STEP_ENABLED(value: boolean) { this._FRAME_STEP_ENABLED = value; }
    static frameStepSkipFrame() {
        return this.FRAME_STEP_ENABLED && !(Input.justDown(Input.DEBUG_FRAME_SKIP_STEP) || Input.isDown(Input.DEBUG_FRAME_SKIP_RUN));
    }

    private static _RESET_OPTIONS_AT_START: boolean;
    static get RESET_OPTIONS_AT_START() { return this.DEBUG && this._RESET_OPTIONS_AT_START; }
    static set RESET_OPTIONS_AT_START(value: boolean) { this._RESET_OPTIONS_AT_START = value; }

    private static _FORCE_MOBILE: boolean;
    static get FORCE_MOBILE() { return this.DEBUG && this._FORCE_MOBILE; }
    static set FORCE_MOBILE(value: boolean) { this._FORCE_MOBILE = value; }

    static EXPERIMENTS: Dict<Experiment>;
}

function get(nameOrType: string | (new (...args: any[]) => any)) {
    if (!global.world) return undefined;
    let worldObjects = St.isString(nameOrType)
                        ? global.world.select.nameAll$(nameOrType)
                        : global.world.select.typeAll$(nameOrType);
    if (worldObjects.length === 1) return worldObjects[0];
    if (!A.isEmpty(worldObjects)) return A.clone(worldObjects);
    let modules = St.isString(nameOrType)
        ? undefined
        : global.world.select.modules$(nameOrType);
    return modules ? A.clone(modules) : undefined;
}