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

    private mainMenuClass: any;
    private pauseMenuClass: any;
    private theaterClass: any;
    private theaterConfig: Theater.Config;

    constructor(config: Game.Config) {
        this.mainMenuClass = config.mainMenuClass;
        this.pauseMenuClass = config.pauseMenuClass;
        this.theaterClass = config.theaterClass;
        this.theaterConfig = config.theaterConfig;

        this.menuSystem = new MenuSystem(this);
        this.loadMainMenu();

        if (Debug.SKIP_MAIN_MENU) {
            this.startGame();
        }
    }

    update(delta: number) {
        this.updatePause();

        if (this.menuSystem.inMenu) {
            global.metrics.startSpan('menu');
            this.menuSystem.update(delta);
            global.metrics.endSpan('menu');
        } else {
            global.metrics.startSpan('theater');
            this.theater.update(delta);
            global.metrics.endSpan('theater');
        }
    }

    updatePause() {
        if (Input.justDown('pause') && !this.menuSystem.inMenu) {
            Input.consume('pause');
            this.pauseGame();
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
        this.menuSystem.loadMenu(this.mainMenuClass);
    }

    loadTheater() {
        this.theater = new this.theaterClass(this.theaterConfig);
        global.theater = this.theater;

        // fade out since the cutscene can't do this in 1 frame
        //global.theater.runScript(S.fadeOut(0)).finishImmediately();
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