/// <reference path="../lectvs/preload.ts" />
/// <reference path="./assets.ts" />

class Main {
    private static game: Game;
    static screen: Texture;

    static delta: number;

    // no need to modify
    static preload() {
        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        global.gameWidth = 240;
        global.gameHeight = 180;
        global.backgroundColor = 0x061639;
        global.renderer = PIXI.autoDetectRenderer({
            width: global.gameWidth,
            height: global.gameHeight,
            resolution: 4,
            backgroundColor: global.backgroundColor,
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
        document.body.appendChild(global.renderer.view);

        this.screen = new Texture(global.gameWidth, global.gameHeight);

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
                    x: global.gameWidth/2, y: global.gameHeight - 32,
                    texture: 'dialogbox',
                    spriteTextFont: Assets.fonts.DELUXE16,
                    textAreaFull: { x: -114, y: -27, width: 228, height: 54 },
                    textAreaPortrait: { x: -114, y: -27, width: 158, height: 54 },
                    portraitPosition: { x: 78, y: 0 },
                    advanceKey: 'advanceDialog',
                },
                skipCutsceneScriptKey: 'skipCutsceneScript',
                autoPlayScript: autoPlayScript({ endNode: 'inside_gameplay', stage: 'inside'}),
                debugMousePositionFont: Assets.fonts.DELUXE16,
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

            for (let i = 0; i < Debug.SKIP_RATE; i++) {
                Input.update();
                this.game.update(this.delta);
            }

            this.screen.clear();
            this.game.render(this.screen);

            global.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true);  // Clear the renderer
            global.renderer.render(this.screen.renderTextureSprite);
        });
    }
}

// Actually load the game
Main.preload();