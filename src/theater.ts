/// <reference path="./transition.ts"/>
/// <reference path="./world.ts"/>

namespace Theater {
    export type Config = {
        stages: Dict<Stage>;
        stageToLoad: string;
        storyboard: Storyboard;
        storyboardEntry: string;
        party: Party;
        dialogBox: DialogBox.Config;
        skipCutsceneScriptKey: string;
    }
}

class Theater extends World {
    stages: Dict<Stage>;
    storyboard: Storyboard;
    party: Party;

    cutsceneManager: CutsceneManager;
    skipCutsceneScriptKey: string;

    currentStageName: string;
    currentWorld: World;
    currentStoryboardComponentName: string;

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

        this.party = config.party;
        this.loadParty();

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

    loadStage(name: string, transition?: Transition, entryPoint?: Stage.EntryPoint) {
        if (transition) {
            this.loadStageWithTransition(name, transition, entryPoint);
            return;
        }

        let stage = Stage.resolveStageConfig(this.stages[name]);
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
        this.setNewWorldFromStage(stage, entryPoint);
        this.currentWorld.debugMoveCameraWithArrows = DEBUG_MOVE_CAMERA_WITH_ARROWS;
        this.addWorldObject(this.currentWorld);
        this.setLayer(this.currentWorld, Theater.LAYER_WORLD);

        if (this.currentStoryboardComponentName) {
            this.startStoryboardComponentByName(this.currentStoryboardComponentName);
        }
    }

    private loadStageWithTransition(name: string, transition: Transition, entryPoint?: Stage.EntryPoint) {
        if (!this.currentWorld) {
            this.loadStage(name, undefined, entryPoint);
            return;
        }

        let oldSnapshot = this.currentWorld.takeSnapshot();
        this.loadStage(name, undefined, entryPoint);
        this.currentWorld.update();
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
        } else if (component.type === 'code') {
            global.pushWorld(this.currentWorld);
            component.func();
            global.popWorld();
            if (component.after) {
                return this.startStoryboardComponentByName(component.after);
            }
        }

        this.currentStoryboardComponentName = name;
    }

    private setNewWorldFromStage(stage: Stage, entryPoint: Stage.EntryPoint = Theater.DEFAULT_ENTRY_POINT) {
        let world = new World(stage, {
            renderDirectly: true,
        });

        if (stage.worldObjects) {
            for (let worldObject of stage.worldObjects) {
                this.addWorldObjectFromStageConfig(world, worldObject);
            }
        }

        // Resolve entry point.
        if (_.isString(entryPoint)) {
            entryPoint = Stage.getEntryPoint(stage, entryPoint);
        }
        for (let member of this.getActivePartyMembers()) {
            let memberObj = Party.addMemberToWorld(member, world);
            memberObj.x = entryPoint.x;
            memberObj.y = entryPoint.y;
        }

        this.currentWorld = world;
    }

    private getActivePartyMembers() {
        return Party.getActiveMembers(this.party);
    }

    private loadDialogBox(config: DialogBox.Config) {
        this.dialogBox = new DialogBox(config);
        this.dialogBox.visible = false;
        this.addWorldObject(this.dialogBox);
        this.setLayer(this.dialogBox, Theater.LAYER_DIALOG);
    }

    private loadParty() {
        Party.load(this.party);
    }
    
    private addWorldObjectFromStageConfig(world: World, worldObject: SomeStageConfig) {
        worldObject = Stage.resolveWorldObjectConfig(worldObject);
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

    static LAYER_WORLD = 'world';
    static LAYER_TRANSITION = 'transition';
    static LAYER_SLIDES = 'slides';
    static LAYER_DIALOG = 'dialog';

    static DEFAULT_CAMERA_MODE: Camera.Mode = { type: 'focus', point: { x: Main.width/2, y: Main.height/2 } };
    static DEFAULT_ENTRY_POINT: Pt = { x: Main.width/2, y: Main.height/2 };
}