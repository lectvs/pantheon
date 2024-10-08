/// <reference path="../worldObject/sprite/sprite.ts" />
/// <reference path="../worldObject/worldObject.ts" />
/// <reference path="../texture/filter/textureFilter.ts" />

namespace World {
    export type Config<W extends World> = {
        name?: string;
        layers?: World.LayerConfig[];
        effects?: Effects.Config;

        camera?: Camera.Config;

        backgroundColor?: number;
        backgroundAlpha?: number;

        scaleX?: number;
        scaleY?: number;

        physicsGroups?: Dict<World.PhysicsGroupConfig>;
        collisions?: CollisionConfig[];
        collisionIterations?: number;
        useRaycastDisplacementThreshold?: number;
        maxDistancePerCollisionStep?: number;
        minDistanceIgnoreCollisionStepCalculation?: number;
        defaultZBehavior?: WorldObject.ZBehavior;

        sound?: {
            volume?: number;
            humanizeByDefault?: boolean;
            humanizeFactor?: number;
        };

        music?: MusicConfig;

        timescale?: number;
        allowPause?: boolean;
        hooks?: HooksConfig<Hooks<W>>;
        data?: any;
    }

    export type CollisionConfig = {
        move: string;
        from: string;
        callback?: Physics.CollisionCallback;
        collisionMode?: Physics.CollisionMode;
    }

    export type LayerConfig = {
        name: string;
        sort?: {
            /**
             * Sorts each object in the layer by a key. Objects are ordered from lowest key to highest key.
             */
            key: (worldObject: WorldObject) => number;
        } | {
            /**
             * Sorts each object in the layer by a comparator. If worldObject1 is before worldObject2, the comparator should return a negative number.
             */
            comparator: (worldObject1: WorldObject, worldObject2: WorldObject) => number;
        };
        reverseSort?: boolean;
        effects?: Effects.Config;
    }

    export type PhysicsGroupConfig = {
        immovable?: boolean;
    }

    export type PlaySoundConfig = {
        volume?: number;
        speed?: number;
        loop?: boolean | number;
        humanized?: boolean;
        limit?: number;
    }

    export type Screenshot = {
        texture: PIXI.RenderTexture;
        upscale: number;
    }

    export type MusicConfig = {
        action: 'block';
    } | {
        action: 'volumescale';
        volumeScale: number;
    }

    // To add a new hook, simply add an entry here and call World.hookManager.executeHooks() at the appropriate location(s).
    export type Hooks<W extends World> = {
        onTransitioned: { params: (this: W) => void };
        onUpdate: { params: (this: W) => void };
        onWorldObjectAdded: { params: (this: W, worldObject: WorldObject) => void };
        onWorldObjectRemoved: { params: (this: W, worldObject: WorldObject) => void };
    }
}

class World {
    name: string | undefined;

    forcedWidth: number | undefined;
    forcedHeight: number | undefined;

    worldObjects: WorldObject[];
    time: number;
    timeScale: number;
    data: any;

    scaleX: number;
    scaleY: number;

    physicsGroups: Dict<World.PhysicsGroup>;
    collisions: World.CollisionConfig[];
    collisionIterations: number;
    useRaycastDisplacementThreshold: number;
    maxDistancePerCollisionStep: number;
    minDistanceIgnoreCollisionStepCalculation: number;
    defaultZBehavior: WorldObject.ZBehavior;

    layers: World.Layer[];
    effects: Effects;

    get shouldRenderToTexture() {
        return this.effects.hasEffects()
            || !this.camera.screenShakePhysicallyMovesCamera
            || this.scaleX !== 1
            || this.scaleY !== 1;
    }

    backgroundColor: number;
    backgroundAlpha: number;
    fadeColor: number;
    fadeAmount: number;

    camera: Camera;
    private screenShakeFilter: World.ScreenShakeFilter;

    private worldSprite: PIXI.Sprite;
    private layerSprite: PIXI.Sprite;

    private container: PIXI.Container;
    private bgFill: PIXI.Sprite;
    private fadeFill: PIXI.Sprite;

    protected scriptManager: ScriptManager;
    soundManager: SoundManager;

    select: WorldSelecter;
    
    get delta() {
        if (global.currentTheater.isSkippingCutscene) return Theater.SKIP_CUTSCENE_DELTA;
        return global.game.delta * this.timeScale;
    }

    volume: number;
    allowSounds: boolean;
    soundHumanizeByDefault: boolean;
    soundHumanizeFactor: number;

    music: World.MusicConfig;

    allowPause: boolean;

    protected hookManager: HookManager<World.Hooks<this>>;
    protected eventManager: WorldEventManager;
    protected endOfFrameQueue: (() => any)[];
    protected maxInputLevelThisFrame: number;

    private mouseBounds: CircleBounds;

