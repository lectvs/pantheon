/// <reference path="./transition.ts"/>
/// <reference path="./world.ts"/>

namespace Theater {
    export type Config = {
        stages: Dict<Stage>;
        stageToLoad: string;
        storyboard: Storyboard;
        storyboardEntry: string;
        dialogBox: DialogBox.Config;
        skipCutsceneScriptKey: string;
    }
}

class Theater extends World {
    stages: Dict<Stage>;
    storyboard: Storyboard;

    cutsceneManager: CutsceneManager;
    skipCutsceneScriptKey: string;

    currentStageName: string;
    currentWorld: World;

    dialogBox: DialogBox;
    slides: Slide[];

    private debugMousePosition = new SpriteText({ font: Assets.fonts.DELUXE16, x: 0, y: 0 });

    get currentStage() { return this.stages[this.currentStageName]; }
    get isCutscenePlaying() { return this.cutsceneManager.isCutscenePlaying; }
    
    constructor(config: Theater.Config) {
        super({
            layers: [
                { name: Theater.LAYER_WORLD },
                { name: Theater.LAYER_TRANSITION },
                { name: Theater.LAYER_SLIDES },
                { name: Theater.LAYER_DIALOG },
            ],
        });

        this.stages = config.stages;
        this.storyboard = config.storyboard;

        this.cutsceneManager = new CutsceneManager();
        this.skipCutsceneScriptKey = config.skipCutsceneScriptKey;

        this.loadDialogBox(config.dialogBox);
        this.slides = [];

        this.loadStage(config.stageToLoad);

        // Start storyboard entry point
        this.startStoryboardComponentByName(config.storyboardEntry);

        if (DEBUG_SHOW_MOUSE_POSITION) {
            this.debugMousePosition = this.addWorldObject(new SpriteText({ x: 0, y: 0, font: Assets.fonts.DELUXE16 }));
        }
    }

    update() {
        this.cutsceneManager.update();
        super.update();

        if (DEBUG_SHOW_MOUSE_POSITION) {
            this.debugMousePosition.setText(`${S.padLeft(this.currentWorld.getWorldMouseX().toString(), 3)} ${S.padLeft(this.currentWorld.getWorldMouseY().toString(), 3)}`);
        }
    }

    addSlideByConfig(config: Slide.Config) {
        let slide = new Slide(config);
        this.addWorldObject(slide);
        this.setLayer(slide, Theater.LAYER_SLIDES);
        this.slides.push(slide);
        return slide;
    }

    clearSlides(exceptLast: number = 0) {
        let deleteCount = this.slides.length - exceptLast;
        for (let i = 0; i < deleteCount; i++) {
            this.removeWorldObject(this.slides[i]);
        }
        this.slides.splice(0, deleteCount);
    }

    loadStage(name: string, transition?: Transition) {
        if (transition) {
            this.loadStageWithTransition(name, transition);
            return;
        }

        let stage = this.stages[name];
        if (!stage) {
            debug(`Stage '${name}' does not exist in world.`);
            return;
        }

        // Remove old stuff
        if (this.currentWorld) {
            this.removeWorldObject(this.currentWorld);
        }

        this.cutsceneManager.reset();

        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = Theater.createWorldFromStage(stage);
        this.currentWorld.debugMoveCameraWithArrows = DEBUG_MOVE_CAMERA_WITH_ARROWS;
        this.addWorldObject(this.currentWorld);
        this.setLayer(this.currentWorld, Theater.LAYER_WORLD);
    }

    private loadStageWithTransition(name: string, transition: Transition) {
        if (!this.currentWorld) {
            this.loadStage(name);
            return;
        }

        let oldSnapshot = this.currentWorld.takeSnapshot();
        this.loadStage(name);
        let newSnapshot = this.currentWorld.takeSnapshot();

        this.currentWorld.active = false;
        this.currentWorld.visible = false;

        let transitionObj = new Transition.Obj(oldSnapshot, newSnapshot, transition);
        this.addWorldObject(transitionObj, { layer: Theater.LAYER_TRANSITION });

        this.runScript({
            generator: function* () {
                while (!transitionObj.done) {
                    yield;
                }
            },
            endState: () => {
                this.removeWorldObject(transitionObj);
                this.currentWorld.active = true;
                this.currentWorld.visible = true;
            }
        });
    }

    startStoryboardComponentByName(name: string) {
        let component = this.storyboard[name];
        if (!component) {
            debug(`Component '${name}' does not exist in storyboard:`, this.storyboard);
            return;
        }

        if (component.type === 'cutscene') {
            this.cutsceneManager.playCutscene(component, this.currentWorld, this.skipCutsceneScriptKey);
        } else if (component.type === 'gameplay') {
            global.pushWorld(this.currentWorld);
            component.start();
            global.popWorld();
        }
    }

    private loadDialogBox(config: DialogBox.Config) {
        this.dialogBox = new DialogBox(config);
        this.dialogBox.visible = false;
        this.addWorldObject(this.dialogBox);
        this.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
    }
    
    static addWorldObjectFromStageConfig(world: World, worldObject: SomeStageConfig) {
        if (!worldObject.constructor) return null;

        let config = <AllStageConfig> worldObject;
        _.defaults(config, {
            layer: World.DEFAULT_LAYER,
        });

        let obj: WorldObject = new worldObject.constructor(worldObject);
        world.addWorldObject(obj, {
            name: config.name,
            layer: config.layer,
            physicsGroup: config.physicsGroup,
        });

        return obj;
    }

    static createWorldFromStage(stage: Stage) {
        let world = new World(stage, {
            //renderDirectly: true,
        });

        if (stage.worldObjects) {
            for (let worldObject of stage.worldObjects) {
                this.addWorldObjectFromStageConfig(world, worldObject);
            }
        }

        return world;
    }

    static LAYER_WORLD = 'world';
    static LAYER_TRANSITION = 'transition';
    static LAYER_SLIDES = 'slides';
    static LAYER_DIALOG = 'dialog';

    static DEFAULT_CAMERA_MODE: Camera.Mode = { type: 'focus', point: { x: Main.width/2, y: Main.height/2 } };
}