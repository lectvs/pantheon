namespace Game {
    export type Config = {
        mainMenuClass: any;
        pauseMenuClass: any;
        theaterClass: any;
        theaterConfig: Theater.Config;
    }
}

class Game {
    fpsMetricManager: FPSMetricManager;
    menuSystem: MenuSystem;
    theater: Theater;

    get isPaused() { return this.menuSystem.inMenu && this.menuSystem.currentMenu instanceof this.pauseMenuClass; }

    private mainMenuClass: any;
    private pauseMenuClass: any;
    private theaterClass: any;
    private theaterConfig: Theater.Config;

    constructor(config: Game.Config) {
        this.mainMenuClass = config.mainMenuClass;
        this.pauseMenuClass = config.pauseMenuClass;
        this.theaterClass = config.theaterClass;
        this.theaterConfig = config.theaterConfig;

        this.fpsMetricManager = new FPSMetricManager(1);
        this.menuSystem = new MenuSystem(this);

        this.loadMainMenu();

        if (Debug.SKIP_MAIN_MENU) {
            this.startGame();
        }
    }

    update(delta: number) {
        this.fpsMetricManager.update(delta);

        this.updatePause();

        if (this.menuSystem.inMenu) {
            this.menuSystem.update(delta);
        } else {
            this.theater.update(delta);
        }
    }

    updatePause() {
        if (this.menuSystem.inMenu) {
            if (Input.justDown('pause') && this.isPaused) {
                this.unpauseGame();
            }
        } else {
            if (Input.justDown('pause')) {
                this.pauseGame();
            }
        }
    }

    render(screen: Texture) {
        if (this.menuSystem.inMenu) {
            this.menuSystem.render(screen);
        } else {
            this.theater.render(screen);
        }
    }

    loadMainMenu() {
        this.menuSystem.loadMenu(this.mainMenuClass);
    }

    loadTheater() {
        this.theater = new this.theaterClass(this.theaterConfig);
        global.theater = this.theater;

        // fade out since the cutscene can't do this in 1 frame
        global.theater.runScript(S.fadeOut(0)).finishImmediately();
    }

    pauseGame() {
        this.menuSystem.loadMenu(this.pauseMenuClass);
    }

    startGame() {
        this.loadTheater();
        this.menuSystem.clear();
    }

    unpauseGame() {
        this.menuSystem.clear();
    }
}