    constructor(config: World.Config<World> = {}) {      
        this.name = config.name;
          
        this.scriptManager = new ScriptManager();
        this.soundManager = new SoundManager();

        this.select = new WorldSelecter(this);

        this.volume = config.sound?.volume ?? 1;
        this.allowSounds = true;
        this.soundHumanizeByDefault = config.sound?.humanizeByDefault ?? false;
        this.soundHumanizeFactor = config.sound?.humanizeFactor ?? 0.1;

        this.music = config.music ? O.clone(config.music) : { action: 'volumescale', volumeScale: 1 };

        this.time = 0;
        this.timeScale = config.timescale ?? 1;
        this.allowPause = config.allowPause ?? true;
        this.data = config.data ? O.deepClone(config.data) : {};

        this.scaleX = config.scaleX ?? 1;
        this.scaleY = config.scaleY ?? 1;

        this.physicsGroups = this.createPhysicsGroups(config.physicsGroups);
        this.collisions = config.collisions ?? [];
        this.collisionIterations = config.collisionIterations ?? 1;
        this.useRaycastDisplacementThreshold = config.useRaycastDisplacementThreshold ?? 1;
        this.maxDistancePerCollisionStep = config.maxDistancePerCollisionStep ?? Infinity;
        this.minDistanceIgnoreCollisionStepCalculation = config.minDistanceIgnoreCollisionStepCalculation ?? Infinity;
        this.defaultZBehavior = config.defaultZBehavior ?? 'noop';

        this.worldObjects = [];
        this.layers = this.createLayers(config.layers);
        this.effects = new Effects(config.effects);

        this.backgroundColor = config.backgroundColor ?? global.backgroundColor;
        this.backgroundAlpha = config.backgroundAlpha ?? 1;
        this.fadeColor = 0x000000;
        this.fadeAmount = 0;

        this.worldSprite = new PIXI.Sprite(newPixiRenderTexture(this.getTargetScreenWidth(), this.getTargetScreenHeight(), 'World.worldTexture'));
        this.layerSprite = new PIXI.Sprite(newPixiRenderTexture(this.getTargetScreenWidth(), this.getTargetScreenHeight(), 'World.layerSprite'));

        this.container = new PIXI.Container();
        this.bgFill = new PIXI.Sprite(Textures.filledRect(1, 1, 0xFFFFFF));
        this.bgFill.scale.set(this.getTargetScreenWidth(), this.getTargetScreenHeight());
        this.fadeFill = new PIXI.Sprite(Textures.filledRect(1, 1, 0xFFFFFF));
        this.fadeFill.scale.set(this.getTargetScreenWidth(), this.getTargetScreenHeight());

        this.camera = new Camera(config.camera ?? {}, this);
        this.screenShakeFilter = new World.ScreenShakeFilter();
        if (!this.camera.screenShakePhysicallyMovesCamera) {
            this.effects.pre.push(this.screenShakeFilter);
        }

        this.mouseBounds = new CircleBounds(0, 0, 0);

        this.hookManager = new HookManager({
            binder: fn => fn.bind(this),
            hooks: config.hooks,
        });
        this.eventManager = new WorldEventManager();
        this.maxInputLevelThisFrame = 0;

        this.endOfFrameQueue = [];
    }

    onTransitioned() {
        this.hookManager.executeHooks('onTransitioned');
    }

    update() {
        this.updateMaxInputLevelThisFrame();
        this.updateScriptManager();

        for (let worldObject of this.worldObjects) {
            worldObject.setIsInsideWorldBoundsBufferThisFrame();
            if (worldObject.isActive() && worldObject._isInsideWorldBoundsBufferThisFrame) {
                worldObject.preUpdate();
            }
        }

        for (let worldObject of this.worldObjects) {
            if (worldObject.isActive() && worldObject._isInsideWorldBoundsBufferThisFrame) {
                worldObject.update();
            }
        }

        this.handleCollisions();

        for (let worldObject of this.worldObjects) {
            if (worldObject.isActive() && worldObject._isInsideWorldBoundsBufferThisFrame) {
                worldObject.visualUpdate();
            }
        }

        for (let worldObject of this.worldObjects) {
            if (worldObject.isActive() && worldObject._isInsideWorldBoundsBufferThisFrame) {
                worldObject.postUpdate();
            }
        }

        this.hookManager.executeHooks('onUpdate');

        this.camera.update();

        for (let layer of this.layers) {
            layer.effects.updateEffects(this.delta);
        }
        this.effects.updateEffects(this.delta);

        this.screenShakeFilter.setShake(this.camera.shakeX, this.camera.shakeY);

        this.soundManager.volume = this.volume * global.game.volume * Options.sfxVolume;
        this.soundManager.update(this.delta);

        this.time += this.delta;

        while (!A.isEmpty(this.endOfFrameQueue)) {
            this.endOfFrameQueue.shift()!();
        }
    }

    protected updateMaxInputLevelThisFrame() {
        if (this.worldObjects.length === 0) {
            this.maxInputLevelThisFrame = 0;
            return;
        }
        this.maxInputLevelThisFrame = M.max(this.worldObjects, obj => obj.inputLevel);
    }

    protected updateScriptManager() {
        this.scriptManager.update(this.delta);
    }

