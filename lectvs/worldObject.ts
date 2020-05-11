namespace WorldObject {
    export type Config = {
        parent?: WorldObject.Config;
        constructor?: any;
        name?: string;
        layer?: string;
        physicsGroup?: string;
        x?: number;
        y?: number;
        visible?: boolean;
        active?: boolean;
        life?: number;
        ignoreCamera?: boolean;
        data?: any;
        controllable?: boolean;
        children?: WorldObject.Config[];
        updateCallback?: UpdateCallback;
    }

    export type UpdateCallback = (obj: WorldObject, delta: number) => any;
}

class WorldObject {
    localx: number;
    localy: number;
    visible: boolean;
    active: boolean;
    life: Timer;
    ignoreCamera: boolean;
    data: any;

    get x() { return this.localx + (this.parent ? this.parent.x : 0); }
    get y() { return this.localy + (this.parent ? this.parent.y : 0); }
    set x(value: number) { this.localx = value - (this.parent ? this.parent.x : 0); }
    set y(value: number) { this.localy = value - (this.parent ? this.parent.y : 0); }

    alive: boolean;

    // World data
    private _world: World;
    private _name: string;
    private _layer: string;
    private _physicsGroup: string;
    private _children: WorldObject[];
    private _parent: WorldObject;

    get world() { return this._world; }
    get name() { return this._name; }
    get layer() { return this._layer; }
    get physicsGroup() { return this._physicsGroup; }
    get children() { return <ReadonlyArray<WorldObject>>this._children; }
    get parent() { return this._parent; }
    //

    lastx: number;
    lasty: number;

    controllable: boolean;
    controller: Controller;
    protected controllerSchema: Controller.Schema;
    get isControlled() { return this.controllable && !global.theater.isCutscenePlaying; }

    mask: Texture;
    private preRenderStoredX: number;
    private preRenderStoredY: number;

    protected scriptManager: ScriptManager;
    protected stateMachine: StateMachine;
    get state() { return this.stateMachine.getCurrentStateName(); }

    private updateCallback: WorldObject.UpdateCallback;

    constructor(config: WorldObject.Config, defaults?: WorldObject.Config) {
        config = WorldObject.resolveConfig(config, defaults);
        this.localx = O.getOrDefault(config.x, 0);
        this.localy = O.getOrDefault(config.y, 0);
        this.visible = O.getOrDefault(config.visible, true);
        this.active = O.getOrDefault(config.active, true);
        this.life = new Timer(O.getOrDefault(config.life, Infinity), () => this.kill());
        this.ignoreCamera = O.getOrDefault(config.ignoreCamera, false);
        this.data = _.clone(O.getOrDefault(config.data, {}));

        this.alive = true;

        this.lastx = this.x;
        this.lasty = this.y;

        this.controllable = O.getOrDefault(config.controllable, false);
        this.controller = {};
        this.controllerSchema = {};

        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;

        this._world = null;
        this.internalSetNameWorldObject(config.name);
        this.internalSetLayerWorldObject(config.layer);
        this.internalSetPhysicsGroupWorldObject(config.physicsGroup);
        this._children = [];
        this._parent = null;
        this.addChildren(config.children);

        this.scriptManager = new ScriptManager();
        this.stateMachine = new StateMachine();

        this.updateCallback = config.updateCallback;
    }

    onAdd() {}
    onRemove() {}

    preUpdate() {
        this.lastx = this.x;
        this.lasty = this.y;
        if (this.isControlled) {
            this.updateControllerFromSchema();
        }
    }

    update(delta: number) {
        this.updateScriptManager(delta);
        this.updateStateMachine(delta);
        if (this.updateCallback) this.updateCallback(this, delta);
        this.life.update(delta);
    }

    protected updateScriptManager(delta: number) {
        this.scriptManager.update(delta);
    }

    protected updateStateMachine(delta: number) {
        this.stateMachine.update(delta);
    }

    postUpdate() {
        this.resetController();
    }

    fullUpdate(delta: number) {
        this.preUpdate();
        this.update(delta);
        this.postUpdate();
    }

    preRender() {
        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;

        // Snap object to pixel in world-space
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        if (!this.ignoreCamera) {
            this.x -= this.world.camera.worldOffsetX;
            this.y -= this.world.camera.worldOffsetY;
        }

        // Snap object to pixel in screen-space
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }

    render(screen: Texture) {

    }

    postRender() {
        this.x = this.preRenderStoredX;
        this.y = this.preRenderStoredY;
    }

    fullRender(screen: Texture) {
        this.preRender();
        this.render(screen);
        this.postRender();
    }

    addChild<T extends WorldObject>(child: T | WorldObject.Config): T {
        let worldObject: T = child instanceof WorldObject ? child : WorldObject.fromConfig(child);
        return World.Actions.addChildToParent(worldObject, this);
    }

