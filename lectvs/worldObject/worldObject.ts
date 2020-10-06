/// <reference path="../utils/uid.ts" />

namespace WorldObject {
    export type Config = {
        parent?: WorldObject.Config;
        constructor?: any;
        name?: string;
        layer?: string;
        physicsGroup?: string;
        x?: number;
        y?: number;
        z?: number;
        visible?: boolean;
        active?: boolean;
        life?: number;
        ignoreCamera?: boolean;
        zBehavior?: ZBehavior;
        timeScale?: number;
        data?: any;
        controllable?: boolean;
        children?: WorldObject.Config[];
        updateCallback?: UpdateCallback;
        renderCallback?: RenderCallback;
        debug?: DebugConfig;
    }

    export type DebugConfig = {
        followMouse?: boolean;
    }

    export type ZBehavior = 'noop' | 'threequarters';

    export type UpdateCallback = (obj: WorldObject) => any;
    export type RenderCallback = (obj: WorldObject, screen: Texture) => any;
}

class WorldObject {
    localx: number;
    localy: number;
    localz: number;
    visible: boolean;
    active: boolean;
    life: Timer;
    ignoreCamera: boolean;
    zBehavior: WorldObject.ZBehavior;
    timeScale: number;
    data: any;

    get x() { return this.localx + (this.parent ? this.parent.x : 0); }
    get y() { return this.localy + (this.parent ? this.parent.y : 0); }
    get z() { return this.localz + (this.parent ? this.parent.z : 0); }
    set x(value: number) { this.localx = value - (this.parent ? this.parent.x : 0); }
    set y(value: number) { this.localy = value - (this.parent ? this.parent.y : 0); }
    set z(value: number) { this.localz = value - (this.parent ? this.parent.z : 0); }

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

    get delta() { return (this.world ? this.world.delta : global.game.delta) * this.timeScale;}

    lastx: number;
    lasty: number;
    lastz: number;

    controllable: boolean;
    controller: Controller;
    protected controllerSchema: Controller.Schema;
    get isControlled() { return this.controllable && !global.theater.isCutscenePlaying; }

    readonly uid: string;

    protected scriptManager: ScriptManager;
    protected stateMachine: StateMachine;
    get state() { return this.stateMachine.getCurrentStateName(); }

    private updateCallback: WorldObject.UpdateCallback;
    private renderCallback: WorldObject.RenderCallback;

    debugFollowMouse: boolean;

    constructor(config: WorldObject.Config, defaults?: WorldObject.Config) {
        config = WorldObject.resolveConfig(config, defaults);
        this.localx = config.x ?? 0;
        this.localy = config.y ?? 0;
        this.localz = config.z ?? 0;
        this.visible = config.visible ?? true;
        this.active = config.active ?? true;
        this.life = new Timer(config.life ?? Infinity, () => this.kill());
        this.zBehavior = config.zBehavior ?? WorldObject.DEFAULT_Z_BEHAVIOR;
        this.timeScale = config.timeScale ?? 1;
        this.ignoreCamera = config.ignoreCamera ?? false;
        this.data = config.data ? _.clone(config.data) : {};

        this.alive = true;

        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;

        this.controllable = config.controllable ?? false;
        this.controller = {};
        this.controllerSchema = {};

        this.uid = WorldObject.UID.generate();

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
        this.renderCallback = config.renderCallback;

        this.debugFollowMouse = config.debug?.followMouse ?? false;
    }

    onAdd() {}
    onRemove() {}

    preUpdate() {
        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;
        if (this.isControlled) {
            this.updateControllerFromSchema();
        }
    }

    update() {
        this.updateScriptManager();
        this.updateStateMachine();

        if (this.debugFollowMouse) {
            this.x = this.world.getWorldMouseX();
            this.y = this.world.getWorldMouseY();
        }
        if (this.updateCallback) this.updateCallback(this);

        this.life.update(this.delta);

        if (this.parent && this.ignoreCamera) {
            debug(`Warning: ignoraCamera is set to true on a child object. This will be ignored!`);
        }
    }

    protected updateScriptManager() {
        this.scriptManager.update(this.delta);
    }

    protected updateStateMachine() {
        this.stateMachine.update(this.delta);
    }

    postUpdate() {
        this.resetController();
    }

    fullUpdate() {
        this.preUpdate();
        this.update();
        this.postUpdate();
    }

    get renderScreenX() {
        let result: number;

        if (this.parent) {
            result = this.parent.renderScreenX;
        } else {
            result = this.shouldIgnoreCamera() ? 0 : -Math.round(this.world.camera.worldOffsetX);
        }

        result += Math.round(this.localx);

        return result;
    }

    get renderScreenY() {
        let result: number;

        if (this.parent) {
            result = this.parent.renderScreenY;
        } else {
            result = this.shouldIgnoreCamera() ? 0 : -Math.round(this.world.camera.worldOffsetY);
        }

        result += Math.round(this.localy);

        if (this.zBehavior === 'threequarters') {
            let parentz = this.parent ? this.parent.z : 0;
            result += parentz - this.z;
        }

        return result;
    }

    preRender() {

    }

    render(screen: Texture) {
        if (this.renderCallback) this.renderCallback(this, screen);
    }

    postRender() {

    }

    worldRender(screen: Texture) {
        this.preRender();
        this.render(screen);
        this.postRender();
    }

    addChild<T extends WorldObject>(child: T | WorldObject.Config): T {
        let worldObject: T = child instanceof WorldObject ? child : WorldObject.fromConfig(child);
        return World.Actions.addChildToParent(worldObject, this);
    }

    addChildKeepWorldPosition<T extends WorldObject>(child: T): T {
        let x = child.x;
        let y = child.y;
        let z = child.z;
        let result = this.addChild(child);
        child.x = x;
        child.y = y;
        child.z = z;
        return result;
    }

    addChildren<T extends WorldObject>(children: (T | WorldObject.Config)[]): T[] {
        let worldObjects: T[] = _.isEmpty(children) ? [] : children.map(child => child instanceof WorldObject ? <T>child : WorldObject.fromConfig<T>(child));
        return World.Actions.addChildrenToParent(worldObjects, this);
    }

    getChildByIndex<T extends WorldObject>(index: number) {
        if (this.children.length < index) {
            error(`Parent has no child at index ${index}:`, this);
            return undefined;
        }
        return <T>this.children[index];
    }

    getChildByName<T extends WorldObject>(name: string): T {
        for (let child of this.children) {
            if (child.name === name) return <T>child;
        }
        error(`Cannot find child named ${name} on parent:`, this);
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
            if (!child) return undefined;
        }
        if (child.parent !== this) {
            error(`Cannot remove child ${child.name} from parent ${this.name}, but no such relationship exists`);
            return undefined;
        }
        return World.Actions.removeChildFromParent(child);
    }

    removeChildKeepWorldPosition<T extends WorldObject>(child: T): T {
        let x = child.x;
        let y = child.y;
        let z = child.z;
        let result = this.removeChild(child);
        child.x = x;
        child.y = y;
        child.z = z;
        return result;
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

    private shouldIgnoreCamera() {
        if (this.ignoreCamera) return true;
        if (this.parent) return this.parent.shouldIgnoreCamera();
        return false;
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

    static DEFAULT_Z_BEHAVIOR: WorldObject.ZBehavior = 'noop';
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
            } else if (key === 'children') {
                result[key] = A.mergeArray(config[key], result[key], (e: WorldObject.Config) => e.name, resolveConfig);
            } else {
                result[key] = config[key];
            }
        }

        return result;
    }

    export const UID = new UIDGenerator();
}