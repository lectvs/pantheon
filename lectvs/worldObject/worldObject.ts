/// <reference path="../utils/uid.ts" />

namespace WorldObject {
    export type ZBehavior = 'noop' | 'threequarters';

    export type UpdateCallback<T> = (obj: T) => any;
    export type RenderCallback<T> = (obj: T, screen: Texture) => any;
}

class WorldObject {
    localx: number;
    localy: number;
    localz: number;
    visible: boolean;
    active: boolean;
    life: Timer;
    zBehavior: WorldObject.ZBehavior;
    timeScale: number;
    data: any;

    ignoreCamera: boolean;
    matchParentLayer: boolean;
    matchParentPhysicsGroup: boolean;

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
    get layer() {
        this.resolveLayer();
        return this._layer;
    }
    get physicsGroup() {
        this.resolvePhysicsGroup();
        return this._physicsGroup;
    }
    get children() { return <ReadonlyArray<WorldObject>>this._children; }
    get parent() { return this._parent; }

    set name(value: string) { World.Actions.setName(this, value); }
    set layer(value: string) { World.Actions.setLayer(this, value); }
    set physicsGroup(value: string) { World.Actions.setPhysicsGroup(this, value); }
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

    updateCallback: WorldObject.UpdateCallback<this>;
    renderCallback: WorldObject.RenderCallback<this>;

    debugFollowMouse: boolean;

    constructor() {
        this.localx = 0;
        this.localy = 0;
        this.localz = 0;
        this.visible = true;
        this.active = true;
        this.life = new Timer(Infinity, () => this.kill());
        this.zBehavior = WorldObject.DEFAULT_Z_BEHAVIOR;
        this.timeScale = 1;
        this.data = {};

        this.ignoreCamera = false;
        this.matchParentLayer = false;
        this.matchParentPhysicsGroup = false;

        this.alive = true;

        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;

        this.controllable = false;
        this.controller = {};
        this.controllerSchema = {};

        this.uid = WorldObject.UID.generate();

        this._world = null;
        this._children = [];
        this._parent = null;

        this.internalSetNameWorldObject(undefined);
        this.internalSetLayerWorldObject(undefined);
        this.internalSetPhysicsGroupWorldObject(undefined);

        this.scriptManager = new ScriptManager();
        this.stateMachine = new StateMachine();

        this.debugFollowMouse = false;
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

        this.resolveLayer();
        this.resolvePhysicsGroup();
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

    addChild<T extends WorldObject>(child: T, worldProperties?: World.WorldObjectProperties): T {
        let worldObject = World.Actions.addChildToParent(child, this);
        if (worldProperties) {
            if (worldProperties.name) worldObject.name = worldProperties.name;
            if (worldProperties.layer) worldObject.layer = worldProperties.layer;
            if (worldProperties.physicsGroup) worldObject.physicsGroup = worldProperties.physicsGroup;
        }
        return worldObject;
    }

    addChildKeepWorldPosition<T extends WorldObject>(child: T, worldProperties?: World.WorldObjectProperties): T {
        let x = child.x;
        let y = child.y;
        let z = child.z;
        let result = this.addChild(child, worldProperties);
        child.x = x;
        child.y = y;
        child.z = z;
        return result;
    }

    addChildren<T extends WorldObject>(children: T[]): T[] {
        return World.Actions.addChildrenToParent(children, this);
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

    private resolveLayer() {
        if (this.matchParentLayer && this.parent && this._layer !== this.parent.layer) {
            this._layer = this.parent.layer;
        }
    }

    private resolvePhysicsGroup() {
        if (this.matchParentPhysicsGroup && this.parent && this._physicsGroup !== this.parent.physicsGroup) {
            this._physicsGroup = this.parent.physicsGroup;
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

    static DEFAULT_Z_BEHAVIOR: WorldObject.ZBehavior = 'noop';
}

namespace WorldObject {
    export const UID = new UIDGenerator();
}