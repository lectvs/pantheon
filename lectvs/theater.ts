/// <reference path="./transition.ts"/>
/// <reference path="./world.ts"/>

namespace Theater {
    export type Config = {
        getStages: () => Dict<World.Config>;
        stageToLoad: string;
        stageEntryPoint?: World.EntryPoint;
        story: {
            getStoryboard: () => Storyboard;
            storyboardPath: string[];
            getStoryEvents: () => StoryEvent.Map;
            getStoryConfig: () => StoryConfig.Config;
        },
        getParty: () => Party.Config;
        dialogBox: DialogBox.Config;
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

        this.partyManager = new PartyManager(this, config.getParty());
        this.storyManager = new StoryManager(this, config.story.getStoryboard(), config.story.storyboardPath, config.story.getStoryEvents(), config.story.getStoryConfig());
        this.stageManager = new StageManager(this, config.getStages());
        this.interactionManager = new InteractionManager(this);
        this.slideManager = new SlideManager(this);

        this.stageManager.loadStage(config.stageToLoad, Transition.INSTANT, config.stageEntryPoint);

        if (Debug.AUTOPLAY && config.autoPlayScript) {
            this.runScript(config.autoPlayScript);
        }
    }

    // Theater cannot have preUpdate or postUpdate because I say so

    update(delta: number) {
        super.update(delta);
        this.stageManager.loadStageIfQueued();
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

    loadStage(name: string, transition: Transition.Config = Transition.INSTANT, entryPoint?: World.EntryPoint) {
        this.stageManager.loadStage(name, transition, entryPoint);
    }

    onPause() {
        super.onPause();
        if (this.hasWorldObject('world')) {
            this.getWorldObjectByName<World.WorldAsWorldObject>('world').containedWorld.onPause();
        }
    }

    onStageLoad() {
        this.storyManager.onStageLoad();
    }

    onUnpause() {
        super.onUnpause();
        if (this.hasWorldObject('world')) {
            this.getWorldObjectByName<World.WorldAsWorldObject>('world').containedWorld.onUnpause();
        }
    }

    protected updateDebugMousePosition() {
        // Override to do nothing since we don't want to display the theater's mouse position
    }
    
    private loadDialogBox(config: DialogBox.Config) {
        this.dialogBox = WorldObject.fromConfig<DialogBox>(config);
        this.dialogBox.visible = false;
        World.Actions.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
        World.Actions.addWorldObjectToWorld(this.dialogBox, this);
    }

    static LAYER_WORLD = 'world';
    static LAYER_TRANSITION = 'transition';
    static LAYER_SLIDES = 'slides';
    static LAYER_DIALOG = 'dialog';
}