/// <reference path="../utils/timer.ts" />
/// <reference path="../utils/uid.ts" />

namespace WorldObject {
    export type Config = {
        name?: string;
        layer?: string;
        physicsGroup?: string;
        p?: Pt;
        x?: number;
        y?: number;
        z?: number;
        visible?: boolean;
        active?: boolean;
        activeOutsideWorldBoundsBuffer?: number;
        life?: number;
        timers?: Timer[];
        ignoreCamera?: boolean;
        copyFromParent?: string[];
        zBehavior?: ZBehavior;
        timeScale?: number;
        useGlobalTime?: boolean;
        updateOnNonUpdate?: boolean;
        tags?: string[];
        data?: any;
    } & Callbacks<WorldObject>;

    export type CallbackKeys =
        'onAdd'
      | 'onRemove'
      | 'update'
      | 'postUpdate'
      | 'render';
    export type Callbacks<T> = {
        onAdd?: OnAddCallback<T>;
        onRemove?: OnRemoveCallback<T>;
        update?: UpdateCallback<T>;
        postUpdate?: PostUpdateCallback<T>;
        render?: RenderCallback<T>;
    }

    export type ZBehavior = 'noop' | 'threequarters';

    export type OnAddCallback<T> = (this: T) => any;
    export type OnRemoveCallback<T> = (this: T) => any;
    export type UpdateCallback<T> = (this: T) => any;
    export type PostUpdateCallback<T> = (this: T) => any;
    export type RenderCallback<T> = (this: T, screen: Texture, x: number, y: number) => any;
}

class WorldObject {
    localx: number;
    localy: number;
    localz: number;
    activeOutsideWorldBoundsBuffer: number;
    life: WorldObject.LifeTimer;
    zBehavior: WorldObject.ZBehavior;
    timeScale: number;
    useGlobalTime: boolean;
    updateOnNonUpdate: boolean;
    data: any;

    ignoreCamera: boolean;
    copyFromParent: string[];

    get x() { return this.localx + (this.parent ? this.parent.x : 0); }
    get y() { return this.localy + (this.parent ? this.parent.y : 0); }
    get z() { return this.localz + (this.parent ? this.parent.z : 0); }
    set x(value: number) { this.localx = value - (this.parent ? this.parent.x : 0); }
    set y(value: number) { this.localy = value - (this.parent ? this.parent.y : 0); }
    set z(value: number) { this.localz = value - (this.parent ? this.parent.z : 0); }

    private _visible: boolean;
    private _active: boolean;

    alive: boolean;

    name: string;
    tags: string[];

    // World data
    private _world: World;
    private _layer: string;
    private _physicsGroup: string;
    private _children: WorldObject[];
    private _parent: WorldObject;

    get world() { return this._world; }
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

    set layer(value: string) { World.Actions.setLayer(this, value); }
    set physicsGroup(value: string) { World.Actions.setPhysicsGroup(this, value); }
    //

    get delta() { return ((this.useGlobalTime || !this.world) ? global.game.delta : this.world.delta) * this.timeScale;}

    lastx: number;
    lasty: number;
    lastz: number;

    _isInsideWorldBoundsBufferThisFrame: boolean;

    controller: Controller;

    behavior: Behavior;

    modules: Module<WorldObject>[];

    protected timers: Timer[];

    readonly uid: string;

    protected scriptManager: ScriptManager;
    stateMachine: StateMachine;
    get state() { return this.stateMachine.getCurrentStateName(); }

    onAddCallback: WorldObject.OnAddCallback<this>;
    onRemoveCallback: WorldObject.OnRemoveCallback<this>;
    updateCallback: WorldObject.UpdateCallback<this>;
    postUpdateCallback: WorldObject.PostUpdateCallback<this>;
    renderCallback: WorldObject.RenderCallback<this>;

    debugFollowMouse: boolean;

