/// <reference path="../utils/timer.ts" />
/// <reference path="../utils/uid.ts" />

namespace WorldObject {
    export type Config<WO extends WorldObject> = {
        name?: string;
        layer?: string;
        physicsGroup?: string;
        p?: Pt;
        x?: number;
        y?: number;
        z?: number;
        v?: Pt;
        vx?: number;
        vy?: number;
        vz?: number;
        visible?: boolean;
        active?: boolean;
        activeOutsideWorldBoundsBuffer?: number;
        animations?: Dict<AnimationInstance>;
        defaultAnimation?: string;
        life?: number;
        timers?: Timer[];
        ignoreCamera?: boolean;
        copyFromParent?: string[];
        zBehavior?: ZBehavior;
        timeScale?: number;
        useGlobalTime?: boolean;
        tags?: string[];
        hooks?: HooksConfig<Hooks<WO>>;
        data?: any;

        debugFollowMouse?: boolean;
    };

    export type ZBehavior = 'noop' | 'threequarters';

    // To add a new hook, simply add an entry here and call WorldObject.hookManager.executeHooks() at the appropriate location(s).
    export type Hooks<WO extends WorldObject> = {
        onAdd: { params: (this: WO) => void };
        onRemove: { params: (this: WO) => void };
        onPreUpdate: { params: (this: WO) => void };
        onUpdate: { params: (this: WO) => void };
        onVisualUpdate: { params: (this: WO) => void };
        onPostUpdate: { params: (this: WO) => void };
        onRender: { params: (this: WO) => Render.Result };
        onKill: { params: (this: WO) => void };
    }
}

class WorldObject {
    localx: number;
    localy: number;
    localz: number;
    activeOutsideWorldBoundsBuffer: number;
    life: WorldObject.LifeTimer;
    zBehavior?: WorldObject.ZBehavior;
    timeScale: number;
    useGlobalTime: boolean;
    data: any;

    ignoreCamera: boolean;
    copyFromParent: string[];

    get x() { return this.localx + (this.parent ? this.parent.x : 0); }
    get y() { return this.localy + (this.parent ? this.parent.y : 0); }
    get z() { return this.localz + (this.parent ? this.parent.z : 0); }
    set x(value: number) { this.localx = value - (this.parent ? this.parent.x : 0); }
    set y(value: number) { this.localy = value - (this.parent ? this.parent.y : 0); }
    set z(value: number) { this.localz = value - (this.parent ? this.parent.z : 0); }

    private _v: Vector2;
    get v() { return this._v; }
    set v(value: Vector2) {
        this._v.x = value.x;
        this._v.y = value.y;
    }
    vz: number;

    private _visible: boolean;
    private _active: boolean;

    name?: string;
    tags: string[];

    // World data
    private _world?: World;
    private _layer?: string;
    private _physicsGroup?: string;
    private _children: WorldObject[];
    private _parent?: WorldObject;

    protected animationManager: AnimationManager;

    get world() { return this._world; }
    get layer() {
        this.resolveLayer();
        return this._layer;
    }
    get physicsGroup() {
        this.resolvePhysicsGroup();
        return this._physicsGroup;
    }
    get children() { return this._children; }
    get parent() { return this._parent; }

    set layer(value: string | undefined) { World.Actions.setLayer(this, value); }
    set physicsGroup(value: string | undefined) { World.Actions.setPhysicsGroup(this, value); }
    //

    get delta() { return ((this.useGlobalTime || !this.world) ? global.game.delta : this.world.delta) * this.timeScale;}

    startOfThisFrameX: number;
    startOfThisFrameY: number;
    startOfThisFrameZ: number;
    startOfLastFrameX: number;
    startOfLastFrameY: number;
    startOfLastFrameZ: number;
    get movedThisFrameX() { return this.x - this.startOfThisFrameX; }
    get movedThisFrameY() { return this.y - this.startOfThisFrameY; }
    get movedThisFrameZ() { return this.z - this.startOfThisFrameZ; }
    get movedLastFrameX() { return this.startOfThisFrameX - this.startOfLastFrameX; }
    get movedLastFrameY() { return this.startOfThisFrameY - this.startOfLastFrameY; }
    get movedLastFrameZ() { return this.startOfThisFrameZ - this.startOfLastFrameZ; }

    _isInsideWorldBoundsBufferThisFrame: boolean;

    controller: Controller;

    behavior: Behavior;

    modules: Module<WorldObject>[];

