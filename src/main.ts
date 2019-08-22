/// <reference path="./preload.ts" />

function load() {
    PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');

    Preload.preload({
        textures: Assets.textures,
        pyxelTilemaps: Assets.pyxelTilemaps,
        onLoad: () => Main.start(),
    })
}

class Main {
    static renderer: PIXI.Renderer;
    static theater: Theater;

    static backgroundColor: number;
    
    static delta: number;

    static get width()  { return 256; }
    static get height() { return 192; }

    static start() {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        this.backgroundColor = 0x061639;

        this.renderer = PIXI.autoDetectRenderer({
            width: this.width,
            height: this.height,
            resolution: 4,
            backgroundColor: this.backgroundColor,
        });
        document.body.appendChild(this.renderer.view);

        Input.setKeys({
            'left':                 ['ArrowLeft'],
            'right':                ['ArrowRight'],
            'up':                   ['ArrowUp'],
            'down':                 ['ArrowDown'],
            'advanceDialog':        ['MouseLeft'],
            'skipCutsceneScript':   ['Escape'],
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

        window.addEventListener("keydown", event => Input.handleKeyDownEvent(event), false);
        window.addEventListener("keyup", event => Input.handleKeyUpEvent(event), false);
        window.addEventListener("mousedown", event => Input.handleMouseDownEvent(event), false);
        window.addEventListener("mouseup", event => Input.handleMouseUpEvent(event), false);
        //window.addEventListener("contextmenu", event => event.preventDefault(), false);

        this.theater = new Theater({
            stages: stages,
            stageToLoad: 'main_with_backwall',
            storyboard: storyboard,
            storyboardEntry: 'main',
            party: party,
            dialogBox: {
                x: Main.width/2, y: Main.height - 32,
                texture: 'dialogbox',
                spriteTextFont: Assets.fonts.DELUXE16,
                textAreaFull: { x: -122, y: -27, width: 244, height: 54 },
                textAreaPortrait: { x: -122, y: -27, width: 174, height: 54 },
                portraitPosition: { x: 86, y: 0 },
                advanceKey: 'advanceDialog',
            },
            skipCutsceneScriptKey: 'skipCutsceneScript',
        });

        global.theater = this.theater;
        global.clearStacks();
        global.pushRenderer(this.renderer);
        global.pushRenderTexture(undefined);
        global.pushMatrix(PIXI.Matrix.IDENTITY);

        PIXI.Ticker.shared.add(frameDelta => {
            this.delta = frameDelta/60;

            Input.update();

            global.pushWorld(null);
            global.pushDelta(this.delta);

            this.theater.update();

            this.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true);  // Clear the renderer
            this.theater.render();
        });
    }
}

// Actually load the game
load();