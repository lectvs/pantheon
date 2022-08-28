/// <reference path="../load/preload.ts" />

namespace Main {
    export type Config = {
        gameCodeName: string;
        gameWidth: number;
        gameHeight: number;
        canvasScale: number;
        backgroundColor: number;
        fpsLimit: number;
        preventScrollOnCanvas: boolean;
        defaultZBehavior?: WorldObject.ZBehavior;
        defaultSpriteTextFont?: string;

        preloadBackgroundColor: number;
        preloadProgressBarColor: number;

        remoteRootPath?: string;
        textures: Dict<Preload.Texture>;
        sounds: Dict<Preload.Sound>;
        tilesets: Dict<Preload.Tileset>;
        pyxelTilemaps: Dict<Preload.PyxelTilemap>;
        fonts: Dict<Preload.Font>;
        spriteTextTags: Dict<SpriteText.TagFunction>;
        dialogProfiles: Dict<DialogProfile.Config>;

        simulateMouseWithTouches: boolean;
        defaultOptions: Options.Options;

        game: Game.Config;

        beforePreload?: () => void;
        onExit?: () => void;

        debug: Debug.Config;
    }
}

class Main {
    private static configFactory: () => Main.Config;
    static config: Main.Config;

    static game: Game;
    static soundManager: GlobalSoundManager;
    static metricsManager: MetricsManager;
    static renderer: PIXI.Renderer;
    static screen: BasicTexture;
    static delta: number;

    static loadConfig(configFactory: () => Main.Config) {
        this.configFactory = configFactory;
    }

    private static start() {
        if (!this.configFactory) {
            console.error('No main config loaded! Must load config by calling `Main.loadConfig(config);`');
            return;
        }
        this.config = this.configFactory();
        this.preload();
    }

    private static preload() {
        if (MobileUtils.isMobileBrowser()) {
            IS_MOBILE = true;
        }

        if (!PIXI.utils.isWebGLSupported()) {
            let errorText = document.createElement('p');
            errorText.innerHTML = "Error: WebGL is not supported in your browser.<br/><br/>The most common fix for this is to enable \"Use hardware acceleration\" in your browser's settings.";
            errorText.style.fontSize = "24px";
            errorText.style.color = "#FF0000";
            document.body.appendChild(errorText);
            return;
        }

        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        Debug.init(this.config.debug);

        global.gameCodeName = this.config.gameCodeName;
        global.gameWidth = this.config.gameWidth;
        global.gameHeight = this.config.gameHeight;
        global.backgroundColor = this.config.backgroundColor;
        WorldObject.DEFAULT_Z_BEHAVIOR = this.config.defaultZBehavior ?? 'noop';
        SpriteText.addTags(this.config.spriteTextTags ?? {});
        SpriteText.DEFAULT_FONT = this.config.defaultSpriteTextFont;
        DialogProfiles.initProfiles(this.config.dialogProfiles);

        Main.renderer = PIXI.autoDetectRenderer({
            width: global.gameWidth,
            height: global.gameHeight,
            resolution: this.config.canvasScale,
            backgroundColor: global.backgroundColor,
        });
        document.body.appendChild(Main.renderer.view);
        Main.renderer.view.style.setProperty('image-rendering', 'pixelated');  // Chrome
        Main.renderer.view.style.setProperty('image-rendering', 'crisp-edges');  // Firefox

        if (MobileUtils.isMobileBrowser()) {
            let scale = window.innerHeight/720;
            Main.renderer.view.style.transform = `scale(${scale})`;
            document.body.style.backgroundColor = "black";
        }

        // AccessibilityManager causes game to crash when Tab is pressed.
        // Deleting it as per https://github.com/pixijs/pixi.js/issues/5111#issuecomment-420047824
        Main.renderer.plugins.accessibility.destroy();
        delete Main.renderer.plugins.accessibility;

        Main.screen = new BasicTexture(global.gameWidth, global.gameHeight);

        this.soundManager = new GlobalSoundManager();
        
        WebAudio.initContext();
        Analytics.init();

        if (this.config.beforePreload) this.config.beforePreload();

        Preload.preload({
            textures: this.config.textures,
            sounds: this.config.sounds,
            tilesets: this.config.tilesets,
            pyxelTilemaps: this.config.pyxelTilemaps,
            fonts: this.config.fonts,
            progressCallback: (progress) => this.renderPreloadProgress(progress),
            onLoad: () => {
                Main.load();
                Main.play();
            }
        });
    }

