/// <reference path="../utils/uid.ts" />

namespace WorldObject {
    export type Config = {
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
        matchParentLayer?: boolean;
        matchParentPhysicsGroup?: boolean;
        zBehavior?: ZBehavior;
        timeScale?: number;
        data?: any;
    } & Callbacks<WorldObject>;

    export type CallbackKeys =
        'onAdd'
      | 'onRemove'
      | 'update'
      | 'render';
    export type Callbacks<T> = {
        onAdd?: OnAddCallback<T>;
        onRemove?: OnRemoveCallback<T>;
        update?: UpdateCallback<T>;
        render?: RenderCallback<T>;
    }

    export type ZBehavior = 'noop' | 'threequarters';

    export type OnAddCallback<T> = (this: T) => any;
    export type OnRemoveCallback<T> = (this: T) => any;
    export type UpdateCallback<T> = (this: T) => any;
    export type RenderCallback<T> = (this: T, screen: Texture, x: number, y: number) => any;
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

    controller: Controller;
    get isControlRevoked() { return global.theater.isCutscenePlaying; }

    behavior: Behavior;

    readonly uid: string;

    protected scriptManager: ScriptManager;
    protected stateMachine: StateMachine;
    get state() { return this.stateMachine.getCurrentStateName(); }

    onAddCallback: WorldObject.OnAddCallback<this>;
    onRemoveCallback: WorldObject.OnRemoveCallback<this>;
    updateCallback: WorldObject.UpdateCallback<this>;
    renderCallback: WorldObject.RenderCallback<this>;

    debugFollowMouse: boolean;

    constructor(config: WorldObject.Config = {}) {
        this.localx = config.x ?? 0;
        this.localy = config.y ?? 0;
        this.localz = config.z ?? 0;
        this.visible = config.visible ?? true;
        this.active = config.active ?? true;
        this.life = new Timer(config.life ?? Infinity, () => this.kill());
        this.zBehavior = config.zBehavior ?? WorldObject.DEFAULT_Z_BEHAVIOR;
        this.timeScale = config.timeScale ?? 1;
        this.data = config.data ? O.deepClone(config.data) : {};

        this.ignoreCamera = config.ignoreCamera ?? false;
        this.matchParentLayer = config.matchParentLayer ?? false;
        this.matchParentPhysicsGroup = config.matchParentPhysicsGroup ?? false;

        this.alive = true;

        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;

        this.controller = new Controller();
        this.behavior = new NullBehavior();

        this.uid = WorldObject.UID.generate();

        this._world = null;
        this._children = [];
        this._parent = null;

        this.internalSetNameWorldObject(config.name);
        this.internalSetLayerWorldObject(config.layer);
        this.internalSetPhysicsGroupWorldObject(config.physicsGroup);

        this.scriptManager = new ScriptManager();
        this.stateMachine = new StateMachine();

        this.onAddCallback = config.onAdd;
        this.onRemoveCallback = config.onRemove;
        this.updateCallback = config.update;
        this.renderCallback = config.render;

        this.debugFollowMouse = false;
    }

    onAdd() {
        if (this.onAddCallback) this.onAddCallback();
    }

    onRemove() {
        if (this.onRemoveCallback) this.onRemoveCallback();
    }

    preUpdate() {
        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;
        this.behavior.update(this.delta);
        this.updateController();
    }

    update() {
        this.scriptManager.update(this.delta);
        this.stateMachine.update(this.delta);

        if (this.debugFollowMouse) {
            this.x = this.world.getWorldMouseX();
            this.y = this.world.getWorldMouseY();
        }
        if (this.updateCallback) this.updateCallback();

        this.life.update(this.delta);

        if (this.parent && this.ignoreCamera) {
            debug(`Warning: ignoraCamera is set to true on a child object. This will be ignored!`);
        }
    }

    postUpdate() {
        this.controller.reset();

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

    render(texture: Texture, x: number, y: number) {
        if (this.renderCallback) this.renderCallback(texture, x, y);
    }

    addChild<T extends WorldObject>(child: T): T {
        return World.Actions.addChildToParent(child, this);
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

    getVisibleScreenBounds() {
        return undefined;
    }

    isOnScreen() {
        let bounds = this.getVisibleScreenBounds();
        if (!bounds) return true;
        return bounds.x + bounds.width >= 0
            && bounds.x <= this.world.width
            && bounds.y + bounds.height >= 0
            && bounds.y <= this.world.height;
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

    runScript(script: Script | Script.Function) {
        return this.scriptManager.runScript(script);
    }

    setState(state: string) {
        this.stateMachine.setState(state);
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

    private updateController() {
        if (this.isControlRevoked) return;
        this.controller.updateFromBehavior(this.behavior);
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