    render() {
        this.handleResize();

        this.bgFill.tint = this.backgroundColor;
        this.bgFill.alpha = this.backgroundAlpha;

        let result: Render.Result = FrameCache.array(this.bgFill);
        
        for (let layer of this.layers) {
            // Push fade right before afterfade layer.
            if (layer.name === World.AFTER_FADE_LAYER) {
                this.fadeFill.tint = this.fadeColor;
                this.fadeFill.alpha = this.fadeAmount;
                if (this.fadeAmount > 0) {
                    result.push(this.fadeFill);
                }
            }

            if (layer.shouldRenderToOwnLayer) {
                let layerTexture = this.layerSprite.texture as PIXI.RenderTexture;
                renderToRenderTexture(this.renderLayer(layer), layerTexture, 'clearTextureFirst');
                this.layerSprite.updateAndSetEffects(layer.effects);
                result.push(this.layerSprite);
            } else {
                result.pushAll(this.renderLayer(layer));
            }
        }

        Render.diff(this.container, result);

        if (this.shouldRenderToTexture) {
            let worldTexture = this.worldSprite.texture as PIXI.RenderTexture;
            renderToRenderTexture(this.container, worldTexture, 'clearTextureFirst');
            this.worldSprite.scale.set(this.scaleX, this.scaleY);
            this.worldSprite.updateAndSetEffects(this.effects);
            return FrameCache.array(this.worldSprite);
        } else {
            return FrameCache.array(this.container);
        }
    }

    renderLayer(layer: World.Layer) {
        layer.sort();

        let result: Render.Result = FrameCache.array();
        for (let worldObject of layer.worldObjects) {
            if (!worldObject.isVisible() || !worldObject.isOnScreen()) continue;
            result.pushAll(Render.shift(worldObject.render(), worldObject.getRenderScreenX(), worldObject.getRenderScreenY()));
        }
        return result;
    }

    addHook<T extends keyof World.Hooks<this>>(name: T, fn: World.Hooks<this>[T]['params'], config: Hook.Config = {}) {
        // Almost all onTransitioned hooks are intended to be run only once.
        if (name === 'onTransitioned' && config.runOnce === undefined) {
            config.runOnce = true;
        }
        return this.hookManager.addHook(name, fn, config);
    }

    addWorldObject<T extends WorldObject>(obj: T): T {
        return World.Actions.addWorldObjectToWorld(obj, this);
    }
    
    addWorldObjects<T extends WorldObject>(objs: T[]): T[] {
        return World.Actions.addWorldObjectsToWorld(objs, this);
    }

    emitEventWorld(event: string, data: any = {}) {
        this.eventManager.emitEvent({
            source: {
                type: 'world',
            },
            event,
            data,
        });
    }

    emitEventWorldObject(worldObject: WorldObject, event: string, data: any = {}) {
        this.eventManager.emitEvent({
            source: {
                type: 'worldobject',
                worldObject,
            },
            event,
            data,
        });
    }

    fadeIn(duration: number, color: number = 0x000000, fromAmount: number = this.fadeAmount) {
        this.fadeColor = color;
        this.fadeAmount = fromAmount;
        return this.runScript(S.tween(duration, this, 'fadeAmount', fromAmount, 0), 'World.fade', 'stopPrevious');
    }

    fadeOut(duration: number, color: number = 0x000000, amount: number = 1) {
        this.fadeColor = color;
        return this.runScript(S.tween(duration, this, 'fadeAmount', 0, amount), 'World.fade', 'stopPrevious');
    }

    getLayerByName(name: string | undefined) {
        if (!name) name = World.DEFAULT_LAYER;
        for (let layer of this.layers) {
            if (layer.name === name) return layer;
        }
        return undefined;
    }

    getMaxInputLevel(): number {
        if (global.theater.isCutscenePlaying()) return Infinity;
        return this.maxInputLevelThisFrame;
    }

    getPhysicsGroupByName(name: string | undefined) {
        if (!name) return undefined;
        return this.physicsGroups[name];
    }

    getPhysicsGroupsThatCollideWith$(physicsGroup: string) {
        let result: string[] = FrameCache.array();
        for (let collision of this.collisions) {
            if (collision.move === physicsGroup) {
                result.push(collision.from);
            } else if (collision.from === physicsGroup) {
                result.push(collision.move);
            }
        }
        return A.removeDuplicates(result);
    }

    getScreenWidth() {
        return this.bgFill.width;
    }

    getScreenHeight() {
        return this.bgFill.height;
    }

    getTargetScreenWidth() {
        return global.gameWidth / this.scaleX;
    }

    getTargetScreenHeight() {
        return global.gameHeight / this.scaleY;
    }

    getWorldMouseX() {
        return Math.floor(this.screenXToWorldX(Input.mouseX));
    }

    getWorldMouseY() {
        return Math.floor(this.screenYToWorldY(Input.mouseY));
    }

    getWorldMouseBounds$() {
        this.mouseBounds.x = this.getWorldMouseX();
        this.mouseBounds.y = this.getWorldMouseY();

        let scale = (this.scaleX + this.scaleY)/2;
        this.mouseBounds.radius = Input.mouseRadius / scale;
        
        return this.mouseBounds;
    }

