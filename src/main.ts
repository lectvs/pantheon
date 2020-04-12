/// <reference path="./preload.ts" />

class Main {
    static renderer: PIXI.Renderer;
    private static game: Game;
    static screen: Texture;

    static delta: number;

    static get width()  { return 240; }
    static get height() { return 180; }

    static get backgroundColor() { return 0x061639; }

    // no need to modify
    static preload() {
        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        this.renderer = PIXI.autoDetectRenderer({
            width: this.width,
            height: this.height,
            resolution: 4,
            backgroundColor: this.backgroundColor,
        });

        Preload.preload({
            textures: Assets.textures,
            pyxelTilemaps: Assets.pyxelTilemaps,
            onLoad: () => {
                Main.load();
                Main.play();
            }
        });
    }

    // modify this method
    private static load() {
        document.body.appendChild(this.renderer.view);

        this.screen = new Texture(this.width, this.height);

        Input.setKeys({
            'left':                 ['ArrowLeft'],
            'right':                ['ArrowRight'],
            'up':                   ['ArrowUp'],
            'down':                 ['ArrowDown'],
            'interact':             ['e'],
            'advanceDialog':        ['MouseLeft', 'e', ' '],
            'pause':                ['Escape', 'Backspace'],
            'skipCutsceneScript':   ['Space'],
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
            'lmb':                  ['MouseLeft'],
        });

        window.addEventListener("keydown", event => Input.handleKeyDownEvent(event), false);
        window.addEventListener("keyup", event => Input.handleKeyUpEvent(event), false);
        window.addEventListener("mousedown", event => Input.handleMouseDownEvent(event), false);
        window.addEventListener("mouseup", event => Input.handleMouseUpEvent(event), false);
        //window.addEventListener("contextmenu", event => event.preventDefault(), false);

        this.game = new Game({
            mainMenuClass: MainMenu,
            pauseMenuClass: PauseMenu,
            theaterClass: Theater,
            theaterConfig: {
                stages: stages,
                stageToLoad: 'outside',
                stageEntryPoint: 'main',
                story: {
                    storyboard: storyboard,
                    storyboardPath: ['start'],
                    storyEvents: storyEvents,
                    storyConfig: storyConfig,
                },
                party: party,
                dialogBox: {
                    x: Main.width/2, y: Main.height - 32,
                    texture: 'dialogbox',
                    spriteTextFont: Assets.fonts.DELUXE16,
                    textAreaFull: { x: -114, y: -27, width: 228, height: 54 },
                    textAreaPortrait: { x: -114, y: -27, width: 158, height: 54 },
                    portraitPosition: { x: 78, y: 0 },
                    advanceKey: 'advanceDialog',
                },
                skipCutsceneScriptKey: 'skipCutsceneScript',
                autoPlayScript: autoPlayScript({ endNode: 'none', stage: 'escaperoom'}),
            },
            //theaterClass: TestTheater,
            //theaterConfig: undefined,
        });
        global.game = this.game;
    }

    // no need to modify
    private static play() {
        PIXI.Ticker.shared.add(frameDelta => {
            this.delta = frameDelta/60;

            global.clearStacks();

            for (let i = 0; i < DEBUG_SKIP_RATE; i++) {
                Input.update();
                this.game.update(this.delta);
            }

            this.screen.clear();
            this.game.render(this.screen);

            this.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true);  // Clear the renderer
            this.renderer.render(this.screen.renderTextureSprite);
        });
    }
}

// Actually load the game
Main.preload();