    protected timers: Timer[];

    readonly uid: string;

    protected scriptManager: ScriptManager;
    stateMachine: SimpleStateMachine;
    get state() { return this.stateMachine.getCurrentStateName(); }

    protected hookManager: HookManager<WorldObject.Hooks<this>>;

    debugFollowMouse: boolean;

    constructor(config: WorldObject.Config<WorldObject> = {}) {
        this.localx = config.x ?? (config.p ? config.p.x : 0);
        this.localy = config.y ?? (config.p ? config.p.y : 0);
        this.localz = config.z ?? 0;

        this._v = config.v ? vec2(config.v.x, config.v.y) : vec2(config.vx ?? 0, config.vy ?? 0);
        this.vz = config.vz ?? 0;

        this.activeOutsideWorldBoundsBuffer = config.activeOutsideWorldBoundsBuffer ?? Infinity;
        this.life = new WorldObject.LifeTimer(config.life ?? Infinity, () => this.kill());
        this.zBehavior = config.zBehavior;
        this.timeScale = config.timeScale ?? 1;
        this.useGlobalTime = config.useGlobalTime ?? false;
        this.data = config.data ? O.deepClone(config.data) : {};

        this._visible = config.visible ?? true;
        this._active = config.active ?? true;

        this.animationManager = new AnimationManager(this, config.animations, config.defaultAnimation);

        this.ignoreCamera = config.ignoreCamera ?? false;
        this.copyFromParent = config.copyFromParent ? A.clone(config.copyFromParent) : [];

        this.name = config.name;
        this.tags = config.tags ? A.clone(config.tags) : [];

        this.startOfThisFrameX = this.x;
        this.startOfThisFrameY = this.y;
        this.startOfThisFrameZ = this.z;
        this.startOfLastFrameX = this.x;
        this.startOfLastFrameY = this.y;
        this.startOfLastFrameZ = this.z;

        this._isInsideWorldBoundsBufferThisFrame = false;

        this.controller = new Controller();
        this.behavior = new NullBehavior();

        this.modules = [];

        this.timers = config.timers ? A.clone(config.timers) : [];

        this.uid = WorldObject.UID.generate();

        this._world = undefined;
        this._children = [];
        this._parent = undefined;

        this.zinternal_setLayerWorldObject(config.layer);
        this.zinternal_setPhysicsGroupWorldObject(config.physicsGroup);

        this.scriptManager = new ScriptManager();
        this.stateMachine = new SimpleStateMachine();

        this.hookManager = new HookManager({
            binder: fn => fn.bind(this),
            hooks: config.hooks,
        });

        this.debugFollowMouse = config.debugFollowMouse ?? false;
    }

    onAdd() {
        this.hookManager.executeHooks('onAdd');
    }

    onRemove() {
        this.hookManager.executeHooks('onRemove');
    }

    preUpdate() {
        this.startOfLastFrameX = this.startOfThisFrameX;
        this.startOfLastFrameY = this.startOfThisFrameY;
        this.startOfLastFrameZ = this.startOfThisFrameZ;
        this.startOfThisFrameX = this.x;
        this.startOfThisFrameY = this.y;
        this.startOfThisFrameZ = this.z;
        this.behavior.update(this.delta);
        this.updateController();
        this.hookManager.executeHooks('onPreUpdate');
    }

    update() {
        this.applyVelocity();

        this.scriptManager.update(this.delta);
        this.stateMachine.update(this.delta);

        if (this.debugFollowMouse) {
            if (this.world) {
                this.x = this.world.getWorldMouseX();
                this.y = this.world.getWorldMouseY();
            }
        }
        this.hookManager.executeHooks('onUpdate');

        for (let module of this.modules) {
            module.update();
        }

        for (let timer of this.timers) {
            timer.update(this.delta);
        }

        this.life.update(this.delta);
        this.animationManager.update(this.delta);
    }

    visualUpdate() {
        this.hookManager.executeHooks('onVisualUpdate');
    }

    postUpdate() {
        this.controller.reset();

        this.hookManager.executeHooks('onPostUpdate');

        this.resolveCopyFromParent();

        if (!isFinite(this.v.x) || !isFinite(this.v.y)) {
            console.error(`Non-finite velocity ${this.v} on object`, this);
            if (!isFinite(this.v.x)) this.v.x = 0;
            if (!isFinite(this.v.y)) this.v.y = 0;
        }
    }

