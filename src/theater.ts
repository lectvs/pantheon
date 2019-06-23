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

    currentSceneName: string;
    currentWorld: World;
    dialogBox: DialogBox;

    scriptManager: ScriptManager;
    cutsceneManager: CutsceneManager;
    
    constructor(config: Theater.Config) {
        super({
            layers: [
                { name: 'main' },
                { name: 'dialog' },
            ],
        });
        this.scenes = config.scenes;
        this.loadDialogBox(config.dialogBox);
        this.loadScene(config.sceneToLoad);

        this.scriptManager = new ScriptManager();
        this.cutsceneManager = new CutsceneManager();
    }

    update(delta: number, world?: World) {
        this.scriptManager.update(delta, this.currentWorld);
        this.cutsceneManager.update(delta, this.currentWorld);
        super.update(delta, world);
    }

    loadDialogBox(config: DialogBox.Config) {
        this.dialogBox = new DialogBox(config);
        this.dialogBox.visible = false;
        this.addWorldObject(this.dialogBox);
        this.setLayer(this.dialogBox, 'dialog');
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

        // Create new stuff
        this.currentSceneName = name;
        this.currentWorld = Theater.createWorldFromScene(scene);
        this.addWorldObject(this.currentWorld);
        this.setLayer(this.currentWorld, 'main');
    }

    runScript(script: Script | Script.Function) {
        this.scriptManager.runScript(script);
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