    constructor(config: WorldObject.Config = {}) {
        this.localx = config.x ?? (config.p ? config.p.x : 0);
        this.localy = config.y ?? (config.p ? config.p.y : 0);
        this.localz = config.z ?? 0;

        this.activeOutsideWorldBoundsBuffer = config.activeOutsideWorldBoundsBuffer ?? Infinity;
        this.life = new WorldObject.LifeTimer(config.life ?? Infinity, () => this.kill());
        this.zBehavior = config.zBehavior ?? WorldObject.DEFAULT_Z_BEHAVIOR;
        this.timeScale = config.timeScale ?? 1;
        this.useGlobalTime = config.useGlobalTime ?? false;
        this.updateOnNonUpdate = config.updateOnNonUpdate ?? false;
        this.data = config.data ? O.deepClone(config.data) : {};

        this.setVisible(config.visible ?? true);
        this.setActive(config.active ?? true);

        this.ignoreCamera = config.ignoreCamera ?? false;
        this.copyFromParent = config.copyFromParent ? A.clone(config.copyFromParent) : [];

        this.alive = true;
        
        this.name = config.name;
        this.tags = config.tags ? A.clone(config.tags) : [];

        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;

        this._isInsideWorldBoundsBufferThisFrame = false;

        this.controller = new Controller();
        this.behavior = new NullBehavior();

        this.modules = [];

        this.timers = config.timers ? A.clone(config.timers) : [];

        this.uid = WorldObject.UID.generate();

        this._world = null;
        this._children = [];
        this._parent = null;

        this.internalSetLayerWorldObject(config.layer);
        this.internalSetPhysicsGroupWorldObject(config.physicsGroup);

        this.scriptManager = new ScriptManager();
        this.stateMachine = new StateMachine();

        this.onAddCallback = config.onAdd;
        this.onRemoveCallback = config.onRemove;
        this.updateCallback = config.update;
        this.postUpdateCallback = config.postUpdate;
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

        for (let module of this.modules) {
            module.update();
        }

        for (let timer of this.timers) {
            timer.update(this.delta);
        }

        this.life.update(this.delta);

        if (this.parent && this.ignoreCamera) {
            debug(`Warning: ignoreCamera is set to true on a child object. This will be ignored!`);
        }
    }

    postUpdate() {
        this.controller.reset();

        if (this.postUpdateCallback) this.postUpdateCallback();

        this.resolveCopyFromParent();
    }

    fullUpdate() {
        this.preUpdate();
        this.update();
        this.postUpdate();
    }

    getRenderScreenX() {
        let result: number;

        if (this.parent) {
            result = this.parent.getRenderScreenX();
        } else {
            result = this.shouldIgnoreCamera() ? 0 : -Math.round(this.world.camera.worldOffsetX);
        }

        result += Math.round(this.localx);

        return result;
    }

