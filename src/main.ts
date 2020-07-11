/// <reference path="../lectvs/preload.ts" />
/// <reference path="./assets.ts" />

class Main {
    private static game: Game;
    private static metricsManager: MetricsManager;
    static renderer: PIXI.Renderer;
    static screen: Texture;
    static delta: number;

    static get width() { return 960; }
    static get height() { return 800; }
    static get backgroundColor() { return 0x000000; }

    // no need to modify
    static preload() {
        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');

        Debug.init({
            debug: true,
            font: Assets.fonts.DELUXE16,
            cheatsEnabled: true,
            allPhysicsBounds: false,
            moveCameraWithArrows: true,
            showMousePosition: true,
            skipRate: 1,
            programmaticInput: false,
            autoplay: true,
            skipMainMenu: true,
            frameStepEnabled: false,
            frameStepStepKey: '1',
            frameStepRunKey: '2',
        });

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        WorldObject.DEFAULT_Z_BEHAVIOR = 'threequarters';

        global.gameWidth = Main.width;
        global.gameHeight = Main.height;
        global.backgroundColor = Main.backgroundColor;
        Main.renderer = PIXI.autoDetectRenderer({
            width: global.gameWidth,
            height: global.gameHeight,
            resolution: 1,
            backgroundColor: global.backgroundColor,
        });
        global.renderer = Main.renderer;
        global.soundManager = new SoundManager();
        
        WebAudio.initContext();

        Preload.preload({
            textures: Assets.textures,
            sounds: Assets.sounds,
            pyxelTilemaps: Assets.pyxelTilemaps,
            spriteTextTags: Assets.spriteTextTags,
            onLoad: () => {
                Main.load();
                Main.play();
            }
        });
    }

    // modify this method
    private static load() {
        document.body.appendChild(Main.renderer.view);

        Main.screen = new Texture(Main.width, Main.height);

        Input.setKeys({
            'left':                 ['ArrowLeft'],
            'right':                ['ArrowRight'],
            'up':                   ['ArrowUp'],
            'down':                 ['ArrowDown'],
            'interact':             ['e'],

            // Game
            'advanceDialog':        ['MouseLeft', 'e', ' '],
            'pause':                ['Escape', 'Backspace'],

            // Debug
            'debugMoveCameraUp':    ['i'],
            'debugMoveCameraDown':  ['k'],
            'debugMoveCameraLeft':  ['j'],
            'debugMoveCameraRight': ['l'],
            '1':                    ['1'],
            '2':                    ['2'],
            '3':                    ['3'],
            '4':                    ['4'],
            '5':                    ['5'],
            '6':                    ['6'],
            '7':                    ['7'],
            '8':                    ['8'],
            '9':                    ['9'],
            '0':                    ['0'],
        });

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

        this.metricsManager = new MetricsManager({
            recordKey: '0',
        });

        this.game = new Game({
            entryPointMenuClass: MainMenu,
            pauseMenuClass: PauseMenu,
            theaterClass: Theater,
            showMetricsMenuKey: '9',
            theaterConfig: {
                getStages: getStages,
                stageToLoad: 'game',
                stageEntryPoint: 'main',
                story: {
                    getStoryboard: getStoryboard,
                    storyboardPath: ['start'],
                    getStoryEvents: getStoryEvents,
                    getStoryConfig: getStoryConfig,
                },
                getParty: getParty,
                dialogBox: {
                    constructor: DialogBox,
                    x: Main.width/2, y: Main.height - 32,
                    texture: 'none',
                    spriteTextFont: Assets.fonts.DELUXE16,
                    textAreaFull: { x: -114, y: -27, width: 228, height: 54 },
                    textAreaPortrait: { x: -114, y: -27, width: 158, height: 54 },
                    portraitPosition: { x: 78, y: 0 },
                    advanceKey: 'advanceDialog',
                },
            },
        });
        global.game = Main.game;
    }

    // no need to modify
    private static play() {
        PIXI.Ticker.shared.add(frameDelta => {
            this.metricsManager.update();

            global.metrics.startSpan('frame');

            Main.delta = frameDelta/60;

            global.clearStacks();

            global.metrics.startSpan('update');
            for (let i = 0; i < Debug.SKIP_RATE; i++) {
                Input.update();
                if (Debug.frameStepSkipFrame()) break;
                global.soundManager.preGameUpdate();
                global.metrics.startSpan('game');
                Main.game.update(Main.delta);
                global.metrics.endSpan('game');
                global.soundManager.postGameUpdate();
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

// Actually load the game
Main.preload();