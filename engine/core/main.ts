/// <reference path="../load/preload.ts" />

namespace Main {
    export type Config = {
        gameWidth: OrFactory<number>;
        gameHeight: OrFactory<number>;
        scaling: {
            scaleMode: ScaleManager.ScaleMode;
            expandDirection: ScaleManager.ExpandDirection;
            windowedScale: number;
        };
        backgroundColor: number;
        fullscreenPageBackgroundColor?: string;
        fpsLimit: number;
        preventScrollOnCanvas: boolean;
        defaultSpriteTextFont?: string;
        allowUnsupportedLocalStorage?: boolean;

        textures?: Dict<Preload.Texture>;
        sounds?: Dict<Preload.Sound>;
        tilesets?: Dict<Preload.Tileset>;
        pyxelTilemaps?: Dict<Preload.PyxelTilemap>;
        ldtkTilemaps?: Dict<Preload.LdtkWorld>;
        lciFiles?: Dict<Preload.LciFile>;
        asepriteFiles?: Dict<Preload.AsepriteFile>;
        textFiles?: Dict<Preload.TextFile>;
        fonts?: Dict<Preload.Font>;
        customResources?: Dict<Preload.CustomResource>;

        controls: Input.KeyCodesByName;

        simulateMouseWithTouches: boolean;
        defaultOptions: Options.Options;

        game: Game.Config;

        debug: Debug.Config;

        persistIntervalSeconds?: number;
        persist?: () => void;

        beforePreload?: () => void;
        beforeStart?: () => void;
        beforeFrame?: () => void;

        dialogProfiles?: Dict<DialogProfile.Config>;
        spriteTextTags?: Dict<SpriteText.TagFunction>;
    }
}

class Main {
    private static configFactory: () => Main.Config;
    static config: Main.Config;

    static nonFullscreenPageBackgroundColor: string;

    static game: Game;
    static soundManager: GlobalSoundManager;
    private static renderer: PIXI.Renderer;
    static stage: PIXI.Container;
    static delta: number;

    static get rendererPlugins() { return Main.renderer.plugins; }
    static get rendererView() { return Main.renderer.view; }

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
        this.nonFullscreenPageBackgroundColor = document.body.style.backgroundColor;
        Debug.init(this.config.debug);

        if (MobileUtils.isMobileBrowser()) {
            IS_MOBILE = true;
        }

        if (!PIXI.utils.isWebGLSupported()) {
            Main.breakGameWithMessage("Error: WebGL is not supported in your browser.<br/><br/>The most common fix for this is to enable \"Use hardware acceleration\" in your browser's settings.");
            return;
        }

        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        this.checkForWebGlAcceleration();

        LocalStorage.init();
        if (!LocalStorage.isSupported && !this.config.allowUnsupportedLocalStorage) {
            Main.breakGameWithMessage("Error: Your browser or the page you're visiting does not support localStorage.<br/><br/>Please try a different browser.");
            return;
        }

        global.gameWidth = OrFactory.resolve(this.config.gameWidth);
        global.gameHeight = OrFactory.resolve(this.config.gameHeight);
        global.backgroundColor = this.config.backgroundColor;
        global.upscale = ScaleManager.getWindowedUpscaleFor(this.config.scaling);
        if (!O.isEmpty(this.config.spriteTextTags)) SpriteText.addTags(this.config.spriteTextTags);
        if (this.config.defaultSpriteTextFont) SpriteText.DEFAULT_FONT = this.config.defaultSpriteTextFont;
        if (!O.isEmpty(this.config.dialogProfiles)) DialogProfiles.initProfiles(this.config.dialogProfiles);

        Main.renderer = PIXI.autoDetectRenderer({
            width: global.gameWidth * global.upscale,
            height: global.gameHeight * global.upscale,
            backgroundColor: global.backgroundColor,
        });
        document.body.appendChild(Main.renderer.view);
        Main.renderer.view.style.setProperty('transform', `scale(${ScaleManager.getWindowedCanvasScaleFor(this.config.scaling)})`);
        Main.renderer.view.style.setProperty('image-rendering', 'pixelated');  // Chrome
        Main.renderer.view.style.setProperty('image-rendering', 'crisp-edges');  // Firefox

        if (MobileUtils.isMobileBrowser()) {
            document.body.style.backgroundColor = 'black';
            if (this.config.scaling.scaleMode === 'upscale' && (window.innerWidth < 540 || window.innerHeight < 540)) {
                console.log('Overriding scale mode due to low-res screen');
                this.config.scaling.scaleMode = 'mobilesmallscreen';
            }
        }
        ScaleManager.init(this.config);

        // AccessibilityManager causes game to crash when Tab is pressed.
        // Deleting it as per https://github.com/pixijs/pixi.js/issues/5111#issuecomment-420047824
        Main.renderer.plugins.accessibility.destroy();
        delete (Main.renderer.plugins as any).accessibility;

        Main.stage = new PIXI.Container();
        Main.stage.scale.set(global.upscale);

        this.soundManager = new GlobalSoundManager();
        
        WebAudio.initContext();

        if (this.config.beforePreload) this.config.beforePreload();

