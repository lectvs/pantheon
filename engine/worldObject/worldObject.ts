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
        tint?: number;
        alpha?: number;
        life?: number;
        timers?: Timer[];
        ignoreCamera?: boolean;
        copyFromParent?: string[];
        orderByParent?: OrderByParent;
        zBehavior?: ZBehavior;
        sound?: SoundManager.Config;
        timeScale?: number;
        useGlobalTime?: boolean;
        mask?: Mask.Config;
        inputLevel?: number;
        tags?: string[];
        hooks?: HooksConfig<Hooks<WO>>;
        data?: any;

        debugFollowMouse?: boolean;
    };

    export type OrderByParent = 'before' | 'after' | undefined;
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
        onLifeExpire: { params: (this: WO) => void };
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
    orderByParent: WorldObject.OrderByParent;

    get x() { return this.localx + (this.parent ? this.parent.x : 0); }
    get y() { return this.localy + (this.parent ? this.parent.y : 0); }
    get z() { return this.localz + (this.parent ? this.parent.z : 0); }
    set x(value: number) { this.localx = value - (this.parent ? this.parent.x : 0); }
    set y(value: number) { this.localy = value - (this.parent ? this.parent.y : 0); }
    set z(value: number) { this.localz = value - (this.parent ? this.parent.z : 0); }

    startX: number;
    startY: number;
    startZ: number;

    private _v: Vector2;
    get v() { return this._v; }
    set v(value: Vector2) {
        this._v.x = value.x;
        this._v.y = value.y;
    }
    vz: number;

    private _visible: boolean;
    private _active: boolean;

    tags: string[];
    tint: number;
    alpha: number;

    // World data
    private _world?: World;
    private _name?: string;
    private _layer?: string;
    private _physicsGroup?: string;
    private _children: WorldObject[];
    readonly parent?: WorldObject;

    protected animationManager: AnimationManager;

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
    get children() { return this._children; }

    set name(value: string | undefined) { World.Actions.setName(this, value); }
    set layer(value: string | undefined) { World.Actions.setLayer(this, value); }
    set physicsGroup(value: string | undefined) { World.Actions.setPhysicsGroup(this, value); }
    //

    get worldd() {
        if (!this._world) {
            console.error('Access to WorldObject worldd with no world:', this);
            return new World({ name: 'WorldObject.worldd' });
        }
        return this._world;
    };

    delta: number;
    private lastFrameDelta: number;

    startOfThisFrameX: number;
    startOfThisFrameY: number;
    startOfThisFrameZ: number;
    startOfLastFrameX: number;
    startOfLastFrameY: number;
    startOfLastFrameZ: number;
    get movedThisFrameX() { return this.x - this.startOfThisFrameX; }
    get movedThisFrameY() { return this.y - this.startOfThisFrameY; }
    get movedThisFrameZ() { return this.z - this.startOfThisFrameZ; }
    get movedThisFrameAngle() { return M.angle(this.movedThisFrameX, this.movedThisFrameY); }
    get movedThisFrameDistance() { return M.magnitude(this.movedThisFrameX, this.movedThisFrameY); }
    get movedThisFrameSpeed() { return this.delta === 0 ? 0 : this.movedThisFrameDistance / this.delta; }
    get movedLastFrameX() { return this.startOfThisFrameX - this.startOfLastFrameX; }
    get movedLastFrameY() { return this.startOfThisFrameY - this.startOfLastFrameY; }
    get movedLastFrameZ() { return this.startOfThisFrameZ - this.startOfLastFrameZ; }
    get movedLastFrameAngle() { return M.angle(this.movedLastFrameX, this.movedLastFrameY); }
    get movedLastFrameDistance() { return M.magnitude(this.movedLastFrameX, this.movedLastFrameY); }
    get movedLastFrameSpeed() { return this.lastFrameDelta === 0 ? 0 : this.movedLastFrameDistance / this.lastFrameDelta; }

    _isInsideWorldBoundsBufferThisFrame: boolean;

    mask: Mask.Config | undefined;
    private maskSprite: PIXI.Sprite | undefined;

    controller: Controller;
    behavior: Behavior;

    private _inputLevel: number;

    modules: Module<WorldObject>[];

    protected timers: Timer[];

    readonly uid: string;

    protected scriptManager: ScriptManager;
    protected preScriptManager: ScriptManager;
    stateMachine: SimpleStateMachine;
    get state() { return this.stateMachine.getCurrentStateName(); }

    protected soundManager: SoundManager;
    protected hookManager: HookManager<WorldObject.Hooks<this>>;

    debugFollowMouse: boolean;

    constructor(config: WorldObject.Config<WorldObject> = {}) {
        this.localx = config.x ?? (config.p ? config.p.x : 0);
        this.localy = config.y ?? (config.p ? config.p.y : 0);
        this.localz = config.z ?? 0;

        this.startX = this.localx;
        this.startY = this.localy;
        this.startZ = this.localz;

        this._v = config.v ? vec2(config.v.x, config.v.y) : vec2(config.vx ?? 0, config.vy ?? 0);
        this.vz = config.vz ?? 0;

        this.activeOutsideWorldBoundsBuffer = config.activeOutsideWorldBoundsBuffer ?? Infinity;
        this.life = new WorldObject.LifeTimer(config.life ?? Infinity, () => this.lifeExpired());
        this.zBehavior = config.zBehavior;
        this.timeScale = config.timeScale ?? 1;
        this.useGlobalTime = config.useGlobalTime ?? false;
        this.data = config.data ? O.deepClone(config.data) : {};
        this.delta = 0.01;
        this.lastFrameDelta = 0.01;

        this._visible = config.visible ?? true;
        this._active = config.active ?? true;

        this.animationManager = new AnimationManager(this, config.animations, config.defaultAnimation);

        this.ignoreCamera = config.ignoreCamera ?? false;
        this.copyFromParent = config.copyFromParent ? A.clone(config.copyFromParent) : [];
        this.orderByParent = config.orderByParent;

        this.name = config.name;
        this.tags = config.tags ? A.clone(config.tags) : [];
        this.tint = config.tint ?? 0xFFFFFF;
        this.alpha = config.alpha ?? 1;

        this.startOfThisFrameX = this.x;
        this.startOfThisFrameY = this.y;
        this.startOfThisFrameZ = this.z;
        this.startOfLastFrameX = this.x;
        this.startOfLastFrameY = this.y;
        this.startOfLastFrameZ = this.z;

        this._isInsideWorldBoundsBufferThisFrame = false;

        this.mask = O.clone(config.mask);

        this.controller = new Controller();
        this.behavior = new NullBehavior();
        this._inputLevel = config.inputLevel ?? 0;

        this.modules = [];

        this.timers = config.timers ? A.clone(config.timers) : [];

        this.uid = WorldObject.UID.generate();

        this._world = undefined;
        this._children = [];

        this.zinternal_setLayerWorldObject(config.layer);
        this.zinternal_setPhysicsGroupWorldObject(config.physicsGroup);

        this.scriptManager = new ScriptManager();
        this.preScriptManager = new ScriptManager();
        this.stateMachine = new SimpleStateMachine();

        this.soundManager = new SoundManager(config.sound ?? {});
        this.hookManager = new HookManager({
            binder: fn => fn.bind(this),
            hooks: config.hooks,
        });

        this.debugFollowMouse = config.debugFollowMouse ?? false;
    }

    onAdd() {
        this.animationManager.start();
        this.hookManager.executeHooks('onAdd');
        for (let module of this.modules) {
            module.onWorldObjectAdd();
        }
        this.startX = this.x;
        this.startY = this.y;
        this.startZ = this.z;
    }

    onRemove() {
        this.hookManager.executeHooks('onRemove');
        for (let module of this.modules) {
            module.onWorldObjectRemove();
        }
    }

    preUpdate() {
        this.delta = ((this.useGlobalTime || !this.world) ? Main.delta : this.world.delta) * this.timeScale;
        this.startOfLastFrameX = this.startOfThisFrameX;
        this.startOfLastFrameY = this.startOfThisFrameY;
        this.startOfLastFrameZ = this.startOfThisFrameZ;
        this.startOfThisFrameX = this.x;
        this.startOfThisFrameY = this.y;
        this.startOfThisFrameZ = this.z;
        this.behavior.update(this.delta);
        this.updateController();
        this.hookManager.executeHooks('onPreUpdate');

        this.preScriptManager.update(this.delta);

        for (let module of this.modules) {
            module.preUpdate();
        }
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

        this.soundManager.volume = (this.world?.volume ?? 1) * global.game.volume * Options.sfxVolume;
        this.soundManager.update(this.delta);
    }

    visualUpdate() {
        this.hookManager.executeHooks('onVisualUpdate');
    }

    postUpdate() {
        this.controller.reset();

        this.hookManager.executeHooks('onPostUpdate');

        for (let module of this.modules) {
            module.postUpdate();
        }

        this.resolveCopyFromParent();
        if (this.parent) {
            if (this.orderByParent === 'before') {
                this.orderBefore(this.parent);
            } else if (this.orderByParent === 'after') {
                this.orderAfter(this.parent);
            }
        }


        if (!isFinite(this.v.x) || !isFinite(this.v.y)) {
            console.error(`Non-finite velocity ${this.v} on object`, this);
            if (!isFinite(this.v.x)) this.v.x = 0;
            if (!isFinite(this.v.y)) this.v.y = 0;
        }

        this.lastFrameDelta = this.delta;
    }

    fullUpdate() {
        this.preUpdate();
        this.update();
        this.visualUpdate();
        this.postUpdate();
    }

    /**
     * Gets the screen-space X of the WorldObject in the world, snapped to the closest 1/upscale.
     * Change with care, this seems to work with all edge cases currently.
     */
    getRenderScreenX() {
        let base: number;
        if (this.parent) {
            base = this.parent.getRenderScreenX();
        } else {
            let worldOffsetX = this.world ? this.world.camera.worldOffsetX : 0;
            base = this.shouldIgnoreCamera() ? 0 : M.roundToNearest(-worldOffsetX, 1/global.upscale);
        }

        let result = M.roundToNearest(base, 1/global.upscale) + M.roundToNearest(this.localx, 1/global.upscale);

        return result;
    }

    /**
     * Gets the screen-space Y of the WorldObject in the world, snapped to the closest 1/upscale.
     * Change with care, this seems to work with all edge cases currently.
     */
    getRenderScreenY() {
        let base: number;
        if (this.parent) {
            base = this.parent.getRenderScreenY();
        } else {
            let worldOffsetY = this.world ? this.world.camera.worldOffsetY : 0;
            base = this.shouldIgnoreCamera() ? 0 : M.roundToNearest(-worldOffsetY, 1/global.upscale);
        }

        let result = base + M.roundToNearest(this.localy, 1/global.upscale);

        if (this.getZBehavior() === 'threequarters') {
            let parentz = this.parent ? this.parent.z : 0;
            result += M.roundToNearest(parentz, 1/global.upscale) - M.roundToNearest(this.z, 1/global.upscale);
        }

        return result;
    }

    render(): Render.Result {
        this.setMaskSpriteProperties();

        let result: Render.Result = FrameCache.array();

        for (let module of this.modules) {
            result.pushAll(module.render());
        }

        let renderedHooks = this.hookManager.executeHooksWithReturnValue$('onRender');
        for (let renderedHook of renderedHooks) {
            result.pushAll(renderedHook);
        }

        let maskSprite = this.getMaskSprite();
        if (maskSprite) {
            result.push(maskSprite);
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

    addHook<T extends keyof WorldObject.Hooks<this>>(name: T, fn: WorldObject.Hooks<this>[T]['params'], config: Hook.Config = {}) {
        return this.hookManager.addHook(name, fn, config);
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

    addTimer(duration: number, callback?: () => any, count?: number): Timer;
    addTimer<T extends Timer>(timer: T, callback?: () => any, count?: number): T;
    addTimer(durationOrTimer: number | Timer, callback?: () => any, count: number = 1) {
        if (M.isNumber(durationOrTimer)) {
            let timer = new Timer(durationOrTimer, callback, count);
            this.timers.push(timer);
            return timer;
        }
        this.timers.push(durationOrTimer);
        return durationOrTimer;
    }

    detachAllChildren(): WorldObject[] {
        return this.detachChildren(this.children);
    }

    detachAllChildrenKeepWorldPosition(): WorldObject[] {
        return this.detachChildrenKeepWorldPosition(this.children);
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

    detachChildrenKeepWorldPosition<T extends WorldObject>(children: ReadonlyArray<T>): T[] {
        if (A.isEmpty(children)) return [];
        return children.map(child => this.detachChildKeepWorldPosition(child)).filter(child => child);
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

    enter(duration: number, initialValues: Actions.EnterInitialValues, easingFn?: Tween.Easing.Function, delay?: number) {
        return Actions.enter(this, duration, initialValues, easingFn, delay);
    }

    everyNFrames(n: number) {
        return this.life.everyNFrames(n);
    }

    everyNSeconds(n: number) {
        return this.life.everyNSeconds(n);
    }

    exit(duration: number, finalValues: Actions.ExitFinalValues, easingFn?: Tween.Easing.Function, delay?: number) {
        return Actions.exit(this, duration, finalValues, easingFn, delay);
    }

    findAncestor(predicate: (obj: WorldObject) => any) {
        let ancestor = this.parent;
        while (ancestor) {
            if (predicate(ancestor)) {
                return ancestor;
            }
            ancestor = ancestor.parent;
        }
        return undefined;
    }

    forceUpdateSelfAndChildren(times: number = 1) {
        for (let i = 0; i < times; i++) {
            this.fullUpdate();
            for (let child of this.children) {
                child.forceUpdateSelfAndChildren();
            }
        }
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

    getChildByName<T extends WorldObject>(name: string, unchecked?: 'unchecked'): T | undefined {
        for (let child of this.children) {
            if (child.name === name) return <T>child;
        }
        if (!unchecked) console.error(`Cannot find child named ${name} on parent:`, this);
        return undefined;
    }

    getChildrenByName$<T extends WorldObject>(name: string): T[] {
        let result: T[] = FrameCache.array();
        for (let child of this.children) {
            if (child.name === name) result.push(<T>child);
        }
        return result;
    }

    getChildByType<T extends WorldObject>(type: new (...args: any[]) => T, unchecked?: 'unchecked'): T | undefined {
        for (let child of this.children) {
            if (child instanceof type) return <T>child;
        }
        if (!unchecked) console.error(`Cannot find child with type ${type.name} on parent:`, this);
        return undefined;
    }

    getChildrenByType$<T extends WorldObject>(type: new (...args: any[]) => T): T[] {
        let result: T[] = FrameCache.array();
        for (let child of this.children) {
            if (child instanceof type) result.push(<T>child);
        }
        return result;
    }

    getInputLevel(): number {
        if (this.parent) {
            return Math.max(this.parent.getInputLevel(), this._inputLevel);
        }
        return this._inputLevel;
    }

    getLocalPosition$() {
        return FrameCache.vec2(this.localx, this.localy);
    }

    getMaskWorldBounds$(): Rectangle | undefined {
        if (!this.mask) return undefined;

        let maskX = 0;
        let maskY = 0;

        if (!this.mask.relativeTo || this.mask.relativeTo === 'worldobject') {
            maskX = this.x + (this.mask.x ?? 0);
            maskY = this.y + (this.mask.y ?? 0);
        } else if (this.mask.relativeTo === 'world') {
            maskX = this.mask.x ?? 0;
            maskY = this.mask.y ?? 0;
        } else {
            assertUnreachable(this.mask.relativeTo);
        }

        return TextureUtils.getTextureLocalBounds$(this.mask.texture,
            maskX,
            maskY,
            this.mask.scaleX ?? 1,
            this.mask.scaleY ?? 1,
            this.mask.angle ?? 0,
            this.mask.textureAnchor,
        );
    }

    getModule<T extends Module<WorldObject>>(type: new (...args: any[]) => T): T | undefined {
        for (let module of this.modules) {
            if (module instanceof type) return module;
        }
        return undefined;
    }

    getSpeed() {
        return this.v.magnitude;
    }

    getTimers() {
        return A.clone(this.timers);
    }

    getTotalTint(): number {
        if (!this.parent) return this.tint;
        return Color.combineTints(this.tint, this.parent.getTotalTint());
    }

    getTotalAlpha(): number {
        if (!this.parent) return this.alpha;
        return this.alpha * this.parent.getTotalAlpha();
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

    getWorldPosition$() {
        return FrameCache.vec2(this.x, this.y);
    }

    getZBehavior(): WorldObject.ZBehavior {
        if (this.zBehavior) return this.zBehavior;
        if (this.world) return this.world.defaultZBehavior;
        return 'noop';
    }

    hasAnimation(name: string) {
        return this.animationManager.hasAnimation(name);
    }

    hasScriptRunning(name: string) {
        return this.scriptManager.hasScriptRunning(name);
    }

    hasTag(tag: string) {
        return this.tags.includes(tag);
    }

    isActive(): boolean {
        return this._active && (!this.parent || this.parent.isActive());
    }

    isAnimationOrVariantPlaying(name: string) {
        return this.animationManager.isAnimationOrVariantPlaying(name);
    }

    isControlRevoked() {
        return !this.world || this.getInputLevel() < this.world.getMaxInputLevel();
    }

    isObscuredBy(other: WorldObject) {
        if (!this.world) return false;
        if (this.world.getRenderOrder(this, other) >= 0) return false;
        let thisBounds = this.getVisibleWorldBounds$();
        let otherBounds = other.getVisibleWorldBounds$();
        if (thisBounds && otherBounds && G.rectContainsRect(otherBounds, thisBounds)) return true;
        return false;
    }

    isObscuring(other: WorldObject) {
        if (!this.world) return false;
        if (this.world.getRenderOrder(this, other) <= 0) return false;
        let thisBounds = this.getVisibleWorldBounds$();
        let otherBounds = other.getVisibleWorldBounds$();
        if (thisBounds && otherBounds && G.rectContainsRect(thisBounds, otherBounds)) return true;
        return false;
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
        if (!this.world) {
            console.error('Tried to listen to worldObject event but world is undefined');
            return {
                onEvent: () => null,
                shouldPrune: () => true,
            };
        }
        return this.world.registerListener({
            fromSources: [{ type: 'world' }],
            events: A.isArray(event) ? event : [event],
            onEvent,
            shouldPrune: () => !this.world,
        });
    }

    listenForEventWorldObject(worldObject: WorldEvent.ListenerWorldObjectSource | (WorldEvent.ListenerWorldObjectSource)[], event: string | string[], onEvent: (event: WorldEvent.WorldObjectEvent) => void): WorldEvent.Listener {
        if (!this.world) {
            console.error('Tried to listen to worldObject event but world is undefined');
            return {
                onEvent: () => null,
                shouldPrune: () => true,
            };
        }
        return this.world.registerListener({
            fromSources: A.isArray(worldObject)
                ? worldObject.map(obj => ({ type: 'worldobject', worldObject: obj }))
                : [{ type: 'worldobject', worldObject }],
            events: A.isArray(event) ? event : [event],
            onEvent,
            isActive: () => this.isActive(),
            shouldPrune: () => !this.world,
        });
    }

    moveTo(x: number, y: number, maxTime: number = 10) {
        return this.runPreScript(S.simul(
            this.moveToX(x, maxTime),
            this.moveToY(y, maxTime),
        ));
    }

    moveToX(x: number, maxTime: number = 10) {
        let worldObject = this;
        return this.runPreScript(function*() {
            let dx = x - worldObject.x;
            if (dx === 0) return;

            let timer = new Timer(maxTime);
            if (dx > 0) {
                while (worldObject.x < x && !timer.isDone) {
                    worldObject.controller.right = true;
                    worldObject.controller.setMoveDirectionByLRUD();
                    timer.update(global.script.delta);
                    yield;
                }
            } else {
                while (worldObject.x > x && !timer.isDone) {
                    worldObject.controller.left = true;
                    worldObject.controller.setMoveDirectionByLRUD();
                    timer.update(global.script.delta);
                    yield;
                }
            }

            worldObject.x = x;
        });
    }

    moveToY(y: number, maxTime: number = 10) {
        let worldObject = this;
        return this.runPreScript(function*() {
            let dy = y - worldObject.y;
            if (dy === 0) return;

            let timer = new Timer(maxTime);
            if (dy > 0) {
                while (worldObject.y < y && !timer.isDone) {
                    worldObject.controller.down = true;
                    worldObject.controller.setMoveDirectionByLRUD();
                    timer.update(global.script.delta);
                    yield;
                }
            } else {
                while (worldObject.y > y && !timer.isDone) {
                    worldObject.controller.up = true;
                    worldObject.controller.setMoveDirectionByLRUD();
                    timer.update(global.script.delta);
                    yield;
                }
            }

            worldObject.y = y;
        });
    }

    moveToD(dx: number, dy: number, maxTime: number = 10) {
        return this.moveTo(this.x + dx, this.y + dy, maxTime);
    }

    moveToDX(dx: number, maxTime: number = 10) {
        return this.moveToX(this.x + dx, maxTime);
    }

    moveToDY(dy: number, maxTime: number = 10) {
        return this.moveToY(this.y + dy, maxTime);
    }

    moveToBack() {
        World.Actions.moveWorldObjectToBack(this);
        return this;
    }

    moveToFront() {
        World.Actions.moveWorldObjectToFront(this);
        return this;
    }

    orderAfter(other: WorldObject) {
        World.Actions.orderWorldObjectAfter(this, other);
        return this;
    }

    orderBefore(other: WorldObject) {
        World.Actions.orderWorldObjectBefore(this, other);
        return this;
    }

    oscillateNFrames(n: number) {
        return this.life.oscillateNFrames(n);
    }

    oscillateNSeconds(n: number) {
        return this.life.oscillateNSeconds(n);
    }

    playAnimation(nameOrRef: string, force: boolean | 'force' = false) {
        this.animationManager.playAnimation(nameOrRef, force);
    }

    playSound(key: string, config?: SoundUtils.PlaySoundConfig) {
        return SoundUtils.playSound(this.soundManager, this.scriptManager, this.worldd.allowSounds, key, config);
    }

    removeFromWorld(): this {
        if (!this.world) return this;
        return World.Actions.removeWorldObjectFromWorld(this);
    }

    removeHook(hook: Hook) {
        this.hookManager.removeHook(hook);
    }

    removeHooks<T extends keyof WorldObject.Hooks<this>>(name: T) {
        this.hookManager.removeHooks(name);
    }

    removeTag(tag: string) {
        A.removeAll(this.tags, tag);
    }

    /**
     * Runs a script that runs during preUpdate.
     */
    runPreScript(script: Script.FunctionLike, name?: string, specialMode?: ScriptManager.SpecialMode) {
        return this.preScriptManager.runScript(script, name, specialMode);
    }

    runScript(script: Script.FunctionLike, name?: string, specialMode?: ScriptManager.SpecialMode) {
        return this.scriptManager.runScript(script, name, specialMode);
    }

    setActive(active: boolean) {
        this._active = active;
    }
    
    setInputLevel(inputLevel: number) {
        this._inputLevel = inputLevel;
    }

    setIsInsideWorldBoundsBufferThisFrame() {
        this._isInsideWorldBoundsBufferThisFrame = isFinite(this.activeOutsideWorldBoundsBuffer)
                    ? this.isOnScreen(this.activeOutsideWorldBoundsBuffer)
                    : true;
    }

    setLife(life: number) {
        this.life.duration = life;
        this.life.reset();
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

    shouldIgnoreCamera(): boolean {
        if (this.ignoreCamera) return true;
        if (this.parent) return this.parent.shouldIgnoreCamera();
        return false;
    }

    stopScriptByName(name: string) {
        this.scriptManager.stopScriptByName(name);
    }

    stopSound(sound: string | Sound, fadeOut: number = 0) {
        return SoundUtils.stopSound(this.soundManager, this.scriptManager, sound, fadeOut)
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

    /**
     * Runs whenever the containing world is unloaded.
     * Note: it IS possible for the world to be re-loaded, so don't do anything permanent.
     */
    unload() {
        // Overridable by children.
    }

    withName(name: string | undefined) {
        this.name = name;
        return this;
    }

    withLayer(layer: string | undefined) {
        this.layer = layer;
        return this;
    }

    withPhysicsGroup(physicsGroup: string | undefined) {
        this.physicsGroup = physicsGroup;
        return this;
    }

    withX(x: number) {
        this.x = x;
        return this;
    }

    withY(y: number) {
        this.y = y;
        return this;
    }

    withZ(z: number) {
        this.z = z;
        return this;
    }

    withPosition(x: number, y: number, z?: number): this;
    withPosition(p: Pt, z?: number): this;
    withPosition(x: number | Pt, y?: number, z?: number) {
        if (typeof x !== 'number') {
            y = x.y;
            x = x.x;
        }
        this.x = x;
        if (y !== undefined) this.y = y;
        if (z !== undefined) this.z = z;
        return this;
    }

    withVx(vx: number) {
        this.v.x = vx;
        return this;
    }

    withVy(vy: number) {
        this.v.y = vy;
        return this;
    }

    withVz(vz: number) {
        this.vz = vz;
        return this;
    }

    withVelocity(vx: number, vy: number, vz?: number): this;
    withVelocity(v: Pt, vz?: number): this;
    withVelocity(vx: number | Pt, vy?: number, vz?: number) {
        if (typeof vx !== 'number') {
            vy = vx.y;
            vx = vx.x;
        }
        this.v.x = vx;
        if (vy !== undefined) this.v.y = vy;
        if (vz !== undefined) this.vz = vz;
        return this;
    }

    withVisible(visible: boolean) {
        this.setVisible(visible);
        return this;
    }

    withActive(active: boolean) {
        this.setActive(active);
        return this;
    }

    withIgnoreCamera(ignoreCamera: boolean) {
        this.ignoreCamera = ignoreCamera;
        return this;
    }

    withTint(tint: number) {
        this.tint = tint;
        return this;
    }

    withAlpha(alpha: number) {
        this.alpha = alpha;
        return this;
    }

    withLife(life: number) {
        this.setLife(life);
        return this;
    }

    withOrderByParent(orderByParent: WorldObject.OrderByParent) {
        this.orderByParent = orderByParent;
        return this;
    }

    withMask(mask: Mask.Config | undefined) {
        this.mask = O.clone(mask);
        return this;
    }

    private applyVelocity() {
        this.localx += this.v.x * this.delta;
        this.localy += this.v.y * this.delta;
        this.localz += this.vz * this.delta;
    }

    protected getMaskSprite() {
        if (!this.mask) {
            this.maskSprite = undefined;
            return undefined;
        }

        if (!this.maskSprite) {
            this.maskSprite = new PIXI.Sprite();
        }
            
        return this.maskSprite;
    }

    private lifeExpired() {
        if (this.hookManager.hasHooks('onLifeExpire')) {
            this.hookManager.executeHooks('onLifeExpire');
        } else {
            this.kill();
        }
    }

    private resolveLayer() {
        let isCopyingLayerFromParent = this.copyFromParent.includes('layer');
        let shouldCopyLayerFromParent = isCopyingLayerFromParent || !this._layer;
        if (shouldCopyLayerFromParent && this.parent && this._layer !== this.parent.layer) {
            if (!isCopyingLayerFromParent && !this._layer) {
                this.copyFromParent.push('layer');
            }
            this.layer = this.parent.layer;
        }
    }

    private resolvePhysicsGroup() {
        let shouldCopyPhysicsGroupFromParent = this.copyFromParent.includes('physicsGroup');
        if (shouldCopyPhysicsGroupFromParent && this.parent && this._physicsGroup !== this.parent.physicsGroup) {
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

    private setMaskSpriteProperties() {
        let maskSprite = this.getMaskSprite();
        if (!this.mask || !maskSprite) return;
        if (!this.mask.relativeTo || this.mask.relativeTo === 'worldobject') {
            maskSprite.x = this.mask.x ?? 0;
            maskSprite.y = this.mask.y ?? 0;
        } else if (this.mask.relativeTo === 'world') {
            maskSprite.x = (this.mask.x ?? 0) - this.x;
            maskSprite.y = (this.mask.y ?? 0) - this.y;
        } else {
            assertUnreachable(this.mask.relativeTo);
        }
        maskSprite.texture = this.mask.texture;
        if (this.mask.textureAnchor) {
            maskSprite.anchor.set(this.mask.textureAnchor.x, this.mask.textureAnchor.y);
        } else {
            maskSprite.anchor.set(this.mask.texture.defaultAnchor.x, this.mask.texture.defaultAnchor.y);
        }
        maskSprite.scale.x = this.mask.scaleX ?? 1;
        maskSprite.scale.y = this.mask.scaleY ?? 1;
        maskSprite.angle = this.mask.angle ?? 0;
    }

    private updateController() {
        if (this.isControlRevoked()) return;
        this.controller.updateFromBehavior(this.behavior);
    }

    // For use with World.Actions.addWorldObjectToWorld
    zinternal_addWorldObjectToWorldWorldObject(world: World) {
        this._world = world;
        this.resolveLayer();
        if (!this._layer) this._layer = World.DEFAULT_LAYER;
    }

    // For use with World.Actions.removeWorldObjectFromWorld
    zinternal_removeWorldObjectFromWorldWorldObject(world: World) {
        this._world = undefined;
    }

    // For use with World.Actions.setName
    zinternal_setNameWorldObject(name: string | undefined) {
        this._name = name;
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
        // @ts-expect-error
        this.parent = parent;
        this.teleport(this.x, this.y);
    }

    // For use with World.Actions.addChildToParent
    zinternal_addChildToParentWorldObjectParent(child: WorldObject) {
        this._children.push(child);
    }

    // For use with World.Actions.removeChildFromParent
    zinternal_removeChildFromParentWorldObjectChild() {
        // @ts-expect-error
        this.parent = undefined;
        this.teleport(this.x, this.y);
    }

    // For use with World.Actions.removeChildFromParent
    zinternal_removeChildFromParentWorldObjectParent(child: WorldObject) {
        A.removeAll(this._children, child);
    }
}

namespace WorldObject {
    export const UID = new UIDGenerator(10_000);

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
        
        override reset() {
            this.frames = 0;
            this.history = [];
            return super.reset();
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