    private static load() {
        //Options.updateCallbacks.push(() => Input.init()); // TODO: fix this for continuous volume slider
        Options.init(global.gameCodeName, this.config.defaultOptions);
        Input.init(); // TODO: remove this when fixed above
        Input.simulateMouseWithTouches = this.config.simulateMouseWithTouches;

        this.initEvents();

        this.metricsManager = new MetricsManager();

        this.delta = 0;
        this.game = new Game(this.config.game);
        this.game.start();
        this.game.update(); // Update game once just to make sure everything is set up correctly.
    }

    static fixedDelta: number;
    private static fixedDeltaBucket = 0;

    private static play() {
        PIXI.Ticker.shared.add(frameDelta => {
            Main.delta = M.clamp(frameDelta/60, 0, 1/this.config.fpsLimit);

            if (Main.fixedDelta > 0) {
                Main.fixedDeltaBucket += Main.delta;
                Main.delta = Main.fixedDelta;
                if (Main.fixedDeltaBucket < Main.fixedDelta) {
                    return;
                }
                while (Main.fixedDeltaBucket >= Main.fixedDelta) Main.fixedDeltaBucket -= Main.fixedDelta;
            }

            this.metricsManager.update();

            global.metrics.startSpan('frame');
            global.fpsCalculator.update();

            global.clearStacks();
            global.metrics.startSpan('update');

            for (let i = 0; i < Debug.SKIP_RATE; i++) {
                Input.update();
                Debug.update();
                if (Debug.frameStepSkipFrame()) break;
                Main.soundManager.preGameUpdate();
                global.metrics.startSpan('game');
                Main.game.update();
                global.metrics.endSpan('game');
                Main.soundManager.postGameUpdate();
                Input.postUpdate();
            }
            Analytics.update(frameDelta/60);
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

    static forceRender() {
        Main.screen.clear();
        Main.game.render(Main.screen);
        Main.renderScreenToCanvas();
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

    private static initEvents() {
        window.addEventListener("keypress", event => {
            WebAudio.start();
        });
        window.addEventListener("keydown", event => {
            WebAudio.start();
            Input.handleKeyDownEvent(event);
            if (event.key === 'Tab') {
                event.preventDefault();
            }
        });
        window.addEventListener("keyup", event => {
            WebAudio.start();
            Input.handleKeyUpEvent(event);
        });
        window.addEventListener("mousedown", event => {
            WebAudio.start();
            Input.handleMouseDownEvent(event);
        });
        window.addEventListener("mouseup", event => {
            WebAudio.start();
            Input.handleMouseUpEvent(event);
        });
        window.addEventListener("wheel", event => {
            Input.handleMouseScrollEvent(event, this.config.preventScrollOnCanvas);
        }, { passive: false });
        window.addEventListener("touchstart", event => {
            TouchManager.handleTouchStartEvent(event);
        });
        window.addEventListener("touchmove", event => {
            TouchManager.handleTouchMoveEvent(event);
        });
        window.addEventListener("touchend", event => {
            TouchManager.handleTouchEndEvent(event);
        });
        window.addEventListener("touchcancel", event => {
            TouchManager.handleTouchCancelEvent(event);
        });
        window.addEventListener("contextmenu", event => {
            WebAudio.start();
            event.preventDefault();
        });
        window.addEventListener("blur", event => {
            Input.reset();
        });
        window.addEventListener(PageVisibility.VISIBILITY_CHANGE, () => {
            if (document[PageVisibility.HIDDEN]) {
                global.soundManager.pause();
            } else {
                global.soundManager.unpause();
            }
        }, false);
        window.addEventListener("beforeunload", event => {
            if (this.config.onExit) this.config.onExit();
            Analytics.submit();
        }, false);
    }

    static getRootPath() {
        if (!IS_REMOTE || !Main.config.remoteRootPath || window.location.href.includes('localhost')) {
            return '';
        }
        return Main.config.remoteRootPath;
    }
}
