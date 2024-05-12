namespace Game {
    export type Config = {
        entryPointMenu: Factory<World>;
        mainMenu: Factory<World>;
        pauseMenu: Factory<World>;
        menuTheaterFactory?: Factory<MenuTheater>;
        gameTheaterFactory?: Factory<Theater>;
    }
}

class Game {
    menuTheater: MenuTheater;
    gameTheater: Theater;

    private overlay: DebugOverlay;
    private debugTouchSprite: PIXI.Sprite;

    private entryPointMenu: Factory<World>;
    private mainMenu: Factory<World>;
    private pauseMenu: Factory<World>;
    private menuTheaterFactory: Factory<MenuTheater>;
    private gameTheaterFactory: Factory<Theater>;

    soundManager: SoundManager;
    musicManager: MusicManager;
    get volume(): number { return Options.volume * (Debug.SKIP_RATE >= 100 ? 0.2 : 1); };

    get delta(): number { return Main.delta; }

    private container: PIXI.Container;

    constructor(config: Game.Config) {
        this.entryPointMenu = config.entryPointMenu;
        this.mainMenu = config.mainMenu;
        this.pauseMenu = config.pauseMenu;
        this.menuTheaterFactory = config.menuTheaterFactory || (() => new MenuTheater());
        this.gameTheaterFactory = config.gameTheaterFactory || (() => new Theater());

        this.soundManager = new SoundManager();
        this.musicManager = new MusicManager();

        this.menuTheater = this.menuTheaterFactory();
        this.gameTheater = this.gameTheaterFactory();

        this.overlay = new DebugOverlay();
        this.debugTouchSprite = new PIXI.Sprite(Textures.outlineCircle(10, 0xFF0000));

        this.container = new PIXI.Container();
    }

    start() {
        this.menuTheater.clearMenus();
        this.menuTheater.loadMenu(this.entryPointMenu);
        if (Debug.SKIP_MAIN_MENU_STAGE) {
            if (this.entryPointMenu.toString() !== this.mainMenu.toString()) {
                this.loadMainMenu();
            }
            this.startGame(Debug.SKIP_MAIN_MENU_STAGE);
        }
    }

    update() {
        this.updatePause();

        if (this.menuTheater.getCurrentMenu()) {
            this.menuTheater.isSkippingCutscene = false;  // Safeguard
            this.menuTheater.update();
        } else {
            this.gameTheater.isSkippingCutscene = false;  // Safeguard
            this.gameTheater.update();
        }

        this.updateOverlay();

        this.soundManager.volume = this.volume * Options.sfxVolume;
        this.soundManager.update(this.delta);
        this.musicManager.volume = this.volume * Options.musicVolume;
        this.musicManager.update(this.delta);
    }

    private updatePause() {
        if (!this.menuTheater.getCurrentMenu() && this.canPause() && Input.justDown(Input.GAME_PAUSE)) {
            Input.consume(Input.GAME_PAUSE);
            this.pauseGame();
        }
    }

    private updateOverlay() {
        if (Debug.SHOW_OVERLAY) {
            this.overlay.setCurrentWorldToDebug(this.menuTheater.getCurrentMenu() ?? this.gameTheater?.currentWorld);
            this.overlay.update();
        }
    }

    render() {
        let result = this.menuTheater.getCurrentMenu()
            ? this.menuTheater.render()
            : this.gameTheater.render()

        if (Debug.SHOW_OVERLAY) {
            result.pushAll(this.overlay.render());
        }

        if (Debug.SHOW_TOUCHES) {
            result.pushAll(this.renderTouches());
        }

        Render.diff(this.container, result);

        return FrameCache.array(this.container);
    }

    canPause(): boolean {
        if (!this.gameTheater) return false;
        return this.gameTheater.canPause();
    }


    loadMainMenu() {
        this.menuTheater.clearMenus();
        this.menuTheater.loadMenu(this.mainMenu);
        Persist.persist();
    }

    pauseGame() {
        this.menuTheater.loadMenu(this.pauseMenu);
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
        this.menuTheater.clearMenus();
    }

    stopMusic(fadeTime: number = 0) {
        this.musicManager.stopMusic(fadeTime);
    }

    unpauseGame() {
        this.menuTheater.clearMenus();
    }

    unpauseMusic(fadeTime: number = 0) {
        this.musicManager.unpauseMusic(fadeTime);
    }

    private loadTheater(stageToLoad: () => World, transition: Transition) {
        this.gameTheater = this.gameTheaterFactory();
        if (!(transition instanceof Transitions.Instant)) {
            this.gameTheater.loadStageImmediate(() => this.worldForMenuTransition());
        }
        this.gameTheater.loadStageImmediate(stageToLoad, transition);
    }

    private worldForMenuTransition() {
        let world = new World();
        let currentMenu = this.menuTheater.getCurrentMenu();
        if (currentMenu) {
            let screenshot = currentMenu.takeScreenshot();
            world.addWorldObject(new Sprite({
                texture: screenshot.texture,
                scale: 1 / screenshot.upscale,
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