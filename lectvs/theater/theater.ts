/// <reference path="./transition.ts"/>
/// <reference path="../world/world.ts"/>

namespace Theater {
    export type Config = {
        getStages: () => Dict<World.Factory>;
        stageToLoad: string;
        stageEntryPoint?: World.EntryPoint;
        story: {
            getStoryboard: () => Storyboard;
            storyboardPath: string[];
            getStoryEvents: () => StoryEvent.Map;
            getStoryConfig: () => StoryConfig.Config;
        },
        dialogBox: Factory<DialogBox>;
        autoPlayScript?: () => IterableIterator<any>;
    }
}

class Theater extends World {
    dialogBox: DialogBox;
    
    storyManager: StoryManager;
    stageManager: StageManager;
    interactionManager: InteractionManager;
    slideManager: SlideManager;

    get currentStageName() { return this.stageManager ? this.stageManager.currentStageName : undefined; }
    get currentWorld() { return this.stageManager ? this.stageManager.currentWorld : undefined; }
    get isCutscenePlaying() { return this.storyManager ? this.storyManager.cutsceneManager.isCutscenePlaying : false; }
    get slides() { return this.slideManager ? this.slideManager.slides : []; }

    endOfFrameQueue: (() => any)[];
    
    constructor(config: Theater.Config) {
        super({
            layers: [
                { name: Theater.LAYER_WORLD },
                { name: Theater.LAYER_TRANSITION },
                { name: Theater.LAYER_SLIDES },
                { name: Theater.LAYER_DIALOG },
            ]
        });

        this.loadDialogBox(config.dialogBox);

        this.storyManager = new StoryManager(this, config.story.getStoryboard(), config.story.storyboardPath, config.story.getStoryEvents(), config.story.getStoryConfig());
        this.stageManager = new StageManager(this, config.getStages());
        this.interactionManager = new InteractionManager(this);
        this.slideManager = new SlideManager(this);

        this.endOfFrameQueue = [];

        this.loadStage(config.stageToLoad, Transition.INSTANT, config.stageEntryPoint);

        if (Debug.AUTOPLAY && config.autoPlayScript) {
            this.runScript(config.autoPlayScript);
        }
    }

    update() {
        this.storyManager.update();

        super.update();

        while (!_.isEmpty(this.endOfFrameQueue)) {
            this.endOfFrameQueue.shift()();
        }
    }

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
        this.runAtEndOfFrame(() => this.stageManager.internalLoadStage(name, transition, entryPoint));
    }

    runAtEndOfFrame(fn: () => any) {
        this.endOfFrameQueue.push(fn);
    }

    skipCurrentCutscene() {
        if (this.storyManager.cutsceneManager.canSkipCurrentCutscene()) {
            this.storyManager.cutsceneManager.skipCurrentCutscene();
        }
    }

    onStageLoad() {
        this.storyManager.onStageLoad();
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
    export class WorldAsWorldObject extends WorldObject {
        containedWorld: World;

        constructor(containedWorld: World) {
            super();
            this.containedWorld = containedWorld;
        }

        update() {
            super.update();
            this.containedWorld.update();
        }

        render(texture: Texture, x: number, y: number) {
            this.containedWorld.render(texture);
            super.render(texture, x, y);
        }
    }
}