    fullUpdate() {
        this.preUpdate();
        this.update();
        this.visualUpdate();
        this.postUpdate();
    }

    getRenderScreenX() {
        let result: number;

        if (this.parent) {
            result = this.parent.getRenderScreenX();
        } else {
            let worldOffsetX = this.world ? this.world.camera.worldOffsetX : 0;
            result = this.shouldIgnoreCamera() ? 0 : -M.roundToNearest(worldOffsetX, 1 / global.upscale);
        }

        result += M.roundToNearest(this.localx, 1 / global.upscale);

        return result;
    }

    getRenderScreenY() {
        let result: number;

        if (this.parent) {
            result = this.parent.getRenderScreenY();
        } else {
            let worldOffsetY = this.world ? this.world.camera.worldOffsetY : 0;
            result = this.shouldIgnoreCamera() ? 0 : -M.roundToNearest(worldOffsetY, 1 / global.upscale);
        }

        result += M.roundToNearest(this.localy, 1 / global.upscale);

        if (this.getZBehavior() === 'threequarters') {
            let parentz = this.parent ? this.parent.z : 0;
            result += parentz - this.z;
        }

        return result;
    }

    render(): Render.Result {
        let result: Render.Result = FrameCache.array();

        for (let module of this.modules) {
            result.pushAll(module.render());
        }

        let renderedHooks = this.hookManager.executeHooksWithReturnValue$('onRender');
        for (let renderedHook of renderedHooks) {
            result.pushAll(renderedHook);
        }

        return result;
    }

    addAnimation(name: string, animation: AnimationInstance) {
        this.animationManager.addAnimation(name, animation);
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

    addHook<T extends keyof WorldObject.Hooks<this>>(name: T, fn: WorldObject.Hooks<this>[T]['params']) {
        return this.hookManager.addHook(name, fn);
    }

    addModule<T extends Module<WorldObject>>(module: T): T {
        this.modules.push(module);
        module.init(this);
        return module;
    }

    addTag(tag: string) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }

    addTimer(durationOrTimer: number | Timer, callback?: () => any, count: number = 1) {
        if (M.isNumber(durationOrTimer)) {
            durationOrTimer = new Timer(durationOrTimer, callback, count);
        }
        this.timers.push(durationOrTimer);
        return durationOrTimer;
    }

    detachAllChildren(): WorldObject[] {
        return this.detachChildren(this.children);
    }

    detachChild<T extends WorldObject>(child: T): T {
        if (!child) return child;
        if (child.parent !== this) {
            console.error(`Cannot detach child ${child.name} from parent ${this.name} because no such relationship exists`);
            return child;
        }
        return World.Actions.detachChildFromParent(child);
    }

    detachChildKeepWorldPosition<T extends WorldObject>(child: T): T {
        let x = child.x;
        let y = child.y;
        let z = child.z;
        let result = this.detachChild(child);
        child.x = x;
        child.y = y;
        child.z = z;
        return result;
    }

    detachChildren<T extends WorldObject>(children: ReadonlyArray<T>): T[] {
        if (A.isEmpty(children)) return [];
        return children.map(child => this.detachChild(child)).filter(child => child);
    }

    detachFromParent(): this {
        if (!this.parent) return this;
        return this.parent.detachChild(this);
    }

    detachFromParentKeepWorldPosition(): this {
        let x = this.x;
        let y = this.y;
        let z = this.z;
        let result = this.detachFromParent();
        this.x = x;
        this.y = y;
        this.z = z;
        return result;
    }

    doAfterTime(time: number, callback: Function) {
        this.runScript(function*() {
            yield S.wait(time);
            callback();
        });
    }

    emitEvent(event: string, data: any = {}) {
        this.world?.emitEventWorldObject(this, event, data);
    }

    everyNFrames(n: number) {
        return this.life.everyNFrames(n);
    }

    everyNSeconds(n: number) {
        return this.life.everyNSeconds(n);
    }

    getCurrentAnimationName() {
        return this.animationManager.getCurrentAnimationName();
    }

    getChildByIndex<T extends WorldObject>(index: number) {
        if (this.children.length < index) {
            console.error(`Parent has no child at index ${index}:`, this);
            return undefined;
        }
        return <T>this.children[index];
    }

    getChildByName<T extends WorldObject>(name: string): T | undefined {
        for (let child of this.children) {
            if (child.name === name) return <T>child;
        }
        console.error(`Cannot find child named ${name} on parent:`, this);
        return undefined;
    }

