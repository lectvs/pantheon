/// <reference path="./transition.ts"/>
/// <reference path="../world/world.ts"/>

namespace Theater {
    export type TheaterClass = new (config: Theater.Config) => Theater;
    export type Config = {
        theaterClass?: TheaterClass;
        getStages: () => Dict<World.Factory>;
        stageToLoad: string;
        stageEntryPoint?: World.EntryPoint;
        story: {
            getStoryboard: () => Storyboard;
            storyboardPath: string[];
            getStoryEvents: () => StoryEvent.Map;
            getStoryConfig: () => StoryConfig.Config;
        },
        getParty: () => Party.Config;
        dialogBox: Factory<DialogBox>;
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
        super();

        this.addLayer(Theater.LAYER_WORLD);
        this.addLayer(Theater.LAYER_TRANSITION);
        this.addLayer(Theater.LAYER_SLIDES);
        this.addLayer(Theater.LAYER_DIALOG);

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

    update() {
        this.storyManager.update();
        super.update();
        this.stageManager.loadStageIfQueued();
    }

    // Theater cannot have preRender or postRender because it doesn't have a parent world

    render(screen: Texture) {
        this.interactionManager.preRender();
        super.render(screen);
        this.interactionManager.postRender();
    }

    addSlide(slide: Slide) {
        return this.slideManager.addSlide(slide);
    }

    clearSlides(exceptLast: number = 0) {
        this.slideManager.clearSlides(exceptLast);
    }

    loadStage(name: string, transition: Transition.Config = Transition.INSTANT, entryPoint?: World.EntryPoint) {
        this.stageManager.loadStage(name, transition, entryPoint);
    }

    onStageLoad() {
        this.storyManager.onStageLoad();
    }

    protected updateDebugMousePosition() {
        // Override to do nothing since we don't want to display the theater's mouse position
    }
    
    private loadDialogBox(factory: Factory<DialogBox>) {
        this.dialogBox = this.addWorldObject(factory());
        this.dialogBox.visible = false;
        World.Actions.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
    }

    static LAYER_WORLD = 'world';
    static LAYER_TRANSITION = 'transition';
    static LAYER_SLIDES = 'slides';
    static LAYER_DIALOG = 'dialog';
}

namespace Theater {
    export class WorldAsWorldObject extends Sprite {
        containedWorld: World;

        private worldTexture: Texture;

        constructor(containedWorld: World) {
            super();

            this.containedWorld = containedWorld;
            this.worldTexture = new BasicTexture(containedWorld.width, containedWorld.height);
            this.setTexture(this.worldTexture);
        }

        update() {
            super.update();
            this.containedWorld.update();
        }

        render(texture: Texture, x: number, y: number) {
            this.worldTexture.clear();
            this.containedWorld.render(this.worldTexture);
            super.render(texture, x, y);
        }
    }
}