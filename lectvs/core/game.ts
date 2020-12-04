namespace Game {
    export type Config = {
        entryPointMenuClass: Menu.MenuClass;
        pauseMenuClass: Menu.MenuClass;
        theaterConfig: Theater.Config;
    }
}

class Game {
    menuSystem: MenuSystem;
    theater: Theater;

    private overlay: DebugOverlay;
    private isShowingOverlay: boolean;

    private entryPointMenuClass: Menu.MenuClass;
    private pauseMenuClass: Menu.MenuClass;
    private theaterConfig: Theater.Config;

    private soundManager: SoundManager;
    get volume(): number { return Options.volume; };

    get delta(): number { return Main.delta; }

    constructor(config: Game.Config) {
        this.entryPointMenuClass = config.entryPointMenuClass;
        this.pauseMenuClass = config.pauseMenuClass;
        this.theaterConfig = config.theaterConfig;

        this.soundManager = new SoundManager();

        this.menuSystem = new MenuSystem(this);
        this.loadMainMenu();

        this.overlay = new DebugOverlay();
        this.isShowingOverlay = true;

        if (Debug.SKIP_MAIN_MENU) {
            this.startGame();
        }
    }

    update() {
        this.updatePause();
        this.updateMetrics();

        if (this.menuSystem.inMenu) {
            global.metrics.startSpan('menu');
            this.menuSystem.update();
            global.metrics.endSpan('menu');
        } else {
            global.metrics.startSpan('theater');
            this.theater.isSkippingCutscene = false;  // Safeguard
            this.theater.update();
            global.metrics.endSpan('theater');
        }

        global.metrics.startSpan('debugOverlay');
        this.updateOverlay();
        global.metrics.endSpan('debugOverlay');

        global.metrics.startSpan('soundManager');
        this.soundManager.volume = this.volume;
        this.soundManager.update(this.delta);
        global.metrics.endSpan('soundManager');
    }

    private updatePause() {
        if (Input.justDown(Input.GAME_PAUSE) && !this.menuSystem.inMenu) {
            Input.consume(Input.GAME_PAUSE);
            this.pauseGame();
        }
    }

    private updateMetrics() {
        if (Debug.DEBUG && Input.justDown(Input.DEBUG_SHOW_METRICS_MENU)) {
            global.game.menuSystem.loadMenu(MetricsMenu);
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
            global.metrics.startSpan('menu');
            this.menuSystem.render(screen);
            global.metrics.endSpan('menu');

        } else {
            global.metrics.startSpan('theater');
            this.theater.render(screen);
            global.metrics.endSpan('theater');
        }

        if (this.isShowingOverlay && Debug.SHOW_OVERLAY) {
            global.metrics.startSpan('debugOverlay');
            this.overlay.render(screen);
            global.metrics.endSpan('debugOverlay');

        }
    }

    loadMainMenu() {
        this.menuSystem.loadMenu(this.entryPointMenuClass);
    }

    loadTheater() {
        this.theater = new Theater(this.theaterConfig);
    }

    pauseGame() {
        this.menuSystem.loadMenu(this.pauseMenuClass);
    }

    playSound(key: string) {
        return this.soundManager.playSound(key);
    }

    startGame() {
        this.loadTheater();
        this.menuSystem.clear();
    }

    unpauseGame() {
        this.menuSystem.clear();
    }
}