    getModule<T extends Module<WorldObject>>(type: new (...args: any[]) => T): T | undefined {
        for (let module of this.modules) {
            if (module instanceof type) return module;
        }
        return undefined;
    }

    getPosition$() {
        return FrameCache.vec2(this.x, this.y);
    }

    getSpeed() {
        return this.v.magnitude;
    }

    getTimers() {
        return A.clone(this.timers);
    }

    /**
     * Gets the visible bounds in local space.
     * @returns A bounding Rectangle or undefined if the bounds are infinite or have not been defined.
     */
    getVisibleLocalBounds$(): Rectangle | undefined {
        return undefined;
    }

    /**
     * Gets the visible bounds in screen space.
     * @returns A bounding Rectangle or undefined if the bounds are infinite or have not been defined.
     */
    getVisibleScreenBounds$(): Rectangle | undefined {
        let localBounds = this.getVisibleLocalBounds$();
        if (!localBounds) return undefined;
        localBounds.x += this.getRenderScreenX();
        localBounds.y += this.getRenderScreenY();
        return localBounds;
    }

    /**
     * Gets the visible bounds in world space.
     * @returns A bounding Rectangle or undefined if the bounds are infinite or have not been defined.
     */
    getVisibleWorldBounds$(): Rectangle | undefined {
        let localBounds = this.getVisibleLocalBounds$();
        if (!localBounds) return undefined;
        localBounds.x += this.x;
        localBounds.y += this.y;
        if (this.getZBehavior() === 'threequarters') {
            localBounds.y -= this.z;
        }
        return localBounds;
    }

    getZBehavior(): WorldObject.ZBehavior {
        if (this.zBehavior) return this.zBehavior;
        if (this.world) return this.world.defaultZBehavior;
        return 'noop';
    }

    hasAnimation(name: string) {
        return this.animationManager.hasAnimation(name);
    }

    hasTag(tag: string) {
        return this.tags.includes(tag);
    }

    isActive(): boolean {
        return this._active && (!this.parent || this.parent.isActive());
    }

    isControlRevoked() {
        return global.theater?.isCutscenePlaying;
    }

    isOnScreen(buffer: number = 0) {
        if (!this.world) return false;
        let bounds = this.getVisibleScreenBounds$();
        if (!bounds) return true;
        return bounds.x + bounds.width >= -buffer
            && bounds.x <= this.world.getScreenWidth() + buffer
            && bounds.y + bounds.height >= -buffer
            && bounds.y <= this.world.getScreenHeight() + buffer;
    }

    isVisible(): boolean {
        return this._visible && (!this.parent || this.parent.isVisible());
    }

    kill() {
        this.world?.runAtEndOfFrame(() => this.removeFromWorld());
        this.hookManager.executeHooks('onKill');
    }

    listenForEventWorld(event: string | string[], onEvent: (event: WorldEvent.WorldEvent) => void) {
        return this.world?.registerListener({
            fromSources: [{ type: 'world' }],
            events: A.isArray(event) ? event : [event],
            onEvent,
            shouldPrune: () => !this.world,
        });
    }

    listenForEventWorldObject(worldObject: WorldEvent.ListenerWorldObjectSource | (WorldEvent.ListenerWorldObjectSource)[], event: string | string[], onEvent: (event: WorldEvent.WorldObjectEvent) => void) {
        return this.world?.registerListener({
            fromSources: A.isArray(worldObject)
                ? worldObject.map(obj => ({ type: 'worldobject', worldObject: obj }))
                : [{ type: 'worldobject', worldObject }],
            events: A.isArray(event) ? event : [event],
            onEvent,
            shouldPrune: () => !this.world,
        });
    }

    oscillateNFrames(n: number) {
        return this.life.oscillateNFrames(n);
    }

    oscillateNSeconds(n: number) {
        return this.life.oscillateNSeconds(n);
    }

    playAnimation(name: string, force: boolean | 'force' = false) {
        this.animationManager.playAnimation(name, force);
    }

    removeFromWorld(): this {
        if (!this.world) return this;
        return World.Actions.removeWorldObjectFromWorld(this);
    }

    removeHook(hook: Hook) {
        this.hookManager.removeHook(hook);
    }

    removeTag(tag: string) {
        A.removeAll(this.tags, tag);
    }

    runScript(script: Script | Script.Function, name?: string, stopPrevious?: 'stopPrevious') {
        return this.scriptManager.runScript(script, name, stopPrevious);
    }

