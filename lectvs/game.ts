namespace Game {
    export type Config = {
        mainMenuClass: any;
        pauseMenuClass: any;
        theaterClass: any;
        theaterConfig: Theater.Config;
        showMetricsMenuKey: string;
    }
}

class Game {
    fpsMetricManager: FPSMetricManager;
    menuSystem: MenuSystem;
    theater: Theater;
    sounds: Sound[];

    private mainMenuClass: any;
    private pauseMenuClass: any;
    private theaterClass: any;
    private theaterConfig: Theater.Config;

    private showMetricsMenuKey: string;

    constructor(config: Game.Config) {
        this.sounds = [];

        this.mainMenuClass = config.mainMenuClass;
        this.pauseMenuClass = config.pauseMenuClass;
        this.theaterClass = config.theaterClass;
        this.theaterConfig = config.theaterConfig;

        this.showMetricsMenuKey = config.showMetricsMenuKey;

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

        this.updateSounds(delta);
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

    private updateSounds(delta: number) {
        for (let i = this.sounds.length-1; i >= 0; i--) {
            if (!this.sounds[i].paused) {
                this.sounds[i].update(delta);
            }
            if (this.sounds[i].done) {
                this.sounds.splice(i, 1);
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
        //global.theater.runScript(S.fadeOut(0)).finishImmediately();
    }

    pauseGame() {
        this.menuSystem.loadMenu(this.pauseMenuClass);
    }

    playSound(key: string) {
        let sound = new Sound(key);
        this.sounds.push(sound);
        return sound;
    }

    startGame() {
        this.loadTheater();
        this.menuSystem.clear();
    }

    unpauseGame() {
        this.menuSystem.clear();
    }
}