/// <reference path="./preload.ts" />

function load() {
    PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas');

    Preload.preload({
        textures: Assets.textures,
        onLoad: () => Main.start(),
    })
}

class Main {
    static renderer: PIXI.Renderer;
    static theater: Theater;
    
    static delta: number;

    static get width()  { return 256; }
    static get height() { return 192; }

    static start() {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        this.renderer = PIXI.autoDetectRenderer({
            width: this.width,
            height: this.height,
            resolution: 4,
            backgroundColor: 0x061639,
        });
        document.body.appendChild(this.renderer.view);

        Input.setKeys({
            'left':             ['ArrowLeft'],
            'right':            ['ArrowRight'],
            'up':               ['ArrowUp'],
            'down':             ['ArrowDown'],
            'advanceDialog':    ['MouseLeft'],
        });

        window.addEventListener("keydown", event => Input.handleKeyDownEvent(event), false);
        window.addEventListener("keyup", event => Input.handleKeyUpEvent(event), false);
        window.addEventListener("mousedown", event => Input.handleMouseDownEvent(event), false);
        window.addEventListener("mouseup", event => Input.handleMouseUpEvent(event), false);
        window.addEventListener("contextmenu", event => event.preventDefault(), false);

        this.theater = new Theater({
            scenes: scenes,
            sceneToLoad: 'main',
            dialogBox: {
                x: Main.width/2, y: Main.height - 32,
                texture: 'dialogbox',
                spriteTextFont: Assets.fonts.DELUXE16,
                textArea: { x: -122, y: -27, width: 244, height: 54 },
                advanceKey: 'advanceDialog',
            }
        });

        PIXI.Ticker.shared.add((frameDelta) => {
            this.delta = frameDelta/60;

            Input.update();

            this.theater.update(this.delta);

            this.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true);  // Clear the renderer
            this.theater.render(this.renderer);
        });
    }
}

// Actually load the game
load();