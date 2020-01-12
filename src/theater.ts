/// <reference path="./transition.ts"/>
/// <reference path="./world.ts"/>

namespace Theater {
    export type Config = {
        stages: Dict<Stage>;
        stageToLoad: string;
        stageEntryPoint?: Stage.EntryPoint;
        storyboard: Storyboard;
        storyboardEntry: string;
        party: Party.Config;
        dialogBox: DialogBox.Config;
        skipCutsceneScriptKey: string;
        interactionManager: InteractionManager.Config;
    }
}

class Theater extends World {
    stages: Dict<Stage>;
    storyboard: Storyboard;
    party: Party;

    currentStoryboardComponentName: string;

    dialogBox: DialogBox;
    
    cutsceneManager: CutsceneManager;
    stageManager: StageManager;
    interactionManager: InteractionManager;
    slideManager: SlideManager;

    private debugMousePosition = new SpriteText({ font: Assets.fonts.DELUXE16, x: 0, y: 0 });

    get currentStageName() { return this.stageManager.currentStageName; }
    get currentWorld() { return this.stageManager.currentWorld; }
    get currentStage() { return this.stages[this.currentStageName]; }
    get isCutscenePlaying() { return this.cutsceneManager.isCutscenePlaying; }
    get slides() { return this.slideManager.slides; }
    
    constructor(config: Theater.Config) {
        super({
            layers: [
                { name: Theater.LAYER_WORLD },
                { name: Theater.LAYER_TRANSITION },
                { name: Theater.LAYER_SLIDES },
                { name: Theater.LAYER_DIALOG },
            ],
        });
        global.theater = this;

        this.stages = config.stages;
        this.storyboard = config.storyboard;

        this.party = new Party(config.party);

        this.cutsceneManager = new CutsceneManager(this, config.skipCutsceneScriptKey);
        
        this.loadDialogBox(config.dialogBox);

        this.stageManager = new StageManager(this, config.stages);
        this.interactionManager = new InteractionManager(config.interactionManager);
        this.slideManager = new SlideManager(this);

        this.stageManager.setStage(config.stageToLoad, config.stageEntryPoint);

        // Start storyboard entry point
        this.startStoryboardComponentByName(config.storyboardEntry);

        if (DEBUG_SHOW_MOUSE_POSITION) {
            this.debugMousePosition = this.addWorldObject(new SpriteText({ x: 0, y: 0, font: Assets.fonts.DELUXE16 }));
        }
    }

    update(world: World, delta: number) {
        this.cutsceneManager.update(delta);

        super.update(world, delta);

        this.interactionManager.update(this.currentWorld);

        this.stageManager.loadStageIfQueued();

        if (DEBUG_SHOW_MOUSE_POSITION) {
            this.debugMousePosition.setText(`${S.padLeft(this.currentWorld.getWorldMouseX().toString(), 3)} ${S.padLeft(this.currentWorld.getWorldMouseY().toString(), 3)}`);
        }
    }

    addSlideByConfig(config: Slide.Config) {
        return this.slideManager.addSlideByConfig(config);
    }

    clearSlides(exceptLast: number = 0) {
        this.slideManager.clearSlides(exceptLast);
    }

    getStoryboardComponentByName(name: string) {
        let component = this.storyboard[name];
        if (!component) {
            debug(`Component '${name}' does not exist in storyboard:`, this.storyboard);
        }
        return component;
    }

    loadStage(name: string, transition: Transition = Transition.INSTANT, entryPoint: Stage.EntryPoint = Theater.DEFAULT_ENTRY_POINT) {
        this.stageManager.loadStage(name, transition, entryPoint);
    }

    onStageLoad() {
        this.cutsceneManager.onStageLoad();
    }

    startStoryboardComponentByName(name: string) {
        let component = this.getStoryboardComponentByName(name);
        if (!component) return;

        if (component.type === 'cutscene') {
            this.cutsceneManager.playCutscene(name, component);
        } else if (component.type === 'gameplay') {
            component.start();
        } else if (component.type === 'code') {
            component.func();
            if (component.after) {
                return this.startStoryboardComponentByName(component.after);
            }
        }

        debug('started ' + name);

        this.currentStoryboardComponentName = name;
    }

    private loadDialogBox(config: DialogBox.Config) {
        this.dialogBox = new DialogBox(config);
        this.dialogBox.visible = false;
        this.addWorldObject(this.dialogBox);
        this.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
    }

    static LAYER_WORLD = 'world';
    static LAYER_TRANSITION = 'transition';
    static LAYER_SLIDES = 'slides';
    static LAYER_DIALOG = 'dialog';

    static DEFAULT_CAMERA_MODE: Camera.Mode = { type: 'focus', point: { x: Main.width/2, y: Main.height/2 } };
    static DEFAULT_ENTRY_POINT: Pt = { x: Main.width/2, y: Main.height/2 };
}