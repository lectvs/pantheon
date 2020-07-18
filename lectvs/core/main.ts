/// <reference path="../core/preload.ts" />

namespace Main {
    export type Config = {
        gameCodeName: string;
        gameWidth: number;
        gameHeight: number;
        canvasScale: number;
        backgroundColor: number;
        defaultZBehavior?: WorldObject.ZBehavior;

        textures: Dict<Preload.Texture>;
        sounds: Dict<Preload.Sound>;
        pyxelTilemaps: Dict<Preload.PyxelTilemap>;
        spriteTextTags: Dict<SpriteText.TagFunction>;

        defaultOptions: Options.Options;

        game: Game.Config;

        debug: Debug.Config;
    }
}

class Main {
    static game: Game;
    static soundManager: GlobalSoundManager;
    static metricsManager: MetricsManager;
    static renderer: PIXI.Renderer;
    static screen: Texture;
    static delta: number;

    static start(config: Main.Config) {
        this.preload(config);
    }

    private static preload(config: Main.Config) {
        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        Debug.init(config.debug);

        global.gameCodeName = config.gameCodeName;
        global.gameWidth = config.gameWidth;
        global.gameHeight = config.gameHeight;
        global.backgroundColor = config.backgroundColor;
        WorldObject.DEFAULT_Z_BEHAVIOR = config.defaultZBehavior ?? 'noop';

        Main.renderer = PIXI.autoDetectRenderer({
            width: global.gameWidth,
            height: global.gameHeight,
            resolution: config.canvasScale,
            backgroundColor: global.backgroundColor,
        });
        this.soundManager = new GlobalSoundManager();
        
        WebAudio.initContext();

        Preload.preload({
            textures: config.textures,
            sounds: config.sounds,
            pyxelTilemaps: config.pyxelTilemaps,
            spriteTextTags: config.spriteTextTags,
            onLoad: () => {
                Main.load(config);
                Main.play();
            }
        });
    }

    private static load(config: Main.Config) {
        document.body.appendChild(Main.renderer.view);

        Options.updateCallbacks.push(() => Input.init());
        Options.init(global.gameCodeName, config.defaultOptions);

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

        // AccessibilityManager causes game to crash when Tab is pressed.
        // Deleting it as per https://github.com/pixijs/pixi.js/issues/5111#issuecomment-420047824
        Main.renderer.plugins.accessibility.destroy();
        delete Main.renderer.plugins.accessibility;

        Main.screen = new Texture(global.gameWidth, global.gameHeight);

        this.metricsManager = new MetricsManager();

        this.game = new Game(config.game);
        this.game.update(0); // Update game once just to make sure everything is set up correctly.
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
                Main.game.update(Main.delta);
                global.metrics.endSpan('game');
                Main.soundManager.postGameUpdate();
            }
            global.metrics.endSpan('update');

            global.metrics.startSpan('render');
            Main.screen.clear();

            global.metrics.startSpan('game');
            Main.game.render(Main.screen);
            global.metrics.endSpan('game');

            Main.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true);  // Clear the renderer
            Main.renderer.render(Main.screen.renderTextureSprite);
            global.metrics.endSpan('render');

            global.metrics.endSpan('frame');
        });
    }
}
