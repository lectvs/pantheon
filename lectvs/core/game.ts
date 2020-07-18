namespace Game {
    export type Config = {
        entryPointMenuClass: Menu.MenuClass;
        pauseMenuClass: Menu.MenuClass;
        theaterClass: Theater.TheaterClass;
        theaterConfig: Theater.Config;
        showMetricsMenuKey: string;
    }
}

class Game {
    menuSystem: MenuSystem;
    theater: Theater;

    private entryPointMenuClass: Menu.MenuClass;
    private pauseMenuClass: Menu.MenuClass;
    private theaterClass: Theater.TheaterClass;
    private theaterConfig: Theater.Config;
    private showMetricsMenuKey: string;

    private soundManager: SoundManager;
    get volume(): number { return Options.volume; };

    constructor(config: Game.Config) {
        this.entryPointMenuClass = config.entryPointMenuClass;
        this.pauseMenuClass = config.pauseMenuClass;
        this.theaterClass = config.theaterClass;
        this.theaterConfig = config.theaterConfig;
        this.showMetricsMenuKey = config.showMetricsMenuKey;

        this.soundManager = new SoundManager();

        this.menuSystem = new MenuSystem(this);
        this.loadMainMenu();

        if (Debug.SKIP_MAIN_MENU) {
            this.startGame();
        }
    }

    update(delta: number) {
        this.updatePause();
        this.updateMetrics();

        if (this.menuSystem.inMenu) {
            global.metrics.startSpan('menu');
            this.menuSystem.update(delta);
            global.metrics.endSpan('menu');
        } else {
            global.metrics.startSpan('theater');
            this.theater.update(delta);
            global.metrics.endSpan('theater');
        }

        this.soundManager.volume = this.volume;
        this.soundManager.update(delta);
    }

    private updatePause() {
        if (Input.justDown('pause') && !this.menuSystem.inMenu) {
            Input.consume('pause');
            this.pauseGame();
        }
    }

    private updateMetrics() {
        if (Debug.DEBUG && Input.justDown(this.showMetricsMenuKey)) {
            global.game.menuSystem.loadMenu(MetricsMenu);
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
    }

    loadMainMenu() {
        this.menuSystem.loadMenu(this.entryPointMenuClass);
    }

    loadTheater() {
        this.theater = new this.theaterClass(this.theaterConfig);
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