    getRenderScreenY() {
        let result: number;

        if (this.parent) {
            result = this.parent.getRenderScreenY();
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

        for (let module of this.modules) {
            module.render(texture, x, y);
        }
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

    addModule<T extends Module<WorldObject>>(module: T): T {
        this.modules.push(module);
        module.init(this);
        return module;
    }

    addTag(tag: string) {
        if (!_.contains(this.tags, tag)) {
            this.tags.push(tag);
        }
    }

    addTimer(durationOrTimer: number | Timer, callback?: () => any, count: number = 1) {
        if (_.isNumber(durationOrTimer)) {
            durationOrTimer = new Timer(durationOrTimer, callback, count);
        }
        this.timers.push(durationOrTimer);
        return durationOrTimer;
    }

    doAfterTime(time: number, callback: Function) {
        this.runScript(function*() {
            yield S.wait(time);
            callback();
        });
    }

    everyNFrames(n: number) {
        return Math.floor((this.life.frames + 1)/n) !== Math.floor(this.life.frames/n);
    }

    everyNSeconds(n: number) {
        return Math.floor((this.life.time + this.delta)/n) !== Math.floor(this.life.time/n);
    }

    getChildByIndex<T extends WorldObject>(index: number) {
        if (this.children.length < index) {
            console.error(`Parent has no child at index ${index}:`, this);
            return undefined;
        }
        return <T>this.children[index];
    }

    getChildByName<T extends WorldObject>(name: string): T {
        for (let child of this.children) {
            if (child.name === name) return <T>child;
        }
        console.error(`Cannot find child named ${name} on parent:`, this);
        return undefined;
    }

    getModule<T extends Module<WorldObject>>(type: new (...args) => T): T {
        for (let module of this.modules) {
            if (module instanceof type) return module;
        }
        return undefined;
    }

    getPosition() {
        return vec2(this.x, this.y);
    }

    getTimers() {
        return A.clone(this.timers);
    }

    getVisibleScreenBounds(): Rect {
        return undefined;
    }

    hasTag(tag: string) {
        return _.contains(this.tags, tag);
    }

    isActive(): boolean {
        return this._active && (!this.parent || this.parent.isActive());
    }

    isControlRevoked() {
        return global.theater?.isCutscenePlaying;
    }

    isOnScreen(buffer: number = 0) {
        let bounds = this.getVisibleScreenBounds();
        if (!bounds) return true;
        return bounds.x + bounds.width >= -buffer
            && bounds.x <= this.world.width + buffer
            && bounds.y + bounds.height >= -buffer
            && bounds.y <= this.world.height + buffer;
    }

    isVisible(): boolean {
        return this._visible && (!this.parent || this.parent.isVisible());
    }

    kill() {
        this.alive = false;
    }

    oscillateNFrames(n: number) {
        return Math.floor(this.life.frames/n) % 2 === 1;
    }

    oscillateNSeconds(n: number) {
        return Math.floor(this.life.time/n) % 2 === 1;
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
            console.error(`Cannot remove child ${child.name} from parent ${this.name}, but no such relationship exists`);
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

    removeFromParent(): this {
        if (!this.parent) return this;
        return this.parent.removeChild(this);
    }

    removeFromParentKeepWorldPosition(): this {
        let x = this.x;
        let y = this.y;
        let z = this.z;
        let result = this.removeFromParent();
        this.x = x;
        this.y = y;
        this.z = z;
        return result;
    }

    removeFromWorld(): this {
        if (!this.world) return this;
        return World.Actions.removeWorldObjectFromWorld(this);
    }

    removeTag(tag: string) {
        A.removeAll(this.tags, tag);
    }

    runScript(script: Script | Script.Function) {
        return this.scriptManager.runScript(script);
    }

    setActive(active: boolean) {
        this._active = active;
    }

    setIsInsideWorldBoundsBufferThisFrame() {
        this._isInsideWorldBoundsBufferThisFrame = isFinite(this.activeOutsideWorldBoundsBuffer)
                    ? this.isOnScreen(this.activeOutsideWorldBoundsBuffer)
                    : true;
    }

    setState(state: string) {
        this.stateMachine.setState(state);
    }

    setVisible(visible: boolean) {
        this._visible = visible;
    }

    private shouldIgnoreCamera() {
        if (this.ignoreCamera) return true;
        if (this.parent) return this.parent.shouldIgnoreCamera();
        return false;
    }

    private resolveLayer() {
        if (_.contains(this.copyFromParent, 'layer') && this.parent && this._layer !== this.parent.layer) {
            this.layer = this.parent.layer;
        }
    }

    private resolvePhysicsGroup() {
        if (_.contains(this.copyFromParent, 'physicsGroup') && this.parent && this._physicsGroup !== this.parent.physicsGroup) {
            this.physicsGroup = this.parent.physicsGroup;
        }
    }

    private resolveCopyFromParent() {
        if (!this.parent) return;
        for (let path of this.copyFromParent) {
            if (path === 'layer') {
                this.resolveLayer();
                continue;
            }
            if (path === 'physicsGroup') {
                this.resolvePhysicsGroup();
                continue;
            }
            if (!O.hasPath(this, path) || !O.hasPath(this.parent, path)) {
                console.error('Cannot copy from parent because path does not exist on both objects:', path, this, this.parent);
                continue;
            }
            let thisValue = O.getPath(this, path);
            let parentValue = O.getPath(this.parent, path);
            if (thisValue === parentValue) continue;
            O.setPath(this, path, parentValue);
        }
    }

    private updateController() {
        if (this.isControlRevoked()) return;
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

    export class LifeTimer extends Timer {
        frames: number;

        constructor(life: number, onFinish: () => void) {
            super(life, onFinish);
            this.frames = 0;
        }

        update(delta: number): void {
            super.update(delta);
            this.frames++;
        }
    }
}