    getWorldMouseSpeed() {
        if (this.delta === 0) return 0;
        let lastMouseX = Math.floor(Input.lastMouseX / this.scaleX + this.camera.worldOffsetX);
        let lastMouseY = Math.floor(Input.lastMouseY / this.scaleY + this.camera.worldOffsetY);
        return M.distance(this.getWorldMouseX(), this.getWorldMouseY(), lastMouseX, lastMouseY) / this.delta;
    }

    handleCollisions() {
        if (A.isEmpty(this.collisions)) return;

        Physics.resolveCollisions(this);
    }

    isBoundsOnScreen(bounds: Bounds, buffer: number = 0) {
        let screenRect = this.camera.getWorldRect$();
        G.expandRectangle(screenRect, buffer);
        return G.areRectanglesOverlapping(bounds.getBoundingBox$(), screenRect);
    }

    isPtOnScreen(pt: Pt, buffer: number = 0) {
        let screenRect = this.camera.getWorldRect$();
        G.expandRectangle(screenRect, buffer);
        return screenRect.contains(pt);
    }

    isRectOnScreen(rect: Rect, buffer: number = 0) {
        let screenRect = this.camera.getWorldRect$();
        G.expandRectangle(screenRect, buffer);
        return G.areRectanglesOverlapping(rect, screenRect);
    }

    /**
     * By default, sounds are:
     *   - Humanized (if set globally and sound duration less than 1 second)
     */
    playSound(key: string, config?: World.PlaySoundConfig) {
        if (global.theater?.isSkippingCutscene || !this.allowSounds) return new Sound(key);
        
        let limit = config?.limit ?? Infinity;

        // Check limit
        if (this.soundManager.getSoundsByKey(key).length >= limit) {
            return new Sound(key);
        }

        let sound = this.soundManager.playSound(key);

        sound.volume = config?.volume ?? 1;
        sound.speed = config?.speed ?? 1;

        let loop = config?.loop ?? false;
        sound.loopsLeft = M.isNumber(loop) ? loop : (loop ? Infinity : 0);

        let humanized = (config?.humanized ?? this.soundHumanizeByDefault) && sound.duration < 1;
        if (humanized && this.soundHumanizeFactor > 0) {
            sound.humanize(this.soundHumanizeFactor);
        }
        return sound;
    }

    registerListener(listener: WorldEvent.Listener) {
        return this.eventManager.registerListener(listener);
    }

    removeHook(hook: Hook) {
        this.hookManager.removeHook(hook);
    }
    
    removeWorldObject<T extends WorldObject>(obj: T | string | undefined): T | undefined {
        if (!obj) return undefined;
        if (St.isString(obj)) {
            obj = this.select.name<T>(obj);
            if (!obj) return undefined;
        }
        if (!obj.world) return undefined;
        if (obj.world !== this) {
            console.error(`Cannot remove object ${obj.name} from world because it does not exist in the world. World:`, this);
            return undefined;
        }
        return World.Actions.removeWorldObjectFromWorld(obj);
    }
    
    removeWorldObjects<T extends WorldObject>(objs: ReadonlyArray<T | string>): T[] {
        if (A.isEmpty(objs)) return [];
        return objs.map(obj => this.removeWorldObject(obj)).filter(obj => obj) as T[];
    }

    runAtEndOfFrame(fn: () => any) {
        this.endOfFrameQueue.push(fn);
    }

    runScript(script: Script.FunctionLike, name?: string, specialMode?: ScriptManager.SpecialMode) {
        return this.scriptManager.runScript(script, name, specialMode);
    }
    
    screenXToWorldX(screenX: number) {
        return screenX / this.scaleX + this.camera.worldOffsetX;
    }

    screenYToWorldY(screenY: number) {
        return screenY / this.scaleY + this.camera.worldOffsetY;
    }

    screenPosToWorldPos$(screenPos: Pt) {
        return FrameCache.vec2(this.screenXToWorldX(screenPos.x), this.screenYToWorldY(screenPos.y));
    }

    setFade(color: number, amount: number) {
        this.fadeColor = color;
        this.fadeAmount = amount;
    }

    shake(intensity: number, time: number) {
        this.runScript(S.shake(this, intensity, time));
    }

    stopScriptByName(name: string) {
        this.scriptManager.stopScriptByName(name);
    }

    takeScreenshot(): World.Screenshot {
        let screen = newPixiRenderTexture(
            this.getScreenWidth() * this.scaleX * global.upscale,
            this.getScreenHeight() * this.scaleY * global.upscale,
            'World.takeSnapshot');
        let container = new PIXI.Container();
        container.scale.set(global.upscale);
        Render.diff(container, this.render());
        Render.upscalePixiObjectProperties(container, 'upscale');
        renderToRenderTexture(container, screen);
        Render.upscalePixiObjectProperties(container, 'downscale');
        return {
            texture: screen,
            upscale: global.upscale,
        };
    }

    transitionCamera(duration: number, toMode: Camera.Mode, toMovement?: Camera.Movement, easingFunction: Tween.Easing.Function = Tween.Easing.OutExp) {
        let camera = this.camera;
        return this.runScript(function*() {
            if (!toMovement) toMovement = camera.movement;

            camera.setModeFree();
            camera.setMovementSnap();

            let startPoint = vec2(camera);

            yield S.doOverTime(duration, t => {
                let toPoint = toMode.getTargetPt(camera);
                camera.x = M.lerp(t, startPoint.x, toPoint.x, easingFunction);
                camera.y = M.lerp(t, startPoint.y, toPoint.y, easingFunction);
                camera.snapPosition();
            });

            camera.setMode(toMode);
            camera.setMovement(toMovement);
        });
    }

