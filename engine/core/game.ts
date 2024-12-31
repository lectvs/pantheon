namespace Game {
    export type Config = {
        entryPointMenu: Factory<World>;
        mainMenu: Factory<World>;
        pauseMenu: Factory<World>;
        menuTheaterFactory?: Factory<Theater>;
        gameTheaterFactory?: Factory<Theater>;
    }
}

class Game {
    menuTheater: Theater;
    gameTheater: Theater;

    private overlay: DebugOverlay;
    private debugTouchSprite: PIXI.Sprite;

    private entryPointMenu: Factory<World>;
    private mainMenu: Factory<World>;
    private pauseMenu: Factory<World>;
    private menuTheaterFactory: Factory<Theater>;
    private gameTheaterFactory: Factory<Theater>;

    stageManager: StageManager;
    soundManager: SoundManager;
    musicManager: MusicManager;
    get volume(): number { return Options.volume * (Debug.SKIP_RATE >= 100 ? 0.2 : 1); };

    endOfFrameQueue: (() => any)[];

    private container: PIXI.Container;

    constructor(config: Game.Config) {
        this.entryPointMenu = config.entryPointMenu;
        this.mainMenu = config.mainMenu;
        this.pauseMenu = config.pauseMenu;
        this.menuTheaterFactory = config.menuTheaterFactory || (() => new Theater());
        this.gameTheaterFactory = config.gameTheaterFactory || (() => new Theater());

        this.stageManager = new StageManager();
        this.soundManager = new SoundManager({
            volume: 1,
            humanizeByDefault: false,
        });
        this.musicManager = new MusicManager();

        this.menuTheater = this.menuTheaterFactory();
        this.gameTheater = this.gameTheaterFactory();

        this.overlay = new DebugOverlay();
        this.debugTouchSprite = new PIXI.Sprite(Textures.outlineCircle(10, 0xFF0000));

        this.endOfFrameQueue = [];

        this.container = new PIXI.Container();
    }

    start() {
        this.stageManager.reset();
        this.stageManager.loadImmediate(this.entryPointMenu, new Transitions.Instant(), false);
        if (Debug.SKIP_MAIN_MENU_STAGE) {
            if (this.entryPointMenu.toString() !== this.mainMenu.toString()) {
                this.loadMainMenu();
            }
            this.startGame(Debug.SKIP_MAIN_MENU_STAGE);
        }
    }

    update() {
        this.stageManager.update();

        this.updatePause();

        let currentTheater = this.getCurrentTheater();
        currentTheater.isSkippingCutscene = false;  // Safeguard
        currentTheater.update();

        let currentWorld = this.stageManager.getCurrentWorld();

        this.updateOverlay();

        this.soundManager.volume = this.volume * Options.sfxVolume;
        this.soundManager.update(Main.delta);

        this.musicManager.volume = this.volume * Options.musicVolume;

        if (!currentWorld) {
            this.musicManager.update(Main.delta);
        } else if (currentWorld.music.action !== 'block') {
            this.musicManager.volume *= currentWorld.music.volumeScale;
            this.musicManager.update(Main.delta);
        }

        while (!A.isEmpty(this.endOfFrameQueue)) {
            this.endOfFrameQueue.shift()!();
        }
    }

    private updatePause() {
        if (!this.stageManager.isInMenu() && this.canPause() && Input.justDown(Input.GAME_PAUSE)) {
            Input.consume(Input.GAME_PAUSE);
            this.pauseGame();
        }
    }

    private updateOverlay() {
        if (Debug.SHOW_OVERLAY) {
            this.overlay.setCurrentWorldToDebug(this.stageManager.getCurrentWorld());
            this.overlay.update();
        }
    }

    render() {
        let result: Render.Result = FrameCache.array();
        result.pushAll(this.stageManager.render());

        result.pushAll(this.getCurrentTheater().render());

        if (Debug.SHOW_OVERLAY) {
            result.pushAll(this.overlay.render());
        }

        if (Debug.SHOW_TOUCHES) {
            result.pushAll(this.renderTouches());
        }

        Render.diff(this.container, result);

        return FrameCache.array(this.container);
    }

    back(transition: Transition = new Transitions.Instant()) {
        this.stageManager.back(transition);
    }

    canPause(): boolean {
        let currentWorld = this.stageManager.getCurrentWorld();
        if (!currentWorld) return false;
        return currentWorld.allowPause;
    }

    getCurrentTheater() {
        if (this.stageManager.isInMenu()) return this.menuTheater;
        return this.gameTheater;
    }

    loadMainMenu() {
        this.stageManager.reset();
        this.stageManager.loadImmediate(this.mainMenu, new Transitions.Instant(), false);
        Persist.persist();
    }

    pauseGame(transition: Transition = new Transitions.Instant()) {
        this.stageManager.loadImmediate(this.pauseMenu, transition, true);
    }

    playSound(key: string) {
        if (global.theater?.isSkippingCutscene) return new BasicSound(key);
        return this.soundManager.playSound(key);
    }

    runAtEndOfFrame(fn: () => any) {
        this.endOfFrameQueue.push(fn);
    }

    startGame(stageToLoad: () => World, transition: Transition = new Transitions.Instant()) {
        this.gameTheater = this.gameTheaterFactory();
        this.stageManager.loadImmediate(stageToLoad, transition, false);
    }

    takeScreenshot(): World.Screenshot {
        let screen = newPixiRenderTexture(
            W * global.upscale,
            H * global.upscale,
            'Game.takeSnapshot');
        let container = new PIXI.Container();
        container.scale.set(global.upscale);
        Render.diff(container, this.render());
        Render.upscalePixiObjectProperties(container, 'upscale');
        renderToRenderTexture(container, screen);
        Render.upscalePixiObjectProperties(container, 'downscale');
        return {
            texture: screen,
            upscale: global.upscale,
        };
    }

    unpauseGame(transition: Transition = new Transitions.Instant()) {
        this.stageManager.clearMenus(transition);
    }

    private renderTouches() {
        if (!IS_MOBILE || !Input.isKeyCodeDown(Input.MOUSE_KEYCODES[0])) {
            return FrameCache.array();
        }
        this.debugTouchSprite.x = Input.mouseX;
        this.debugTouchSprite.y = Input.mouseY;
        return FrameCache.array(this.debugTouchSprite);
    }
}