    setActive(active: boolean) {
        this._active = active;
    }

    setIsInsideWorldBoundsBufferThisFrame() {
        this._isInsideWorldBoundsBufferThisFrame = isFinite(this.activeOutsideWorldBoundsBuffer)
                    ? this.isOnScreen(this.activeOutsideWorldBoundsBuffer)
                    : true;
    }

    setSpeed(speed: number) {
        this.v.setMagnitude(speed);
    }

    setState(state: string) {
        this.stateMachine.setState(state);
    }

    setVisible(visible: boolean) {
        this._visible = visible;
    }

    stopScriptByName(name: string) {
        this.scriptManager.stopScriptByName(name);
    }

    teleport(x: Pt | number, y?: number) {
        if (!M.isNumber(x)) {
            y = x.y;
            x = x.x;
        }
        this.x = x;
        this.y = y ?? x;
        this.startOfThisFrameX = x;
        this.startOfThisFrameY = y ?? x;
    }

    private applyVelocity() {
        this.localx += this.v.x * this.delta;
        this.localy += this.v.y * this.delta;
        this.localz += this.vz * this.delta;
    }

    private resolveLayer() {
        if (this.copyFromParent.includes('layer') && this.parent && this._layer !== this.parent.layer) {
            this.layer = this.parent.layer;
        }
    }

    private resolvePhysicsGroup() {
        if (this.copyFromParent.includes('physicsGroup') && this.parent && this._physicsGroup !== this.parent.physicsGroup) {
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

    private shouldIgnoreCamera(): boolean {
        if (this.ignoreCamera) return true;
        if (this.parent) return this.parent.shouldIgnoreCamera();
        return false;
    }

    private updateController() {
        if (this.isControlRevoked()) return;
        this.controller.updateFromBehavior(this.behavior);
    }

    // For use with World.Actions.addWorldObjectToWorld
    zinternal_addWorldObjectToWorldWorldObject(world: World) {
        this._world = world;
        if (!this._layer) this._layer = World.DEFAULT_LAYER;
    }

    // For use with World.Actions.removeWorldObjectFromWorld
    zinternal_removeWorldObjectFromWorldWorldObject(world: World) {
        this._world = undefined;
    }

    // For use with World.Actions.setLayer
    zinternal_setLayerWorldObject(layer: string | undefined) {
        this._layer = layer;
    }

    // For use with World.Actions.setPhysicsGroup
    zinternal_setPhysicsGroupWorldObject(physicsGroup: string | undefined) {
        this._physicsGroup = physicsGroup;
    }

    // For use with World.Actions.addChildToParent
    zinternal_addChildToParentWorldObjectChild(parent: WorldObject) {
        this._parent = parent;
    }

    // For use with World.Actions.addChildToParent
    zinternal_addChildToParentWorldObjectParent(child: WorldObject) {
        this._children.push(child);
    }

    // For use with World.Actions.removeChildFromParent
    zinternal_removeChildFromParentWorldObjectChild() {
        this._parent = undefined;
    }

    // For use with World.Actions.removeChildFromParent
    zinternal_removeChildFromParentWorldObjectParent(child: WorldObject) {
        A.removeAll(this._children, child);
    }
}

namespace WorldObject {
    export const UID = new UIDGenerator();

    export class LifeTimer extends Timer {
        frames: number;
        history: number[];

        constructor(life: number, onFinish: () => void) {
            super(life, onFinish);
            this.frames = 0;
            this.history = [];
        }

        override update(delta: number): void {
            super.update(delta);
            this.frames++;
            this.history.push(this.time);
            if (this.history.length > 100) {
                this.history.splice(0, this.history.length-100);
            }
        }
        
        override reset(): void {
            super.reset();
            this.frames = 0;
            this.history = [];
        }

        everyNFrames(n: number) {
            return M.everyNInt(n, this.frames);
        }
    
        everyNSeconds(n: number) {
            let lastTime = this.getLastTime();
            return M.everyNFloat(n, this.time, this.time - lastTime);
        }

        oscillateNFrames(n: number) {
            return M.oscillateN(n, this.frames);
        }
    
        oscillateNSeconds(n: number) {
            return M.oscillateN(n, this.time);
        }

        private getLastTime() {
            if (A.isEmpty(this.history)) return this.time;
            if (this.history.length === 1) return this.history[0];
            if (this.history.last() !== this.time) return this.history.last()!;
            return this.history[this.history.length-2];
        }
    }
}