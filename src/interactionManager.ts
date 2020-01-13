namespace InteractionManager {
    export type Config = {
        highlightFunction: (sprite: Sprite) => any;
        resetFunction: (sprite: Sprite) => any;
    }
}

class InteractionManager {
    theater: Theater;

    private highlightFunction: (sprite: Sprite) => any;
    private resetFunction: (sprite: Sprite) => any;

    private highlightedObject: Sprite;

    constructor(theater: Theater, config: InteractionManager.Config) {
        this.theater = theater;

        this.highlightFunction = config.highlightFunction;
        this.resetFunction = config.resetFunction;

        this.highlightedObject = null;
    }

    update() {
        for (let obj of this.theater.currentWorld.worldObjects) {
            if (obj instanceof Sprite) {
                if (obj === this.highlightedObject) {
                    this.highlightFunction(obj);
                } else {
                    this.resetFunction(obj);
                }
            }
        }
    }

    getInteractableObjects(): Set<string> {
        let result = new Set<string>();

        let cutscenes = this.getInteractableCutscenes();
        for (let cutscene of cutscenes) {
            for (let obj of (<Cutscene>global.theater.storyboard[cutscene]).playOnInteractWith) {
                if (this.theater.currentWorld.containsWorldObject(obj)) {
                    result.add(obj);
                }
            }
        }

        return result;
    }

    highlight(obj: string | Sprite) {
        if (!obj) {
            this.highlightedObject = null;
            return;
        }
        if (_.isString(obj)) {
            let worldObject = this.theater.currentWorld.getWorldObjectByName(obj);
            if (!(worldObject instanceof Sprite)) return;
            obj = worldObject;
        }
        this.highlightedObject = obj;
    }

    interact(obj: string | Sprite) {
        if (!_.isString(obj)) {
            let objName = this.theater.currentWorld.getName(obj);
            if (!objName) return;
            obj = objName;
        }

        let cutscenes = this.getCutscenesForInteraction(obj);

        if (_.isEmpty(cutscenes)) {
            debug(`No cutscene available to interact with object ${obj}`);
            return;
        }

        if (cutscenes.length > 1) {
            debug(`More than one cutscene available to interact with object ${obj}`);
            return;
        }

        global.theater.startStoryboardComponentByName(cutscenes[0]);
    }

    reset() {
        this.highlightedObject = null;
    }

    private getCutscenesForInteraction(objName: string) {
        return this.getInteractableCutscenes().filter(cutscene => {
            let component = global.theater.storyboard[cutscene];
            return component && component.type === 'cutscene' && _.contains(component.playOnInteractWith, objName);
        });
    }

    private getInteractableCutscenes() {
        let result: string[] = [];

        for (let key in global.theater.storyboard) {
            let component = global.theater.storyboard[key];
            if (component.type !== 'cutscene') continue;
            if (!global.theater.cutsceneManager.canPlayCutscene(key)) continue;
            if (_.isEmpty(component.playOnInteractWith)) continue;
            result.push(key);
        }

        return result;
    }
}