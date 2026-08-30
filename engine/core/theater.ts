/// <reference path="./transition.ts"/>
/// <reference path="../world/world.ts"/>

namespace Theater {
    export type Config = {
        dialogBoxFactory?: Factory<DialogBox>;
        cutsceneManager?: CutsceneManager.Config;
        autoPlayScript?: () => IterableIterator<any>;
    }
}

class Theater {
    scriptManager: ScriptManager;
    cutsceneManager: CutsceneManager;

    overlayWorld: World;
    private dialogBoxWorld: World;
    dialogBox: DialogBox | undefined;

    isSkippingCutscene: boolean;
    shouldStopSkippingCutscene: boolean;
    private fades: Theater.Fade[];

    private container: PIXI.Container;

    constructor(config: Theater.Config = {}) {
        this.scriptManager = new ScriptManager();
        this.cutsceneManager = new CutsceneManager(this, config.cutsceneManager ?? {});

        this.overlayWorld = new World({
            name: 'Theater.overlayWorld',
            backgroundAlpha: 0,
        });
        this.dialogBoxWorld = new World({
            name: 'Theater.dialogBoxWorld',
            backgroundAlpha: 0,
        });
        if (config.dialogBoxFactory) {
            this.dialogBox = this.addDialogBox(config.dialogBoxFactory);
        }

        this.isSkippingCutscene = false;
        this.shouldStopSkippingCutscene = false;
        this.fades = [];

        if (Debug.AUTOPLAY && config.autoPlayScript) {
            this.runScript(config.autoPlayScript);
        }

        this.container = new PIXI.Container();
    }

    update() {
        this.scriptManager.update(Main.delta);
        this.cutsceneManager.update();

        this.overlayWorld.update();

        if (this.dialogBox) {
            this.dialogBoxWorld.update();
        }
    }

    render(): Render.Result {
        let result: Render.Result = FrameCache.array();

        result.pushAll(this.overlayWorld.render());

        if (this.dialogBox) {
            result.pushAll(this.dialogBoxWorld.render());
        }

        for (let fade of this.fades) {
            result.pushAll(fade.render());
        }

        Render.diff(this.container, result);

        return FrameCache.array(this.container);
    }

    /**
     * @deprecated Try to use World.fadeIn instead. This can persist across worlds!
     */
    clearFades(duration: number) {
        let lastOpaque = this.fades.findIndexLast(fade => fade.alpha >= 1);
        this.fades.splice(0, lastOpaque);
        return this.runScript(S.simul(...this.fades.map(fade => S.chain(
            S.tween(duration, fade, 'alpha', fade.alpha, 0),
            S.call(() => A.removeAll(this.fades, fade)),
        ))));
    }

    /**
     * @deprecated Try to use World.fadeOut instead. This can persist across worlds!
     */
    fade(duration: number, color: number) {
        let fade = new Theater.Fade(color, 0);
        this.fades.push(fade);
        return this.runScript(S.tween(duration, fade, 'alpha', 0, 1));
    }

    isCutscenePlaying() {
        if (!this.cutsceneManager) return false;
        return this.cutsceneManager.isCutscenePlaying();
    }

    playCutscene(cutscene: Cutscene, options: CutsceneManager.PlayOptions = {}) {
        this.cutsceneManager.playCutscene(cutscene, options);
    }

    runScript(script: Script.FunctionLike, name?: string) {
        return this.scriptManager.runScript(script, name);
    }

    // Rapidly update theater until cutscene is completed.
    skipCurrentCutscene() {
        if (this.cutsceneManager.canSkipCurrentCutscene()) {
            let currentCutscene = this.cutsceneManager.current;
            let cutsceneFinished = () => !this.cutsceneManager.current || this.cutsceneManager.current !== currentCutscene;

            this.shouldStopSkippingCutscene = false;
            this.isSkippingCutscene = true;
            let iters = 0;
            while (iters < Theater.SKIP_CUTSCENE_MAX_FRAMES && !cutsceneFinished() && !this.shouldStopSkippingCutscene) {
                this.update();
                iters++;
            }
            this.isSkippingCutscene = false;
            this.shouldStopSkippingCutscene = false;

            if (iters >= Theater.SKIP_CUTSCENE_MAX_FRAMES) {
                console.error('Cutscene skip exceeded max frames!');
            }
        }
    }

    unload() {
        this.overlayWorld.unload();
        this.dialogBoxWorld.unload();
    }

    private addDialogBox(factory: Factory<DialogBox>) {
        let dialogBox = this.dialogBoxWorld.addWorldObject(factory());
        dialogBox.setVisible(false);
        return dialogBox;
    }

    static readonly SKIP_CUTSCENE_DELTA = 0.1;
    static readonly SKIP_CUTSCENE_MAX_FRAMES = 10000;
}

namespace Theater {
    export class Fade {
        private sprite: PIXI.Sprite;

        constructor(private color: number, public alpha: number) {
            this.sprite = new PIXI.Sprite(Textures.filledRect(W, H, 0xFFFFFF));
        }

        render(): Render.Result {
            this.sprite.tint = this.color;
            this.sprite.alpha = this.alpha;
            return FrameCache.array(this.sprite);
        }
    }
    export class WorldAsWorldObject extends WorldObject {
        containedWorld: World;
        scale: number;
        anchor: Vector2;

        constructor(containedWorld: World) {
            super();
            this.containedWorld = containedWorld;
            this.scale = 1;
            this.anchor = Anchor.TOP_LEFT;
        }

        override update() {
            super.update();
            this.containedWorld.update();
        }

        override render(): Render.Result {
            let result = this.containedWorld.render();
            result[0].scale.x *= this.scale;
            result[0].scale.y *= this.scale;
            result[0].x -= this.anchor.x * this.containedWorld.getScreenWidth() * this.containedWorld.scaleX * this.scale;
            result[0].y -= this.anchor.y * this.containedWorld.getScreenHeight() * this.containedWorld.scaleY * this.scale;
            result[0].x = M.roundToNearest(result[0].x, 1/global.upscale);
            result[0].y = M.roundToNearest(result[0].y, 1/global.upscale);
            result[0].alpha = this.getTotalAlpha();
            return result;
        }

        override unload(): void {
            super.unload();
            this.containedWorld.unload();
        }
    }
}