    private createLayers(layers: World.LayerConfig[] | undefined) {
        if (A.isEmpty(layers)) layers = [];

        if (!layers.find(layer => layer.name === World.DEFAULT_LAYER)) layers.push({ name: World.DEFAULT_LAYER });
        if (!layers.find(layer => layer.name === World.AFTER_FADE_LAYER)) layers.push({ name: World.AFTER_FADE_LAYER });

        let result: World.Layer[] = [];
        for (let layer of layers) {
            O.defaults(layer, {
                reverseSort: false,
            });
            result.push(new World.Layer(this, layer.name, layer));
        }

        return result;
    }

    private createPhysicsGroups(physicsGroups: Dict<World.PhysicsGroupConfig> | undefined) {
        if (O.isEmpty(physicsGroups)) return {};

        let result: Dict<World.PhysicsGroup> = {};
        for (let name in physicsGroups) {
            result[name] = new World.PhysicsGroup(name, physicsGroups[name]);
        }
        return result;
    }

    private handleResize() {
        this.bgFill.scale.set(this.getTargetScreenWidth(), this.getTargetScreenHeight());
        this.fadeFill.scale.set(this.getTargetScreenWidth(), this.getTargetScreenHeight());

        if (this.shouldRenderToTexture) {
            this.resizeTexture(this.worldSprite.texture, this.getTargetScreenWidth(), this.getTargetScreenHeight());
        }

        for (let layer of this.layers) {
            if (layer.shouldRenderToOwnLayer) {
                this.resizeTexture(layer.sprite.texture, this.getTargetScreenWidth(), this.getTargetScreenHeight());
            }
        }
    }

    private resizeTexture(texture: PIXI.Texture, width: number, height: number) {
        if (texture.width === width && texture.height === height) return;
        (texture as PIXI.RenderTexture).resize(width, height);
    }

    private removeFromAllLayers(obj: WorldObject) {
        for (let layer of this.layers) {
            A.removeAll(layer.worldObjects, obj);
        }
    }

    private removeFromAllPhysicsGroups(obj: WorldObject) {
        for (let name in this.physicsGroups) {
            A.removeAll(this.physicsGroups[name].worldObjects, obj);
        }
    }

    // For use with World.Actions.addWorldObjectToWorld
    zinternal_addWorldObjectToWorldWorld(obj: WorldObject) {
        this.worldObjects.push(obj);

        if (obj.layer) {
            World.Actions.setLayer(obj, obj.layer);
        } else {
            World.Actions.setLayer(obj, World.DEFAULT_LAYER);
        }

        if (obj instanceof PhysicsWorldObject && obj.physicsGroup) {
            World.Actions.setPhysicsGroup(obj, obj.physicsGroup);
        }

        this.hookManager.executeHooks('onWorldObjectAdded', obj);
    }

    // For use with World.Actions.removeWorldObjectFromWorld
    zinternal_removeWorldObjectFromWorldWorld(obj: WorldObject) {
        this.hookManager.executeHooks('onWorldObjectRemoved', obj);

        this.removeFromAllLayers(obj);
        this.removeFromAllPhysicsGroups(obj);
        A.removeAll(this.worldObjects, obj);
    }

    // For use with World.Actions.setLayer
    zinternal_setLayerWorld(obj: WorldObject, layerName: string | undefined) {
        this.removeFromAllLayers(obj);

        for (let layer of this.layers) {
            if (layer.name === layerName) {
                layer.worldObjects.push(obj);
                return;
            }
        }
    }

    // For use with World.Actions.setPhysicsGroup
    zinternal_setPhysicsGroupWorld(obj: PhysicsWorldObject, physicsGroupName: string | undefined) {
        this.removeFromAllPhysicsGroups(obj);
        if (!St.isEmpty(physicsGroupName)) {
            this.getPhysicsGroupByName(physicsGroupName)?.worldObjects?.push(obj);
        }
    }

    // For use with World.Actions.addChildToParent
    zinternal_addChildToParentWorld(child: WorldObject, obj: WorldObject) {
        if (child.world !== this) {
            World.Actions.addWorldObjectToWorld(child, this);
        }
    }

    // For use with World.Actions.removeChildFromParent
    zinternal_removeChildFromParentWorld(child: WorldObject) {
        
    }

    static DEFAULT_LAYER: string = 'default';
    static AFTER_FADE_LAYER: string = 'afterfade';
}

namespace World {
    export class Layer {
        name: string;
        worldObjects: WorldObject[];
        sortComparator?: (worldObject1: WorldObject, worldObject2: WorldObject) => number;
        reverseSort: boolean;

        effects: Effects;
        sprite: PIXI.Sprite;

        get shouldRenderToOwnLayer() {
            return this.effects.hasEffects();
        }
        
