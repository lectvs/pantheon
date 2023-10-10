/// <reference path="./transition.ts"/>
/// <reference path="../world/world.ts"/>

namespace Theater {
    export type Config = {
        dialogBox: Factory<DialogBox>;
        autoPlayScript?: () => IterableIterator<any>;
    }

    export type Fade = {
        color: number;
        alpha: number;
    }
}

class Theater {
    scriptManager: ScriptManager;
    cutsceneManager: CutsceneManager;
    stageManager: StageManager;

    private dialogBoxWorld: World;
    dialogBox: DialogBox;

    endOfFrameQueue: (() => any)[];

    isSkippingCutscene: boolean;
    shouldStopSkippingCutscene: boolean;
    private fades: Theater.Fade[];

    get currentWorld() { return this.stageManager ? this.stageManager.currentWorld : undefined; }
    get isCutscenePlaying() { return this.cutsceneManager ? this.cutsceneManager.isCutscenePlaying : false; }
    get canPause() { return this.currentWorld ? this.currentWorld.allowPause : false; }
    get delta() { return global.game.delta; }
    
    constructor(config: Theater.Config) {
        this.scriptManager = new ScriptManager();
        this.cutsceneManager = new CutsceneManager(this);
        this.stageManager = new StageManager(this);

        this.dialogBoxWorld = new World({
            backgroundAlpha: 0,
        });
        this.dialogBox = this.addDialogBox(config.dialogBox);

        this.endOfFrameQueue = [];

        this.isSkippingCutscene = false;
        this.shouldStopSkippingCutscene = false;
        this.fades = [];

        if (Debug.AUTOPLAY && config.autoPlayScript) {
            this.runScript(config.autoPlayScript);
        }
    }

    update() {
        this.scriptManager.update(this.delta);
        this.cutsceneManager.update();
        this.stageManager.update();

        this.dialogBoxWorld.update();

        while (!A.isEmpty(this.endOfFrameQueue)) {
            this.endOfFrameQueue.shift()!();
        }
    }

    render(screen: Texture) {
        this.stageManager.render(screen);
        this.dialogBoxWorld.render(screen, 0, 0);

        for (let fade of this.fades) {
            Draw.rectangle(screen, 0, 0, screen.width, screen.height, { fill: { color: fade.color, alpha: M.clamp(fade.alpha, 0, 1) } });
        }
    }

    clearFades(duration: number) {
        let lastOpaque = this.fades.findIndexLast(fade => fade.alpha >= 1);
        this.fades.splice(0, lastOpaque);
        return this.runScript(S.simul(...this.fades.map(fade => S.chain(
            S.tween(duration, fade, 'alpha', fade.alpha, 0),
            S.call(() => A.removeAll(this.fades, fade)),
        ))));
    }

    fade(duration: number, color: number) {
        let fade = { color, alpha: 0 };
        this.fades.push(fade);
        return this.runScript(S.tween(duration, fade, 'alpha', 0, 1));
    }

    loadStage(stage: () => World, transition: Transition = new Transitions.Instant()) {
        this.runAtEndOfFrame(() => this.loadStageImmediate(stage, transition));
    }

    loadStageImmediate(stage: () => World, transition: Transition = new Transitions.Instant()) {
        this.stageManager.internalLoadStage(stage, transition)
    }

    playCutscene(cutscene: Cutscene) {
        this.cutsceneManager.playCutscene(cutscene);
    }

    playCutsceneIfNotSeen(cutscene: Cutscene) {
        this.cutsceneManager.playCutsceneIfNotSeen(cutscene);
    }

    reloadCurrentStage(transition: Transition = new Transitions.Instant()) {
        this.runAtEndOfFrame(() => this.stageManager.internalReloadCurrentStage(transition));
    }

    runAtEndOfFrame(fn: () => any) {
        this.endOfFrameQueue.push(fn);
    }

    runScript(script: Script | Script.Function, name?: string) {
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

    onStageLoad() {
        this.cutsceneManager.onStageLoad();
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
    export class WorldAsWorldObject extends WorldObject {
        containedWorld: World;
        mask: Mask.WorldMaskConfig | undefined;

        constructor(containedWorld: World) {
            super();
            this.containedWorld = containedWorld;
            this.mask = undefined;
        }

        override update() {
            super.update();
            this.containedWorld.update();
        }

        override render(texture: Texture, x: number, y: number) {
            let currentMask = this.containedWorld.mask;
            if (this.mask !== undefined) {
                this.containedWorld.mask = this.mask;
            }

            this.containedWorld.render(texture, x, y);
            super.render(texture, x, y);

            this.containedWorld.mask = currentMask;
        }
    }
}