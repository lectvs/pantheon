/// <reference path="./transition.ts"/>
/// <reference path="./world.ts"/>

namespace Theater {
    export type Config = {
        stages: Dict<Stage>;
        stageToLoad: string;
        stageEntryPoint?: Stage.EntryPoint;
        story: {
            storyboard: Storyboard;
            storyboardPath: string[];
            storyConfig: StoryConfig.Config;
        },
        party: Party.Config;
        dialogBox: DialogBox.Config;
        skipCutsceneScriptKey: string;
        interactionManager: InteractionManager.Config;
    }
}

class Theater extends World {
    stages: Dict<Stage>;
    party: Party;

    dialogBox: DialogBox;
    
    storyManager: StoryManager;
    stageManager: StageManager;
    interactionManager: InteractionManager;
    slideManager: SlideManager;

    private debugMousePosition = new SpriteText({ font: Assets.fonts.DELUXE16, x: 0, y: 0 });

    get currentStageName() { return this.stageManager.currentStageName; }
    get currentWorld() { return this.stageManager.currentWorld; }
    get currentStage() { return this.stages[this.currentStageName]; }
    get isCutscenePlaying() { return this.storyManager.cutsceneManager.isCutscenePlaying; }
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

        this.party = new Party(config.party);
        this.loadDialogBox(config.dialogBox);

        this.storyManager = new StoryManager(this, config.story.storyboard, config.story.storyboardPath, config.story.storyConfig);
        this.stageManager = new StageManager(this, config.stages);
        this.interactionManager = new InteractionManager(this, config.interactionManager);
        this.slideManager = new SlideManager(this);

        this.stageManager.setStage(config.stageToLoad, config.stageEntryPoint);

        if (DEBUG_SHOW_MOUSE_POSITION) {
            this.debugMousePosition = new SpriteText({ x: 0, y: 0, font: Assets.fonts.DELUXE16 });
            World.Actions.addWorldObjectToWorld(this.debugMousePosition, this);
        }
    }

    update(delta: number) {
        super.update(delta);

        this.interactionManager.update();

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

    loadStage(name: string, transition: Transition.Config = Transition.INSTANT, entryPoint: Stage.EntryPoint = Theater.DEFAULT_ENTRY_POINT) {
        this.stageManager.loadStage(name, transition, entryPoint);
    }

    onStageLoad() {
        this.storyManager.cutsceneManager.onStageLoad();
    }

    private loadDialogBox(config: DialogBox.Config) {
        this.dialogBox = new DialogBox(config);
        this.dialogBox.visible = false;
        World.Actions.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
        World.Actions.addWorldObjectToWorld(this.dialogBox, this);
    }

    static LAYER_WORLD = 'world';
    static LAYER_TRANSITION = 'transition';
    static LAYER_SLIDES = 'slides';
    static LAYER_DIALOG = 'dialog';

    static DEFAULT_CAMERA_MODE: Camera.Mode = { type: 'focus', point: { x: Main.width/2, y: Main.height/2 } };
    static DEFAULT_ENTRY_POINT: Pt = { x: Main.width/2, y: Main.height/2 };
}