        constructor(world: World, name: string, config: World.LayerConfig) {
            this.name = name;
            this.worldObjects = [];
            this.sortComparator = this.getSortComparator(config.sort);
            this.reverseSort = config.reverseSort ?? false;

            this.effects = new Effects(config.effects);
            this.sprite = new PIXI.Sprite(newPixiRenderTexture(world.getTargetScreenWidth(), world.getTargetScreenHeight(), 'World.Layer.sprite'));
        }

        sort() {
            if (!this.sortComparator) return;
            let r = this.reverseSort ? -1 : 1;
            this.worldObjects.sort((a, b) => r*this.sortComparator!(a, b));
        }

        private getSortComparator(sort: World.LayerConfig['sort']) {
            if (!sort) return undefined;
            if ('comparator' in sort) return sort.comparator;
            return (worldObject1: WorldObject, worldObject2: WorldObject) => sort.key(worldObject1) - sort.key(worldObject2);
        }
    }

    export class PhysicsGroup {
        name: string;
        immovable: boolean;
        worldObjects: PhysicsWorldObject[];

        constructor(name: string, config: World.PhysicsGroupConfig) {
            this.name = name;
            this.immovable = config.immovable ?? false;
            this.worldObjects = [];
        }
    }

    export namespace Actions {
        /**
         * Adds a WorldObject to the world. Returns the object for chaining.
         */
        export function addWorldObjectToWorld<T extends WorldObject | undefined>(obj: T, world: World): T {
            if (!obj || !world) return obj;

            if (obj.world) {
                console.error(`Cannot add object ${obj.name} to world because it aleady exists in another world! You must remove object from previous world first. World:`, world, 'Previous world:', obj.world);
                return obj;
            }

            obj.zinternal_addWorldObjectToWorldWorldObject(world);
            world.zinternal_addWorldObjectToWorldWorld(obj);

            World.Actions.addWorldObjectsToWorld(obj.children, world);

            obj.onAdd();
            return obj;
        }

        /**
         * Adds a list of WorldObjects to a world. Returns as a list the objects added successfully.
         */
        export function addWorldObjectsToWorld<T extends WorldObject>(objs: ReadonlyArray<T>, world: World): T[] {
            if (A.isEmpty(objs)) return [];
            return objs.filter(obj => addWorldObjectToWorld(obj, world));
        }

        /**
         * Removes a WorldObject from its containing world. Returns the object for chaining.
         */
        export function removeWorldObjectFromWorld<T extends WorldObject | undefined>(obj: T, detachFromParent: boolean = true): T {
            if (!obj) return obj;

            if (!obj.world) {
                return obj;
            }

            obj.onRemove();

            let world = obj.world;

            obj.zinternal_removeWorldObjectFromWorldWorldObject(world);
            world.zinternal_removeWorldObjectFromWorldWorld(obj);
            
            World.Actions.removeWorldObjectsFromWorld(obj.children, false);

            if (detachFromParent && obj.parent) {
                World.Actions.detachChildFromParent(obj);
            }
            
            return obj;
        }

        /**
         * Removes a list of WorldObjects from their containing worlds. Returns a copy of the list of objs.
         * @param unlinkFromParent default: true
         */
        export function removeWorldObjectsFromWorld<T extends WorldObject | undefined>(objs: ReadonlyArray<T>, unlinkFromParent: boolean = true): T[] {
            if (A.isEmpty(objs)) return [];
            return A.clone(objs).filter(obj => removeWorldObjectFromWorld(obj, unlinkFromParent));
        }

        /**
         * Scales world objects and their positions around a given anchor.
         */
        export function scaleWorldObjectsByAnchor(worldObjects: (WorldObject & { scaleX: number, scaleY: number })[], anchor: Pt, currentScaleX: number, currentScaleY: number, newScaleX: number, newScaleY: number) {
            let scaleRatioX = newScaleX / currentScaleX;
            let scaleRatioY = newScaleY / currentScaleY;
    
            for (let obj of worldObjects) {
                obj.scaleX *= scaleRatioX;
                obj.scaleY *= scaleRatioY;
    
                obj.x = anchor.x + (obj.x - anchor.x) * scaleRatioX;
                obj.y = anchor.y + (obj.y - anchor.y) * scaleRatioY;
            }
        }

        /**
         * Sets the layer of a WorldObject. Returns the new layer name of the object.
         */
        export function setLayer(obj: WorldObject, layerName: string | undefined): string | undefined {
            if (!obj) return undefined;

            if (obj.world && !obj.world.getLayerByName(layerName)) {
                console.error(`Cannot set layer on object '${obj.name}' as no layer named ${layerName} exists in world!`, obj.world);
                setLayer(obj, World.DEFAULT_LAYER);
                return obj.layer;
            }

            obj.zinternal_setLayerWorldObject(layerName);

            if (obj.world) {
                obj.world.zinternal_setLayerWorld(obj, layerName);
            }

            return obj.layer;
        }

