/// <reference path="./world.ts"/>

namespace Theater {
    export type Config = {
        scenes: Dict<Scene>;
        sceneToLoad: string;
        dialogBox: DialogBox.Config;
    }
}

class Theater extends World {
    scenes: Dict<Scene>;

    cutsceneManager: CutsceneManager;
    inControl: string[];

    currentSceneName: string;
    currentWorld: World;
    dialogBox: DialogBox;

    get isCutscenePlaying() { return this.cutsceneManager.isCutscenePlaying; }
    
    constructor(config: Theater.Config) {
        super({
            layers: [
                { name: 'main' },
                { name: 'dialog' },
            ],
        });
        this.scenes = config.scenes;

        this.cutsceneManager = new CutsceneManager();
        this.inControl = [];

        this.loadDialogBox(config.dialogBox);
        this.loadScene(config.sceneToLoad);
    }

    update(options: UpdateOptions) {
        let currentWorldOptions = O.withOverrides(options, {
            world: this.currentWorld,
        });
        this.cutsceneManager.update(currentWorldOptions);
        if (!this.isCutscenePlaying && _.isEmpty(this.inControl)) {
            this.inControl = this.getCurrentScene().defaultControl;
        }
        super.update(options);
    }

    getCurrentScene() {
        return this.scenes[this.currentSceneName];
    }

    loadScene(name: string) {
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
        this.addWorldObject(this.currentWorld);
        this.setLayer(this.currentWorld, 'main');

        // Start scene's entry point
        if (scene.entry) {
            this.playCutsceneByName(scene.entry);
        }
    }

    playCutsceneByName(name: string) {
        let scene = this.getCurrentScene();
        let cutscene = scene.cutscenes[name];
        if (!cutscene) {
            debug(`Cutscene '${name}' does not exist in scene:`, scene);
            return;
        }
        this.inControl = [];
        this.cutsceneManager.playCutscene(cutscene, this.currentWorld);
    }

    private loadDialogBox(config: DialogBox.Config) {
        this.dialogBox = new DialogBox(config);
        this.dialogBox.visible = false;
        this.addWorldObject(this.dialogBox);
        this.setLayer(this.dialogBox, 'dialog');
    }
    
    static addWorldObjectFromStageConfig(world: World, worldObject: SomeStageConfig) {
        if (!worldObject.constructor) return;

        let obj = new worldObject.constructor(worldObject);
        world.addWorldObject(obj);

        let config = <AllStageConfig> worldObject;

        if (obj instanceof WorldObject) {
            _.defaults(config, {
                layer: World.DEFAULT_LAYER,
            });

            if (config.name) {
                world.setName(obj, config.name);
            }

            world.setLayer(obj, config.layer);
        }

        if (obj instanceof PhysicsWorldObject) {
            if (config.physicsGroup) world.setPhysicsGroup(obj, config.physicsGroup);
        }
    }

    static createWorldFromScene(scene: Scene) {
        let world = new World(scene.stage, {
            renderDirectly: true,
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

        return world;
    }
}