/// <reference path="./transition.ts"/>
/// <reference path="../world/world.ts"/>

namespace Theater {
    export type Config = {
        stages: Dict<Factory<World>>;
        stageToLoad: string;
        stageEntryPoint?: World.EntryPoint;
        story: {
            storyboard: Storyboard;
            storyboardPath: string[];
            storyEvents: StoryEvent.Map;
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
    musicManager: MusicManager;

    get currentStageName() { return this.stageManager ? this.stageManager.currentStageName : undefined; }
    get currentWorld() { return this.stageManager ? this.stageManager.currentWorld : undefined; }
    get isCutscenePlaying() { return this.storyManager ? this.storyManager.cutsceneManager.isCutscenePlaying : false; }
    get slides() { return this.slideManager ? this.slideManager.slides : []; }
    get currentMusicKey() { return this.musicManager ? this.musicManager.currentMusicKey : undefined; }

    endOfFrameQueue: (() => any)[];

    isSkippingCutscene: boolean;
    
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

        this.storyManager = new StoryManager(this, config.story.storyboard, config.story.storyboardPath, config.story.storyEvents);
        this.stageManager = new StageManager(this, config.stages);
        this.interactionManager = new InteractionManager(this);
        this.slideManager = new SlideManager(this);
        this.musicManager = new MusicManager();

        this.endOfFrameQueue = [];

        this.isSkippingCutscene = false;

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

        this.musicManager.volume = this.volume * global.game.volume;
        this.musicManager.update(this.delta);
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

    pauseMusic() {
        this.musicManager.pauseMusic();
    }

    playMusic(key: string, fadeTime: number = 0) {
        this.musicManager.playMusic(key, fadeTime);
    }

    runAtEndOfFrame(fn: () => any) {
        this.endOfFrameQueue.push(fn);
    }

    // Rapidly update theater until cutscene is completed.
    skipCurrentCutscene() {
        if (this.storyManager.cutsceneManager.canSkipCurrentCutscene()) {
            let currentCutscene = this.storyManager.cutsceneManager.current.name;
            let cutsceneFinished = () => !this.storyManager.cutsceneManager.current || this.storyManager.cutsceneManager.current.name !== currentCutscene;

            this.isSkippingCutscene = true;
            let iters = 0;
            while (iters < Theater.SKIP_CUTSCENE_MAX_FRAMES && !cutsceneFinished()) {
                this.update();
                iters++;
            }
            this.isSkippingCutscene = false;

            if (iters >= Theater.SKIP_CUTSCENE_MAX_FRAMES) {
                error('Cutscene skip exceeded max frames!');
            }
        }
    }

    stopMusic(fadeTime: number = 0) {
        this.musicManager.stopMusic(fadeTime);
    }

    unpauseMusic() {
        this.musicManager.unpauseMusic();
    }

    onStageLoad() {
        this.storyManager.onStageLoad();
    }
    
    private loadDialogBox(factory: Factory<DialogBox>) {
        this.dialogBox = this.addWorldObject(factory());
        this.dialogBox.visible = false;
        World.Actions.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
    }

    static readonly LAYER_WORLD = 'world';
    static readonly LAYER_TRANSITION = 'transition';
    static readonly LAYER_SLIDES = 'slides';
    static readonly LAYER_DIALOG = 'dialog';

    static readonly SKIP_CUTSCENE_DELTA = 0.1;
    static readonly SKIP_CUTSCENE_MAX_FRAMES = 10000;
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