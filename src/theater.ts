/// <reference path="./transition.ts"/>
/// <reference path="./world.ts"/>

namespace Theater {
    export type Config = {
        scenes: Dict<Scene>;
        sceneToLoad: string;
        dialogBox: DialogBox.Config;
        skipCutsceneScriptKey: string;
    }
}

class Theater extends World {
    scenes: Dict<Scene>;

    cutsceneManager: CutsceneManager;
    inControl: string[];
    skipCutsceneScriptKey: string;

    currentSceneName: string;
    currentWorld: World;

    dialogBox: DialogBox;
    slides: Slide[];

    private debugMousePosition = new SpriteText({ font: Assets.fonts.DELUXE16, x: 0, y: 0 });

    get currentScene() { return this.scenes[this.currentSceneName]; }
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
        this.scenes = config.scenes;

        this.cutsceneManager = new CutsceneManager();
        this.inControl = [];
        this.skipCutsceneScriptKey = config.skipCutsceneScriptKey;

        this.loadDialogBox(config.dialogBox);
        this.slides = [];

        this.loadScene(config.sceneToLoad);

        if (DEBUG_SHOW_MOUSE_POSITION) {
            this.debugMousePosition = this.addWorldObject(new SpriteText({ x: 0, y: 0, font: Assets.fonts.DELUXE16 }));
        }
    }

    update(options: UpdateOptions) {
        let currentWorldOptions = O.withOverrides(options, {
            world: this.currentWorld,
        });
        this.cutsceneManager.update(currentWorldOptions);
        if (!this.isCutscenePlaying && _.isEmpty(this.inControl)) {
            this.inControl = this.currentScene.defaultControl;
        }
        super.update(options);

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

    loadScene(name: string, transition?: Transition) {
        if (transition) {
            this.loadSceneWithTransition(name, transition);
            return;
        }

        let scene = this.scenes[name];
        if (!scene) {
            debug(`Scene '${name}' does not exist in world.`);
            return;
        }

        // Remove old stuff
        if (this.currentWorld) {
            this.removeWorldObject(this.currentWorld);
        }

        this.cutsceneManager.reset();

        // Create new stuff
        this.currentSceneName = name;
        this.currentWorld = Theater.createWorldFromScene(scene);
        this.currentWorld.debugMoveCameraWithArrows = DEBUG_MOVE_CAMERA_WITH_ARROWS;
        this.addWorldObject(this.currentWorld);
        this.setLayer(this.currentWorld, Theater.LAYER_WORLD);

        // Start scene's entry point
        if (scene.entry) {
            this.playCutsceneByName(scene.entry);
        }
    }

    private loadSceneWithTransition(name: string, transition: Transition) {
        if (!this.currentWorld) {
            this.loadScene(name);
            return;
        }

        let oldSnapshot = this.currentWorld.takeSnapshot(Main.renderer);
        this.loadScene(name);
        let newSnapshot = this.currentWorld.takeSnapshot(Main.renderer);

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

    playCutsceneByName(name: string) {
        let cutscene = this.currentScene.cutscenes[name];
        if (!cutscene) {
            debug(`Cutscene '${name}' does not exist in scene:`, this.currentScene);
            return;
        }
        this.inControl = [];
        this.cutsceneManager.playCutscene(cutscene, this.currentWorld, this.skipCutsceneScriptKey);
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

    static createWorldFromScene(scene: Scene) {
        let world = new World(scene.stage, {
            //renderDirectly: true,
        });

        if (scene.stage.worldObjects) {
            for (let worldObject of scene.stage.worldObjects) {
                this.addWorldObjectFromStageConfig(world, worldObject);
            }
        }

        if (scene.schema.worldObjects) {
            for (let worldObject of scene.schema.worldObjects) {
                this.addWorldObjectFromStageConfig(world, worldObject);
            }
        }

        world.camera.mode = scene.cameraMode || Theater.DEFAULT_CAMERA_MODE;

        return world;
    }

    static LAYER_WORLD = 'world';
    static LAYER_TRANSITION = 'transition';
    static LAYER_SLIDES = 'slides';
    static LAYER_DIALOG = 'dialog';

    static DEFAULT_CAMERA_MODE: Camera.Mode = { type: 'focus', point: { x: Main.width/2, y: Main.height/2 } };
}