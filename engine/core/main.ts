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
        defaultSpriteTextFont?: string;

        preloadBackgroundColor: number;
        preloadProgressBarColor: number;

        textures: Dict<Preload.Texture>;
        sounds: Dict<Preload.Sound>;
        tilesets: Dict<Preload.Tileset>;
        pyxelTilemaps: Dict<Preload.PyxelTilemap>;
        fonts: Dict<Preload.Font>;
        customResources: Dict<Preload.CustomResource>;

        simulateMouseWithTouches: boolean;
        defaultOptions: Options.Options;

        game: Game.Config;

        debug: Debug.Config;

        persistIntervalSeconds?: number;
        persist?: () => void;

        beforePreload?: () => void;
        beforeStart?: () => void;

        dialogProfiles?: Dict<DialogProfile.Config>;
        spriteTextTags?: Dict<SpriteText.TagFunction>;
    }
}

class Main {
    private static configFactory: () => Main.Config;
    static config: Main.Config;

    static game: Game;
    static soundManager: GlobalSoundManager;
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
            errorText.style.color = "#FFFFFF";
            document.body.appendChild(errorText);
            return;
        }

        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        LocalStorage.init();
        Debug.init(this.config.debug);

        global.gameCodeName = this.config.gameCodeName;
        global.gameWidth = this.config.gameWidth;
        global.gameHeight = this.config.gameHeight;
        global.backgroundColor = this.config.backgroundColor;
        if (!O.isEmpty(this.config.spriteTextTags)) SpriteText.addTags(this.config.spriteTextTags);
        if (this.config.defaultSpriteTextFont) SpriteText.DEFAULT_FONT = this.config.defaultSpriteTextFont;
        if (!O.isEmpty(this.config.dialogProfiles)) DialogProfiles.initProfiles(this.config.dialogProfiles);

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
            document.body.style.backgroundColor = "black";
            MobileScaleManager.init();
        }

        // AccessibilityManager causes game to crash when Tab is pressed.
        // Deleting it as per https://github.com/pixijs/pixi.js/issues/5111#issuecomment-420047824
        Main.renderer.plugins.accessibility.destroy();
        delete (Main.renderer.plugins as any).accessibility;

        Main.screen = new BasicTexture(global.gameWidth, global.gameHeight, 'Main.screen');

        this.soundManager = new GlobalSoundManager();
        
        WebAudio.initContext();

        if (this.config.beforePreload) this.config.beforePreload();

        Preload.preload({
            textures: this.config.textures,
            sounds: this.config.sounds,
            tilesets: this.config.tilesets,
            pyxelTilemaps: this.config.pyxelTilemaps,
            fonts: this.config.fonts,
            custom: this.config.customResources,
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

        Persist.init(this.config.persistIntervalSeconds ?? 30, () => this.config.persist?.());

        this.initEvents();

        this.delta = 0;
        this.game = new Game(this.config.game);

        if (this.config.beforeStart) this.config.beforeStart();

        this.game.start();
        this.game.update(); // Update game once just to make sure everything is set up correctly.
    }

    private static play() {
        PIXI.Ticker.shared.add(frameDelta => {
            Main.delta = M.clamp(frameDelta/60, 0, 1/this.config.fpsLimit);

            global.fpsCalculator.update();

            global.clearStacks();

            for (let i = 0; i < Debug.SKIP_RATE; i++) {
                Input.update();
                Debug.update();
                if (Debug.frameStepSkipFrame()) break;
                Main.soundManager.preGameUpdate();
                Main.game.update();
                Main.soundManager.postGameUpdate();
                Input.postUpdate();
            }
            Persist.update(frameDelta/60);
            if (MobileUtils.isMobileBrowser()) {
                MobileScaleManager.update();
            }

            Main.screen.clear();

            Main.game.render(Main.screen);

            Main.renderScreenToCanvas();
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

        Draw.fill(Main.screen, { color: this.config.preloadBackgroundColor });

        let barw = global.gameWidth/2;
        let barh = 16;
        let barx = global.gameWidth/2 - barw/2;
        let bary = global.gameHeight/2 - barh/2;

        Draw.rectangle(Main.screen, barx, bary, barw * progress, barh, { fill: { color: this.config.preloadProgressBarColor }});
        Draw.rectangle(Main.screen, barx, bary, barw, barh, { outline: { color: this.config.preloadProgressBarColor }});

        Main.renderScreenToCanvas();
    }

    private static initEvents() {
        window.addEventListener("keypress", event => {
            WebAudio.start();
        });
        window.addEventListener("keydown", event => {
            WebAudio.start();
            Input.handleKeyDownEvent(event);
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
            if (IS_MOBILE) {
                Persist.persist();
            }
        });
        window.addEventListener(PageVisibility.VISIBILITY_CHANGE, () => {
            if (document[PageVisibility.HIDDEN as 'hidden']) {
                global.soundManager.pause();
            } else {
                global.soundManager.unpause();
            }
        }, false);
        window.addEventListener("beforeunload", event => {
            Persist.persist();
        }, false);
    }

    private static getRemotePath() {
        let node = document.getElementById("data-remote-root");
        if (!node) return undefined;
        let path = node.getAttribute("data-remote-root");
        if (St.isBlank(path)) return undefined;
        return path;
    }

    static hasRemotePath() {
        return !St.isBlank(Main.getRemotePath());
    }

    static getRootPath() {
        if (window.location.href.includes('localhost') || !Main.hasRemotePath()) {
            return '';
        }
        return Main.getRemotePath();
    }

    static getScaledWidth() {
        return global.gameWidth * Main.config.canvasScale;
    }

    static getScaledHeight() {
        return global.gameHeight * Main.config.canvasScale;
    }
}
