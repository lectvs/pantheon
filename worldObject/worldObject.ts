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
        hooks?: WorldObject.HooksConfig<WO>;
        data?: any;
    };

    export type ZBehavior = 'noop' | 'threequarters';
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

    alive: boolean;

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
    get children() { return <ReadonlyArray<WorldObject>>this._children; }
    get parent() { return this._parent; }

    set layer(value: string | undefined) { World.Actions.setLayer(this, value); }
    set physicsGroup(value: string | undefined) { World.Actions.setPhysicsGroup(this, value); }
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

    protected hookManager: WorldObjectHookManager;

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

        this.animationManager = new AnimationManager(this);
        if (!O.isEmpty(config.animations)) {
            for (let animationName in config.animations) {
                this.addAnimation(animationName, config.animations[animationName]);
            }
        }
        if ('defaultAnimation' in config) {
            if (config.defaultAnimation) this.playAnimation(config.defaultAnimation);
        } else if (O.size(config.animations) === 1) {
            this.playAnimation(Object.keys(config.animations!)[0]);
        } else if (!O.isEmpty(config.animations)) {
            if ('default' in config.animations) this.playAnimation('default');
            else if ('idle' in config.animations) this.playAnimation('idle');
        }

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

        this._world = undefined;
        this._children = [];
        this._parent = undefined;

        this.zinternal_setLayerWorldObject(config.layer);
        this.zinternal_setPhysicsGroupWorldObject(config.physicsGroup);

        this.scriptManager = new ScriptManager();
        this.stateMachine = new StateMachine();

        this.hookManager = new WorldObjectHookManager();
        if (config.hooks) {
            for (let key in config.hooks) {
                let hookName = key as WorldObject.HookName;
                let hooks = config.hooks[hookName];
                if (A.isArray(hooks)) {
                    for (let hook of hooks) {
                        this.addHook(hookName, hook);
                    }
                } else {
                    this.addHook(hookName, hooks as any);
                }
            }
        }

        this.debugFollowMouse = false;
    }

    onAdd() {
        this.hookManager.executeHooks('onAdd');
    }

    onRemove() {
        this.hookManager.executeHooks('onRemove');
    }

    preUpdate() {
        this.lastx = this.x;
        this.lasty = this.y;
        this.lastz = this.z;
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

        if (this.parent && this.ignoreCamera) {
            debug(`Warning: ignoreCamera is set to true on a child object. This will be ignored!`);
        }
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
            result = this.shouldIgnoreCamera() ? 0 : -Math.round(worldOffsetX);
        }

        result += Math.round(this.localx);

        return result;
    }

    getRenderScreenY() {
        let result: number;

        if (this.parent) {
            result = this.parent.getRenderScreenY();
        } else {
            let worldOffsetY = this.world ? this.world.camera.worldOffsetY : 0;
            result = this.shouldIgnoreCamera() ? 0 : -Math.round(worldOffsetY);
        }

        result += Math.round(this.localy);

        if (this.getZBehavior() === 'threequarters') {
            let parentz = this.parent ? this.parent.z : 0;
            result += parentz - this.z;
        }

        return result;
    }

    render(texture: Texture, x: number, y: number) {
        this.hookManager.executeHooks('onRender', texture, x, y);

        for (let module of this.modules) {
            module.render(texture, x, y);
        }
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

    addHook<T extends WorldObject.HookName>(name: T, fn: WorldObject.Hooks<WorldObject>[T]['params']) {
        let hookFn = fn.bind(this);
        this.hookManager.addHook(name, hookFn);
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

    detachAllChildren<T extends WorldObject>(): T[] {
        return this.detachChildren(<ReadonlyArray<T>>this.children);
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

    everyNFrames(n: number) {
        return Math.floor((this.life.frames + 1)/n) !== Math.floor(this.life.frames/n);
    }

    everyNSeconds(n: number) {
        return Math.floor((this.life.time + this.delta)/n) !== Math.floor(this.life.time/n);
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

    getPosition() {
        return vec2(this.x, this.y);
    }

    getSpeed() {
        return this.v.magnitude;
    }

    getTimers() {
        return A.clone(this.timers);
    }

    getVisibleScreenBounds(): Rect | undefined {
        return undefined;
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

    playAnimation(name: string, force: boolean | 'force' = false) {
        this.animationManager.playAnimation(name, force);
    }

    removeFromWorld(): this {
        if (!this.world) return this;
        return World.Actions.removeWorldObjectFromWorld(this);
    }

    removeHook(hook: WorldObject.Hook) {
        this.hookManager.removeHook(hook);
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

    setSpeed(speed: number) {
        this.v.setMagnitude(speed);
    }

    setState(state: string) {
        this.stateMachine.setState(state);
    }

    setVisible(visible: boolean) {
        this._visible = visible;
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

        constructor(life: number, onFinish: () => void) {
            super(life, onFinish);
            this.frames = 0;
        }

        override update(delta: number): void {
            super.update(delta);
            this.frames++;
        }
    }
}