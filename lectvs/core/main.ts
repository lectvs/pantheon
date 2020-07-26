/// <reference path="../core/preload.ts" />

namespace Main {
    export type Config = {
        gameCodeName: string;
        gameWidth: number;
        gameHeight: number;
        canvasScale: number;
        backgroundColor: number;
        defaultZBehavior?: WorldObject.ZBehavior;

        preloadBackgroundColor: number;
        preloadProgressBarColor: number;

        textures?: Dict<Preload.Texture>;
        sounds?: Dict<Preload.Sound>;
        pyxelTilemaps?: Dict<Preload.PyxelTilemap>;
        spriteTextTags?: Dict<SpriteText.TagFunction>;

        defaultOptions: Options.Options;

        game: Game.Config;

        debug: Debug.Config;
    }
}

class Main {
    private static config: Main.Config;

    static game: Game;
    static soundManager: GlobalSoundManager;
    static metricsManager: MetricsManager;
    static renderer: PIXI.Renderer;
    static screen: BasicTexture;
    static delta: number;

    static loadConfig(config: Main.Config) {
        this.config = config;
    }

    private static start() {
        if (!this.config) {
            error('No main config loaded! Must load config by calling `Main.loadConfig(config);`');
            return;
        }
        this.preload();
    }

    private static preload() {
        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        Debug.init(this.config.debug);

        global.gameCodeName = this.config.gameCodeName;
        global.gameWidth = this.config.gameWidth;
        global.gameHeight = this.config.gameHeight;
        global.backgroundColor = this.config.backgroundColor;
        WorldObject.DEFAULT_Z_BEHAVIOR = this.config.defaultZBehavior ?? 'noop';
        SpriteText.addTags(this.config.spriteTextTags ?? {});

        Main.renderer = PIXI.autoDetectRenderer({
            width: global.gameWidth,
            height: global.gameHeight,
            resolution: this.config.canvasScale,
            backgroundColor: global.backgroundColor,
        });
        document.body.appendChild(Main.renderer.view);

        // AccessibilityManager causes game to crash when Tab is pressed.
        // Deleting it as per https://github.com/pixijs/pixi.js/issues/5111#issuecomment-420047824
        Main.renderer.plugins.accessibility.destroy();
        delete Main.renderer.plugins.accessibility;

        Main.screen = new BasicTexture(global.gameWidth, global.gameHeight);

        this.soundManager = new GlobalSoundManager();
        
        WebAudio.initContext();

        Preload.preload({
            textures: this.config.textures,
            sounds: this.config.sounds,
            pyxelTilemaps: this.config.pyxelTilemaps,
            progressCallback: (progress) => this.renderPreloadProgress(progress),
            onLoad: () => {
                Main.load();
                Main.play();
            }
        });
    }

    private static load() {
        Options.updateCallbacks.push(() => Input.init());
        Options.init(global.gameCodeName, this.config.defaultOptions);

        window.addEventListener("keypress", event => {
            WebAudio.start();
        });
        window.addEventListener("keydown", event => {
            WebAudio.start();
            Input.handleKeyDownEvent(event);
            if (event.key == 'Tab') {
                event.preventDefault();
            }
        }, false);
        window.addEventListener("keyup", event => {
            WebAudio.start();
            Input.handleKeyUpEvent(event);
        }, false);
        window.addEventListener("mousedown", event => {
            WebAudio.start();
            Input.handleMouseDownEvent(event);
        }, false);
        window.addEventListener("mouseup", event => {
            WebAudio.start();
            Input.handleMouseUpEvent(event);
        }, false);
        window.addEventListener("contextmenu", event => {
            WebAudio.start();
            event.preventDefault();
        }, false);

        this.metricsManager = new MetricsManager();

        this.delta = 0;
        this.game = new Game(this.config.game);
        this.game.update(); // Update game once just to make sure everything is set up correctly.
    }

    private static play() {
        PIXI.Ticker.shared.add(frameDelta => {
            this.metricsManager.update();

            global.metrics.startSpan('frame');
            global.fpsCalculator.update();

            Main.delta = frameDelta/60;

            global.clearStacks();

            global.metrics.startSpan('update');
            for (let i = 0; i < Debug.SKIP_RATE; i++) {
                Input.update();
                if (Debug.frameStepSkipFrame()) break;
                Main.soundManager.preGameUpdate();
                global.metrics.startSpan('game');
                Main.game.update();
                global.metrics.endSpan('game');
                Main.soundManager.postGameUpdate();
            }
            global.metrics.endSpan('update');

            global.metrics.startSpan('render');
            Main.screen.clear();

            global.metrics.startSpan('game');
            Main.game.render(Main.screen);
            global.metrics.endSpan('game');

            Main.renderScreenToCanvas();
            global.metrics.endSpan('render');

            global.metrics.endSpan('frame');
        });
    }

    private static renderScreenToCanvas() {
        Main.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true);  // Clear the renderer
        Main.renderer.render(Main.screen.renderTextureSprite);
    }

    // For use in preload.
    private static renderPreloadProgress(progress: number) {
        Main.screen.clear();

        Draw.brush.color = this.config.preloadBackgroundColor;
        Draw.brush.alpha = 1;
        Draw.fill(Main.screen);

        let barw = global.gameWidth/2;
        let barh = 16;
        let barx = global.gameWidth/2 - barw/2;
        let bary = global.gameHeight/2 - barh/2;

        Draw.brush.color = this.config.preloadProgressBarColor;
        Draw.brush.thickness = 1;
        Draw.rectangleSolid(Main.screen, barx, bary, barw * progress, barh);
        Draw.rectangleOutline(Main.screen, barx, bary, barw, barh, Draw.ALIGNMENT_INNER);

        Main.renderScreenToCanvas();
    }
}
