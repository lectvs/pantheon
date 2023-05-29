namespace Game {
    export type Config = {
        entryPointMenu: Factory<Menu>;
        mainMenu: Factory<Menu>;
        pauseMenu: Factory<Menu>;
        theaterFactory: Factory<Theater>;
    }
}

class Game {
    menuSystem: MenuSystem;
    theater: Theater;

    private overlay: DebugOverlay;
    private isShowingOverlay: boolean;

    allowPauseWithPauseKey: boolean;

    private entryPointMenu: Factory<Menu>;
    private mainMenu: Factory<Menu>;
    private pauseMenu: Factory<Menu>;
    private theaterFactory: Factory<Theater>;

    soundManager: SoundManager;
    musicManager: MusicManager;
    get volume(): number { return Options.volume * (Debug.SKIP_RATE >= 100 ? 0.2 : 1); };
    get currentMusicKey() { return this.musicManager ? this.musicManager.currentMusicKey : undefined; }

    get delta(): number { return Main.delta; }

    constructor(config: Game.Config) {
        this.entryPointMenu = config.entryPointMenu;
        this.mainMenu = config.mainMenu;
        this.pauseMenu = config.pauseMenu;
        this.theaterFactory = config.theaterFactory;

        this.soundManager = new SoundManager();
        this.musicManager = new MusicManager();

        this.menuSystem = new MenuSystem(this);

        this.overlay = new DebugOverlay();
        this.isShowingOverlay = true;
        this.allowPauseWithPauseKey = true;
    }

    start() {
        this.menuSystem.clear();
        this.menuSystem.loadMenu(this.entryPointMenu);
        if (Debug.SKIP_MAIN_MENU_STAGE) {
            this.loadMainMenu();
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
        this.musicManager.baseVolume = this.volume * Options.musicVolume;
        this.musicManager.update(this.delta);
    }

    private updatePause() {
        if (!this.menuSystem.inMenu && this.allowPauseWithPauseKey && this.theater.canPause && Input.justDown(Input.GAME_PAUSE)) {
            Input.consume(Input.GAME_PAUSE);
            this.pauseGame();
        }
    }

    private updateOverlay() {
        if (Input.justDown(Input.DEBUG_TOGGLE_OVERLAY)) {
            this.isShowingOverlay = !this.isShowingOverlay;
        }

        if (this.isShowingOverlay && Debug.SHOW_OVERLAY) {
            this.overlay.setCurrentWorldToDebug(this.menuSystem.inMenu ? this.menuSystem.currentMenu : this.theater?.currentWorld);
            this.overlay.update();
        }
    }

    render(screen: Texture) {
        if (this.menuSystem.inMenu) {
            this.menuSystem.render(screen);

        } else {
            this.theater.render(screen, 0, 0);
        }

        if (this.isShowingOverlay && Debug.SHOW_OVERLAY) {
            this.overlay.render(screen, 0, 0);
        }

        if (Debug.SHOW_TOUCHES) {
            this.renderTouches(screen);
        }
    }

    loadMainMenu() {
        this.menuSystem.clear();
        this.menuSystem.loadMenu(this.mainMenu);
        Persist.persist();
    }

    loadTheater(stageToLoad: () => World) {
        this.theater = this.theaterFactory();
        this.theater.loadStageImmediate(stageToLoad);
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

    startGame(stageToLoad: () => World) {
        this.loadTheater(stageToLoad);
        this.menuSystem.clear();
    }

    stopMusic(fadeTime: number = 0) {
        this.musicManager.stopMusic(fadeTime);
    }

    unpauseGame() {
        this.menuSystem.clear();
    }

    unpauseMusic() {
        this.musicManager.unpauseMusic();
    }

    private renderTouches(screen: Texture) {
        if (IS_MOBILE && Input.isKeyCodeDown(Input.MOUSE_KEYCODES[0])) {
            Draw.brush.color = 0xFF0000;
            Draw.brush.alpha = 1;
            Draw.brush.thickness = 1;
            Draw.circleOutline(screen, Input.mouseX, Input.mouseY, Input.mouseRadius, Draw.ALIGNMENT_INNER);
        }
    }
}