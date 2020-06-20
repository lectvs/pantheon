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

    soundManager: SoundManager;

    private _paused: boolean;
    get paused() { return this._paused; }

    private mainMenuClass: any;
    private pauseMenuClass: any;
    private theaterClass: any;
    private theaterConfig: Theater.Config;

    constructor(config: Game.Config) {
        this.mainMenuClass = config.mainMenuClass;
        this.pauseMenuClass = config.pauseMenuClass;
        this.theaterClass = config.theaterClass;
        this.theaterConfig = config.theaterConfig;

        this._paused = true;

        this.soundManager = new SoundManager();

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

        this.soundManager.update();
    }

    updatePause() {
        if (Input.justDown('pause') && !this.menuSystem.inMenu) {
            Input.consume('pause');
            this.pauseGame();
        }

        if (this.menuSystem.inMenu) {
            if (!this._paused) {
                this._paused = true;
                this.onPause();
            }
        } else {
            if (this._paused) {
                this._paused = false;
                this.onUnpause();
            }
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
        global.theater.runScript(S.fadeOut(0)).finishImmediately();
    }

    onPause() {
        if (this.theater) this.theater.onPause();
        WebAudio.worldContext.suspend();
    }

    onUnpause() {
        if (this.theater) this.theater.onUnpause();
        WebAudio.worldContext.resume();
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