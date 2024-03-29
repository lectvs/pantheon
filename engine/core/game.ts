namespace Game {
    export type Config = {
        entryPointMenu: Factory<Menu>;
        mainMenu: Factory<Menu>;
        pauseMenu: Factory<Menu>;
        theaterFactory?: Factory<Theater>;
    }
}

class Game {
    menuSystem: MenuSystem;
    theater: Theater;

    private overlay: DebugOverlay;
    private debugTouchSprite: PIXI.Sprite;

    get canPause(): boolean { return this.theater?.canPause ?? false; }

    private entryPointMenu: Factory<Menu>;
    private mainMenu: Factory<Menu>;
    private pauseMenu: Factory<Menu>;
    private theaterFactory: Factory<Theater>;

    soundManager: SoundManager;
    musicManager: MusicManager;
    get volume(): number { return Options.volume * (Debug.SKIP_RATE >= 100 ? 0.2 : 1); };
    get currentMusicKey(): string | undefined { return this.musicManager.getCurrentMusicKey(); }

    get delta(): number { return Main.delta; }

    private container: PIXI.Container;

    constructor(config: Game.Config) {
        this.entryPointMenu = config.entryPointMenu;
        this.mainMenu = config.mainMenu;
        this.pauseMenu = config.pauseMenu;
        this.theaterFactory = config.theaterFactory || (() => new Theater());

        this.soundManager = new SoundManager();
        this.musicManager = new MusicManager();

        this.menuSystem = new MenuSystem(this);
        this.theater = this.theaterFactory();

        this.overlay = new DebugOverlay();
        this.debugTouchSprite = new PIXI.Sprite(Textures.outlineCircle(10, 0xFF0000));

        this.container = new PIXI.Container;
    }

    start() {
        this.menuSystem.clear();
        this.menuSystem.loadMenu(this.entryPointMenu);
        if (Debug.SKIP_MAIN_MENU_STAGE) {
            if (this.entryPointMenu.toString() !== this.mainMenu.toString()) {
                this.loadMainMenu();
            }
            this.startGame(Debug.SKIP_MAIN_MENU_STAGE);
        }
    }

    update() {
        this.updatePause();

        if (this.menuSystem.inMenu) {
            this.menuSystem.update();
        } else {
            this.theater.isSkippingCutscene = false;  // Safeguard
            this.theater.update();
        }

        this.updateOverlay();

        this.soundManager.volume = this.volume * Options.sfxVolume;
        this.soundManager.update(this.delta);
        this.musicManager.volume = this.volume * Options.musicVolume;
        this.musicManager.update(this.delta);
    }

    private updatePause() {
        if (!this.menuSystem.inMenu && this.canPause && Input.justDown(Input.GAME_PAUSE)) {
            Input.consume(Input.GAME_PAUSE);
            this.pauseGame();
        }
    }

    private updateOverlay() {
        if (Debug.SHOW_OVERLAY) {
            this.overlay.setCurrentWorldToDebug(this.menuSystem.inMenu ? this.menuSystem.currentMenu : this.theater?.currentWorld);
            this.overlay.update();
        }
    }

    render() {
        let result = this.menuSystem.inMenu
            ? this.menuSystem.render()
            : this.theater.render()

        if (Debug.SHOW_OVERLAY) {
            result.pushAll(this.overlay.render());
        }

        if (Debug.SHOW_TOUCHES) {
            result.pushAll(this.renderTouches());
        }

        Render.diff(this.container, result);

        return this.container;
    }

    loadMainMenu() {
        this.menuSystem.clear();
        this.menuSystem.loadMenu(this.mainMenu);
        Persist.persist();
    }

    pauseGame() {
        this.menuSystem.loadMenu(this.pauseMenu);
    }

    pauseMusic(fadeTime: number = 0) {
        this.musicManager.pauseMusic(fadeTime);
    }

    playMusic(key: string, fadeTime: number = 0) {
        this.musicManager.playMusic(key, fadeTime);
    }

    playSound(key: string) {
        if (global.theater?.isSkippingCutscene) return new Sound(key);
        return this.soundManager.playSound(key);
    }

    startGame(stageToLoad: () => World, transition: Transition = new Transitions.Instant()) {
        this.loadTheater(stageToLoad, transition);
        this.menuSystem.clear();
    }

    stopMusic(fadeTime: number = 0) {
        this.musicManager.stopMusic(fadeTime);
    }

    unpauseGame() {
        this.menuSystem.clear();
    }

    unpauseMusic(fadeTime: number = 0) {
        this.musicManager.unpauseMusic(fadeTime);
    }

    private loadTheater(stageToLoad: () => World, transition: Transition) {
        this.theater = this.theaterFactory();
        if (!(transition instanceof Transitions.Instant)) {
            this.theater.loadStageImmediate(() => this.worldForMenuTransition());
        }
        this.theater.loadStageImmediate(stageToLoad, transition);
    }

    private worldForMenuTransition() {
        let world = new World();
        let renderResult = this.menuSystem.render();
        if (renderResult) {
            let screenshot = newPixiRenderTexture(global.gameWidth, global.gameHeight, 'Game.worldForMenuTransition');
            renderToRenderTexture(renderResult, screenshot);
            world.addWorldObject(new Sprite({
                texture: screenshot,
            }));
        }
        return world;
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