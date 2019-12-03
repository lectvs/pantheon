/// <reference path="./preload.ts" />

class Main {
    static renderer: PIXI.Renderer;
    static theater: Theater;
    static screen: Texture;

    static delta: number;

    static get width()  { return 256; }
    static get height() { return 192; }

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
            'skipCutsceneScript':   ['Escape'],
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

        window.addEventListener("keydown", event => Input.handleKeyDownEvent(event), false);
        window.addEventListener("keyup", event => Input.handleKeyUpEvent(event), false);
        window.addEventListener("mousedown", event => Input.handleMouseDownEvent(event), false);
        window.addEventListener("mouseup", event => Input.handleMouseUpEvent(event), false);
        //window.addEventListener("contextmenu", event => event.preventDefault(), false);

        this.theater = new Theater({
            stages: stages,
            stageToLoad: 'main',
            stageEntryPoint: 'entrance',
            storyboard: storyboard,
            storyboardEntry: 'room_intro',
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
            interactionManager: {
                highlightFunction: sprite => {
                    sprite.effects.outline.enabled = true;
                    sprite.effects.outline.color = 0xFFFF00;
                },
                resetFunction: sprite => {
                    sprite.effects.outline.enabled = false;
                },
            }
        });
    }

    // no need to modify
    private static play() {
        let fps = new FPSMetricManager(1);

        let mask = new TextureFilter.Mask({ mask: AssetCache.getTexture('masktest'), type: TextureFilter.Mask.Type.LOCAL, offsetX: 3, offsetY: 2 });
        let outline = new Effects.Filters.Outline(0xFF0000, 1);
        let silhouette = new Effects.Filters.Silhouette(0x00FFFF, 0.5);

        PIXI.Ticker.shared.add(frameDelta => {
            this.delta = frameDelta/60;

            Input.update();

            global.theater = this.theater;
            global.clearStacks();
            global.pushScreen(this.screen);
            global.pushWorld(null);
            global.pushDelta(this.delta);

            fps.update();

            this.theater.update();

            if (Input.justDown('1')) mask.invert = !mask.invert;
            
            this.screen.clear();
            this.theater.render();

            this.screen.render(AssetCache.getTexture('bed'), {
                x: Input.mouseX,
                y: Input.mouseY,
                filters: [mask, outline, null, silhouette]
            });

            this.renderer.render(Utils.NOOP_DISPLAYOBJECT, undefined, true);  // Clear the renderer
            this.renderer.render(this.screen.renderTextureSprite);

            global.popDelta();
            global.popWorld();
            global.popScreen();
        });
    }
}

// Actually load the game
Main.preload();