        Preload.preload({
            textures: this.config.textures ?? {},
            sounds: this.config.sounds ?? {},
            tilesets: this.config.tilesets ?? {},
            pyxelTilemaps: this.config.pyxelTilemaps ?? {},
            ldtkWorlds: this.config.ldtkTilemaps ?? {},
            lciFiles: this.config.lciFiles ?? {},
            asepriteFiles: this.config.asepriteFiles ?? {},
            textFiles: this.config.textFiles ?? {},
            fonts: this.config.fonts ?? {},
            custom: this.config.customResources ?? {},
            progressCallback: (progress) => this.renderPreloadProgress(progress),
            onLoad: () => {
                Main.load();
                Main.play();
            }
        });
    }

    private static load() {
        Options.init(GAME_NAME, this.config.defaultOptions);
        Input.init(this.config.controls);
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

            PerformanceTracking.logBeginFrame();

            FrameCache.reset();
            global.fpsCalculator.update();
            global.clearStacks();

            if (this.config.beforeFrame) this.config.beforeFrame();

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
            ScaleManager.update();
            Main.updateFullscreenBackgroundColor();

            Render.diff(Main.stage, Main.game.render());

            Main.renderScreenToCanvas();
        });
    }

    private static renderScreenToCanvas() {
        Render.upscalePixiObjectProperties(Main.stage, 'upscale');
        Main.renderer.render(Main.stage);
        Render.upscalePixiObjectProperties(Main.stage, 'downscale');
    }

    static forceRender() {
        Render.diff(Main.stage, Main.game.render());
        Main.renderScreenToCanvas();
    }

    static forceResize(width: number, height: number, upscale: number) {
        global.gameWidth = width;
        global.gameHeight = height;
        global.upscale = upscale;
        Main.renderer.resize(width * upscale, height * upscale);
        Main.stage?.scale.set(upscale);
    }

    static _internalRenderToRenderTexture(object: PIXI.DisplayObject, renderTexture: PIXI.RenderTexture, clearTextureFirst: boolean) {
        if (TextureUtils.isImmutable(renderTexture)) {
            console.error("Cannot render to immutable render texture:", renderTexture);
            return;
        }
        Main.renderer.render(object, renderTexture, clearTextureFirst);
    }

    static _internalClearRenderTexture(renderTexture: PIXI.RenderTexture) {
        if (TextureUtils.isImmutable(renderTexture)) {
            console.error("Cannot clear immutable render texture:", renderTexture);
            return;
        }
        Main.renderer.render(Utils.NOOP_DISPLAYOBJECT, renderTexture, true);
    }

    private static renderPreloadProgress(progress: number) {
        let barw = global.gameWidth/2;
        let barh = 16;
        let barx = global.gameWidth/2 - barw/2;
        let bary = global.gameHeight/2 - barh/2;

        let bg = lazy('Main.renderPreloadProgress.bg', () => new PIXI.Sprite(Textures.filledRect(W, H, 0x000000)));
        let barFill = lazy('Main.renderPreloadProgress.barFill', () => new PIXI.Sprite(Textures.filledRect(1, barh, 0xFFFFFF)));
        let barOutline = lazy('Main.renderPreloadProgress.barOutline', () => new PIXI.Sprite(Textures.outlineRect(barw, barh, 0xFFFFFF)));

        barFill.position.set(barx, bary);
        barFill.scale.x = barw * progress;
        barOutline.position.set(barx, bary);

        Render.diff(Main.stage, FrameCache.array(bg, barFill, barOutline));

        Main.renderScreenToCanvas();
    }

    private static initEvents() {
        window.addEventListener("keypress", event => {
            WebAudio.start();
            event.preventDefault();
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
            Input.handleTouchStartEvent(event);
        });
        window.addEventListener("touchmove", event => {
            Input.handleTouchMoveEvent(event);
        });
        window.addEventListener("touchend", event => {
            Input.handleTouchEndEvent(event);
        });
        window.addEventListener("touchcancel", event => {
            Input.handleTouchCancelEvent(event);
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

    private static updateFullscreenBackgroundColor() {
        let isFullscreen = Fullscreen.enabled || MobileUtils.isMobileBrowser();
        if (isFullscreen && Main.config.fullscreenPageBackgroundColor !== undefined) {
            document.body.style.backgroundColor = Main.config.fullscreenPageBackgroundColor;
        } else {
            document.body.style.backgroundColor = Main.nonFullscreenPageBackgroundColor;
        }
    }

    private static checkForWebGlAcceleration() {
        const contextOptions = {
            stencil: true,
            failIfMajorPerformanceCaveat: true,
        };
        const canvas = document.createElement('canvas');
        let gl = (
            canvas.getContext('webgl', contextOptions)
            || canvas.getContext('experimental-webgl', contextOptions)
        ) as WebGLRenderingContext;

        if (!gl) {
            console.warn('Warning: Hardware acceleration does not appear enabled! Performance may be degraded.');
        }
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

    static takeScreenshot(scale: number, output: 'clipboard' | 'newtab') {
        Main.forceRender();

        let hcanvas = document.createElement('canvas');
        hcanvas.width = global.gameWidth*scale;
        hcanvas.height = global.gameHeight*scale;
    
        let hctx = hcanvas.getContext('2d');
        hctx!.imageSmoothingEnabled = false;
        hctx!.drawImage(
            Main.renderer.view,
            0, 0, Main.rendererView.width, Main.rendererView.height,
            0, 0, global.gameWidth*scale, global.gameHeight*scale,
        );

        hcanvas.toBlob(blob => {
            if (!blob) {
                console.error('Blank blob');
                return;
            }

            if (output === 'clipboard') {
                navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type]: blob
                    })
                ]).then(() => {
                    console.log('Took screenshot');
                });
            } else if (output === 'newtab') {
                window.open(URL.createObjectURL(blob), '_blank');
                console.log('Took screenshot');
            }
        });
    }

    static breakGameWithMessage(messageHtml: string) {
        Main.renderer?.view.parentNode?.removeChild(Main.renderer.view);
        Main.soundManager?.ensureAllSoundsDisabled();
        PIXI.Ticker.shared.stop();
        let errorText = document.createElement('p');
        errorText.innerHTML = messageHtml;
        errorText.style.fontSize = "24px";
        errorText.style.color = "#FFFFFF";
        document.body.appendChild(errorText);
    }
}
