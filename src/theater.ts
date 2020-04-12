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
            storyEvents: StoryEvent.Map;
            storyConfig: StoryConfig.Config;
        },
        party: Party.Config;
        dialogBox: DialogBox.Config;
        skipCutsceneScriptKey: string;
        autoPlayScript?: () => IterableIterator<any>;
    }
}

class Theater extends World {
    dialogBox: DialogBox;
    
    partyManager: PartyManager;
    storyManager: StoryManager;
    stageManager: StageManager;
    interactionManager: InteractionManager;
    slideManager: SlideManager;

    private debugMousePosition = new SpriteText({ font: Assets.fonts.DELUXE16, x: 0, y: 0 });

    get currentStageName() { return this.stageManager ? this.stageManager.currentStageName : undefined; }
    get currentWorld() { return this.stageManager ? this.stageManager.currentWorld : undefined; }
    get currentStage() { return (this.stageManager && this.stageManager.stages) ? this.stageManager.stages[this.stageManager.currentStageName] : undefined; }
    get isCutscenePlaying() { return this.storyManager ? this.storyManager.cutsceneManager.isCutscenePlaying : false; }
    get slides() { return this.slideManager ? this.slideManager.slides : []; }
    
    constructor(config: Theater.Config) {
        super({
            layers: [
                { name: Theater.LAYER_WORLD },
                { name: Theater.LAYER_TRANSITION },
                { name: Theater.LAYER_SLIDES },
                { name: Theater.LAYER_DIALOG },
            ],
        });

        this.loadDialogBox(config.dialogBox);

        this.partyManager = new PartyManager(this, config.party);
        this.storyManager = new StoryManager(this, config.story.storyboard, config.story.storyboardPath, config.story.storyEvents, config.story.storyConfig);
        this.stageManager = new StageManager(this, config.stages);
        this.interactionManager = new InteractionManager(this);
        this.slideManager = new SlideManager(this);

        this.stageManager.loadStage(config.stageToLoad, Transition.INSTANT, config.stageEntryPoint);

        if (Debug.SHOW_MOUSE_POSITION) {
            this.debugMousePosition = new SpriteText({ x: 0, y: 0, font: Assets.fonts.DELUXE16 });
            World.Actions.addWorldObjectToWorld(this.debugMousePosition, this);
        }

        if (Debug.AUTOPLAY && config.autoPlayScript) {
            this.runScript(config.autoPlayScript);
        }
    }

    // Theater cannot have preUpdate or postUpdate because I say so

    update(delta: number) {
        super.update(delta);

        this.stageManager.loadStageIfQueued();

        if (Debug.SHOW_MOUSE_POSITION) {
            this.debugMousePosition.setText(`${S.padLeft(this.currentWorld.getWorldMouseX().toString(), 3)} ${S.padLeft(this.currentWorld.getWorldMouseY().toString(), 3)}`);
        }
    }

    // Theater cannot have preRender or postRender because it doesn't have a parent world

    render(screen: Texture) {
        this.interactionManager.preRender();
        super.render(screen);
        this.interactionManager.postRender();
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
        this.storyManager.onStageLoad();
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