    addChildren<T extends WorldObject>(children: (T | WorldObject.Config)[]): T[] {
        let worldObjects: T[] = _.isEmpty(children) ? [] : children.map(child => child instanceof WorldObject ? <T>child : WorldObject.fromConfig<T>(child));
        return World.Actions.addChildrenToParent(worldObjects, this);
    }

    getChildByName<T extends WorldObject>(name: string): T {
        for (let child of this.children) {
            if (child.name === name) return <T>child;
        }
        debug(`Cannot find child named ${name} on parent:`, this);
        return undefined;
    }

    kill() {
        this.alive = false;
    }

    removeAllChildren<T extends WorldObject>(): T[] {
        return this.removeChildren(<ReadonlyArray<T>>this.children);
    }

    removeChild<T extends WorldObject>(child: T | string): T {
        if (!child) return undefined;
        if (_.isString(child)) {
            child = this.getChildByName<T>(child);
            if (!child) return;
        }
        if (child.parent !== this) {
            debug(`Cannot remove child ${child.name} from parent ${this.name}, but no such relationship exists`);
            return undefined;
        }
        return World.Actions.removeChildFromParent(child);
    }

    removeChildren<T extends WorldObject>(children: ReadonlyArray<T>): T[] {
        if (_.isEmpty(children)) return [];
        return children.map(child => this.removeChild(child)).filter(child => child);
    }

    removeFromWorld(): this {
        if (!this.world) return this;
        return World.Actions.removeWorldObjectFromWorld(this);
    }

    resetController() {
        for (let key in this.controller) {
            this.controller[key] = false;
        }
    }

    runScript(script: Script | Script.Function) {
        return this.scriptManager.runScript(script);
    }

    setState(state: string) {
        this.stateMachine.setState(state);
    }

    updateControllerFromSchema() {
        for (let key in this.controllerSchema) {
            this.controller[key] = this.controllerSchema[key]();
        }
    }

    // For use with World.Actions.addWorldObjectToWorld
    private internalAddWorldObjectToWorldWorldObject(world: World) {
        this._world = world;
        if (!this._layer) this._layer = World.DEFAULT_LAYER;
    }

    // For use with World.Actions.removeWorldObjectFromWorld
    private internalRemoveWorldObjectFromWorldWorldObject(world: World) {
        this._world = null;
    }

    // For use with World.Actions.setName
    private internalSetNameWorldObject(name: string) {
        this._name = name;
    }

    // For use with World.Actions.setLayer
    private internalSetLayerWorldObject(layer: string) {
        this._layer = layer;
    }

    // For use with World.Actions.setPhysicsGroup
    private internalSetPhysicsGroupWorldObject(physicsGroup: string) {
        this._physicsGroup = physicsGroup;
    }

    // For use with World.Actions.addChildToParent
    private internalAddChildToParentWorldObjectChild(parent: WorldObject) {
        this._parent = parent;
    }

    // For use with World.Actions.addChildToParent
    private internalAddChildToParentWorldObjectParent(child: WorldObject) {
        this._children.push(child);
    }

    // For use with World.Actions.removeChildFromParent
    private internalRemoveChildFromParentWorldObjectChild() {
        this._parent = null;
    }

    // For use with World.Actions.removeChildFromParent
    private internalRemoveChildFromParentWorldObjectParent(child: WorldObject) {
        A.removeAll(this._children, child);
    }
}

namespace WorldObject {
    export function fromConfig<T extends WorldObject>(config: WorldObject.Config): T {
        config = WorldObject.resolveConfig(config);

        let result = new config.constructor(config);
        if (result === config) result = new WorldObject(config);  // Default constructor to WorldObject

        return <T>result;
    }

    export function resolveConfig<T extends WorldObject.Config>(config: T, ...parents: T[]): T {
        let result = resolveConfigParent(config);
        if (_.isEmpty(parents)) return <T>result;

        for (let parent of parents) {
            result.parent = parent;
            result = resolveConfig(result);
        }

        return <T>result;
    }

    function resolveConfigParent(config: WorldObject.Config): WorldObject.Config {
        if (!config.parent) return _.clone(config);

        let result = resolveConfig(config.parent);

        for (let key in config) {
            if (key === 'parent') continue;
            if (!result[key]) {
                result[key] = config[key];
            } else if (key === 'animations') {
                result[key] = A.mergeArray(config[key], result[key], (e: Animation.Config) => e.name);
            } else if (key === 'states') {
                result[key] = O.mergeObject(config[key], result[key]);
            } else if (key === 'data') {
                result[key] = O.withOverrides(result[key], config[key]);
            } else {
                result[key] = config[key];
            }
        }

        return result;
    }
}