        /**
         * Sets the physics group of a WorldObject. Returns the new physics group name of the object.
         */
        export function setPhysicsGroup(obj: WorldObject, physicsGroupName: string | undefined): string | undefined {
            if (!obj) return undefined;

            if (obj.world && !St.isEmpty(physicsGroupName) && !obj.world.getPhysicsGroupByName(physicsGroupName)) {
                console.error(`Cannot set physicsGroup on object '${obj.name}' as no physicsGroup named ${physicsGroupName} exists in world`, obj.world);
                return obj.physicsGroup;
            }

            if (!(obj instanceof PhysicsWorldObject)) {
                console.error(`Cannot set physicsGroup on object because it is not a PhysicsWorldObject`, obj);
                return obj.physicsGroup;
            }

            obj.zinternal_setPhysicsGroupWorldObject(physicsGroupName);

            if (obj.world) {
                obj.world.zinternal_setPhysicsGroupWorld(obj, physicsGroupName);
            }

            return obj.physicsGroup;
        }

        /**
         * Adds a WorldObject as a child to a parent. Returns the child object for chaining.
         */
        export function addChildToParent<T extends WorldObject>(child: T, obj: WorldObject): T {
            if (!child || !obj) return child;

            if (child.parent) {
                console.error(`Cannot add child ${child.name} to parent ${obj.name} becase the child is already the child of another parent!`, child.parent);
                return child;
            }

            if (child.world && child.world !== obj.world) {
                console.error(`Cannot add child ${child.name} to parent ${obj.name} becase the child exists in a different world!`, child.world);
                return child;
            }

            let cyclicCheckParent = obj.parent;
            while (cyclicCheckParent) {
                if (cyclicCheckParent === child) {
                    console.error(`Cannot add child ${child.name} to parent ${obj.name} because this would result in a cyclic hierarchy`);
                    return child;
                }
                cyclicCheckParent = cyclicCheckParent.parent;
            }

            child.zinternal_addChildToParentWorldObjectChild(obj);
            obj.zinternal_addChildToParentWorldObjectParent(child);

            if (obj.world) {
                obj.world.zinternal_addChildToParentWorld(child, obj);
            }

            return child;
        }

        /**
         * Adds a list of WorldObjects as children to a parent. Returns a copy of the list of children.
         */
        export function addChildrenToParent<T extends WorldObject>(children: ReadonlyArray<T>, obj: WorldObject): T[] {
            if (A.isEmpty(children)) return [];
            return children.filter(child => addChildToParent(child, obj));
        }

        /**
         * Detaches a child from its parent. Returns the child for chaining.
         */
        export function detachChildFromParent<T extends WorldObject>(child: T): T {
            if (!child) return child;

            if (!child.parent) {
                debug(`Tried to remove child ${child.name} from its parent, but its parent does not exist! Child:`, child);
                return child;
            }

            child.parent.zinternal_removeChildFromParentWorldObjectParent(child);
            child.zinternal_removeChildFromParentWorldObjectChild();

            if (child.world) {
                child.world.zinternal_removeChildFromParentWorld(child);
            }

            return child;
        }

        /**
         * Detaches a list of children from their parents. Returns a copy of the list of children.
         */
        export function detachChildrenFromParent<T extends WorldObject>(children: ReadonlyArray<T>): T[] {
            if (A.isEmpty(children)) return [];
            return A.clone(children).filter(child => detachChildFromParent(child));
        }

        /**
         * Orders a WorldObject before another WorldObject so that it is rendered earlier.
         */
        export function orderWorldObjectBefore(obj: WorldObject, before: WorldObject) {
            if (!obj || !before) return;
            if (!obj.world || obj.world !== before.world) {
                console.error('Cannot reorder objects due to null or mismatched worlds:', obj, before);
                return;
            }

            let layer = obj.world.getLayerByName(obj.layer);

            if (layer && obj.layer === before.layer) {
                A.moveBefore(layer.worldObjects, obj, before);
            }
        }

        /**
         * Orders a WorldObject after another WorldObject so that it is rendered later.
         */
        export function orderWorldObjectAfter(obj: WorldObject, after: WorldObject) {
            if (!obj || !after) return;
            if (!obj.world || obj.world !== after.world) {
                console.error('Cannot reorder objects due to null or mismatched worlds:', obj, after);
                return;
            }

            let layer = obj.world.getLayerByName(obj.layer);

            if (layer && obj.layer === after.layer) {
                A.moveAfter(layer.worldObjects, obj, after);
            }
        }

        /**
         * Moves a WorldObject to the front of its layer so it is rendered later.
         */
        export function moveWorldObjectToFront(obj: WorldObject) {
            if (!obj) return;
            if (!obj.world) {
                console.error('Cannot move object since it is not in a world:', obj);
                return;
            }
            let layer = obj.world.getLayerByName(obj.layer);
            if (!layer) return;
            let layerObjects = layer.worldObjects;
            let i = layerObjects.indexOf(obj);
            if (i === layerObjects.length-1) return;
            layerObjects.push(layerObjects.splice(i, 1)[0]);
        }

