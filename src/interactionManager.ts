namespace InteractionManager {
    export type Config = {
        highlightFunction: (sprite: Sprite) => any;
        resetFunction: (sprite: Sprite) => any;
    }
}

class InteractionManager {
    theater: Theater;

    private highlightedObject: Sprite;
    private highlightedObjectOutline: Effects.OutlineConfig;

    get interactRequested() { return this._interactRequested; }
    private _interactRequested: string;

    constructor(theater: Theater) {
        this.theater = theater;

        this.reset();
    }

    preRender() {
        if (this.highlightedObject) {
            this.highlightedObjectOutline = {
                enabled: this.highlightedObject.effects.outline.enabled,
                color: this.highlightedObject.effects.outline.color,
                alpha: this.highlightedObject.effects.outline.alpha
            };
            this.highlightedObject.effects.outline.enabled = true;
            this.highlightedObject.effects.outline.color = 0xFFFF00;
            this.highlightedObject.effects.outline.alpha = 1;
        }
    }

    postRender() {
        if (this.highlightedObject) {
            this.highlightedObject.effects.outline.enabled = this.highlightedObjectOutline.enabled;
            this.highlightedObject.effects.outline.color = this.highlightedObjectOutline.color;
            this.highlightedObject.effects.outline.alpha = this.highlightedObjectOutline.alpha;
        }
    }

    consumeInteraction() {
        this._interactRequested = null;
    }

    getInteractableObjects(): Set<string> {
        let interactableObjects = this.theater.storyManager.getInteractableObjects(this.theater.storyManager.currentNode);
        let result = new Set<string>();
        for (let name of interactableObjects) {
            if (!this.theater.currentWorld.containsWorldObject(name)) continue;
            result.add(name);
        }
        return result;
    }

    highlight(obj: string) {
        if (!obj) {
            this.highlightedObject = null;
            return;
        }

        let worldObject = this.theater.currentWorld.getWorldObjectByName(obj);
        if (!(worldObject instanceof Sprite)) {
            debug(`Cannot highlight object ${obj} because it is not a Sprite`);
            return;
        }

        this.highlightedObject = worldObject;
    }

    interact(obj: string = this.highlightedObject.name) {
        this._interactRequested = obj;
    }

    reset() {
        this.highlightedObject = null;
        this.highlightedObjectOutline = null;
        this._interactRequested = null;
    }
}