        /**
         * Moves a WorldObject to the front of its layer so it is rendered earlier.
         */
         export function moveWorldObjectToBack(obj: WorldObject) {
            if (!obj) return;
            if (!obj.world) {
                console.error('Cannot move object since it is not in a world:', obj);
                return;
            }
            let layer = obj.world.getLayerByName(obj.layer);
            if (!layer) return;
            let layerObjects = layer.worldObjects;
            let i = layerObjects.indexOf(obj);
            if (i === 0) return;
            layerObjects.unshift(layerObjects.splice(i, 1)[0]);
        }

        /**
         * Shifts provided WorldObjects equally to balance them around a point. Uses objects' position.
         * @return the new bounds containing all of the objects
         */
        export function balanceWorldObjectsByPosition$(objs: ReadonlyArray<WorldObject>, aroundX: number, aroundY: number, anchor: Vector2 = Anchor.CENTER, deep: boolean = false) {
            let localBounds = FrameCache.rectangle(0, 0, 0, 0);
            return balanceWorldObjects$(objs, aroundX, aroundY, anchor, deep, _ => localBounds);
        }

        /**
         * Shifts provided WorldObjects equally to balance them around a point. Uses objects' getVisibleLocalBounds() method.
         * @return the new bounds containing all of the objects
         */
        export function balanceWorldObjectsByVisualBounds$(objs: ReadonlyArray<WorldObject>, aroundX: number, aroundY: number, anchor: Vector2 = Anchor.CENTER, deep: boolean = false) {
            return balanceWorldObjects$(objs, aroundX, aroundY, anchor, deep, worldObject => worldObject.getVisibleLocalBounds$());
        }

        /**
         * Returns -1 if obj1 renders before obj2, +1 if vice versa, or 0 if no order could be determined.
         */
        export function getRenderOrder(obj1: WorldObject, obj2: WorldObject) {
            if (!obj1.world || !obj2.world || obj1.world !== obj2.world) return 0;

            let world = obj1.world;
            let layer1 = world.getLayerByName(obj1.layer);
            let layer2 = world.getLayerByName(obj2.layer);

            if (!layer1 || !layer2) return 0;

            if (layer1 === layer2) {
                return Math.sign(layer1.worldObjects.indexOf(obj1) - layer1.worldObjects.indexOf(obj2));
            }

            return Math.sign(world.layers.indexOf(layer1) - world.layers.indexOf(layer2));
        }

        function balanceWorldObjects$(objs: ReadonlyArray<WorldObject>, aroundX: number, aroundY: number, anchor: Vector2, deep: boolean, getLocalBounds$: (worldObject: WorldObject) => Rectangle | undefined) {
            if (A.isEmpty(objs)) return undefined;

            let bounds$ = FrameCache.boundaries(objs[0].x, objs[0].x, objs[0].y, objs[0].y);

            for (let obj of objs) {
                expandWorldObjectBounds(bounds$, obj, deep, getLocalBounds$);
            }

            let anchorPoint = tmp.vec2(M.lerp(anchor.x, bounds$.left, bounds$.right), M.lerp(anchor.y, bounds$.top, bounds$.bottom));

            if (!isFinite(anchorPoint.x) || !isFinite(anchorPoint.y)) {
                console.error('Non-finite anchorPoint for balancing:', objs, `(${anchorPoint.x}, ${anchorPoint.y})`);
            }

            for (let obj of objs) {
                obj.x += aroundX - anchorPoint.x;
                obj.y += aroundY - anchorPoint.y;
            }

            bounds$.left += aroundX - anchorPoint.x;
            bounds$.right += aroundX - anchorPoint.x;
            bounds$.top += aroundY - anchorPoint.y;
            bounds$.bottom += aroundY - anchorPoint.y;

            return bounds$;
        }

        function expandWorldObjectBounds(bounds$: Boundaries, obj: WorldObject, deep: boolean, getLocalBounds$: (worldObject: WorldObject) => Rectangle | undefined) {
            let objBounds = getLocalBounds$(obj);

            if (!objBounds || !objBounds.isFinite()) {
                console.error("Failed to get finite object bounds for balancing:", obj, JSON.stringify(objBounds));
                objBounds = FrameCache.rectangle(0, 0, 0, 0);
            }

            objBounds.x += obj.x;
            objBounds.y += obj.y;
            
            bounds$.left = Math.min(bounds$.left, objBounds.left);
            bounds$.right = Math.max(bounds$.right, objBounds.right);
            bounds$.top = Math.min(bounds$.top, objBounds.top);
            bounds$.bottom = Math.max(bounds$.bottom, objBounds.bottom);

            objBounds.x -= obj.x;
            objBounds.y -= obj.y;

            if (deep) {
                for (let child of obj.children) {
                    expandWorldObjectBounds(bounds$, child, deep, getLocalBounds$);
                }
            }
        }
    }

    export class ScreenShakeFilter extends TextureFilter {
        constructor() {
            super({
                uniforms: { 'float shakeX': 0, 'float shakeY': 0 },
                code: `
                    float newX = clamp(x + shakeX, 0.0, width-1.0);
                    float newY = clamp(y + shakeY, 0.0, height-1.0);
                    outp = getColor(newX, newY);
                `
            });
        }

        setShake(shakeX: number, shakeY: number) {
            this.setUniform('shakeX', shakeX);
            this.setUniform('shakeY', shakeY);
        }
    }
}
