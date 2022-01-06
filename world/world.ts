/// <reference path="../worldObject/sprite/sprite.ts" />
/// <reference path="../worldObject/worldObject.ts" />

namespace World {
    export type Config = {
        layers?: World.LayerConfig[];
        effects?: Effects.Config;

        camera?: Camera.Config;

        backgroundColor?: number;
        backgroundAlpha?: number;

        width?: number;
        height?: number;

        physicsGroups?: Dict<World.PhysicsGroupConfig>;
        collisions?: CollisionConfig[];
        collisionIterations?: number;
        useRaycastDisplacementThreshold?: number;
        maxDistancePerCollisionStep?: number;
        minDistanceIgnoreCollisionStepCalculation?: number;

        volume?: number;
        globalSoundHumanizePercent?: number;

        timescale?: number;
        data?: any;
    }

    export type CollisionConfig = {
        move: string;
        from: string;
        callback?: Physics.CollisionCallback;
        momentumTransfer?: Physics.MomentumTransferMode;
    }

    export type LayerConfig = {
        name?: string;
        sortKey?: (worldObject: WorldObject) => number;
        reverseSort?: boolean;
        effects?: Effects.Config;
    }

    export type PhysicsGroupConfig = {
        immovable?: boolean;
    }

    export type PlaySoundConfig = {
        humanized?: boolean;
        limit?: number;
    }
}

class World {
    width: number;
    height: number;
    worldObjects: WorldObject[];
    time: number;
    timescale: number;
    data: any;

    physicsGroups: Dict<World.PhysicsGroup>;
    collisions: World.CollisionConfig[];
    collisionIterations: number;
    useRaycastDisplacementThreshold: number;
    maxDistancePerCollisionStep: number;
    minDistanceIgnoreCollisionStepCalculation: number;

    layers: World.Layer[];
    effects: Effects;

    backgroundColor: number;
    backgroundAlpha: number;

    camera: Camera;
    private worldTexture: Texture;
    private layerTexture: Texture;

    protected scriptManager: ScriptManager;
    protected soundManager: SoundManager;

    select: WorldSelecter;
    
    get delta() {
        if (global.skippingCutscene) return Theater.SKIP_CUTSCENE_DELTA;
        return global.game.delta * this.timescale;
    }

    volume: number;
    globalSoundHumanizePercent: number;

    constructor(config: World.Config = {}) {        
        this.scriptManager = new ScriptManager();
        this.soundManager = new SoundManager();

        this.select = new WorldSelecter(this);

        this.volume = config.volume ?? 1;
        this.globalSoundHumanizePercent = config.globalSoundHumanizePercent ?? 0;

        this.width = config.width ?? global.gameWidth;
        this.height = config.height ?? global.gameHeight;
        this.time = 0;
        this.timescale = config.timescale ?? 1;
        this.data = config.data ? O.deepClone(config.data) : {};

        this.physicsGroups = this.createPhysicsGroups(config.physicsGroups);
        this.collisions = config.collisions ?? [];
        this.collisionIterations = config.collisionIterations ?? 1;
        this.useRaycastDisplacementThreshold = config.useRaycastDisplacementThreshold ?? 1;
        this.maxDistancePerCollisionStep = config.maxDistancePerCollisionStep ?? Infinity;
        this.minDistanceIgnoreCollisionStepCalculation = config.minDistanceIgnoreCollisionStepCalculation ?? Infinity;

        this.worldObjects = [];
        this.layers = this.createLayers(config.layers);
        this.effects = new Effects(config.effects);

        this.backgroundColor = config.backgroundColor ?? global.backgroundColor;
        this.backgroundAlpha = config.backgroundAlpha ?? 1;

        this.worldTexture = new BasicTexture(this.width, this.height);
        this.layerTexture = new BasicTexture(this.width, this.height);

        this.camera = new Camera(config.camera ?? {}, this);
    }

    onTransitioned() {
        
    }

    update() {
        this.updateScriptManager();

        global.metrics.startSpan('preUpdate');
        for (let worldObject of this.worldObjects) {
            worldObject.setIsInsideWorldBoundsBufferThisFrame();
            if (worldObject.isActive() && worldObject._isInsideWorldBoundsBufferThisFrame) {
                global.metrics.startSpan(worldObject);
                worldObject.preUpdate();
                global.metrics.endSpan(worldObject);
            }
        }
        global.metrics.endSpan('preUpdate');

        global.metrics.startSpan('update');
        for (let worldObject of this.worldObjects) {
            if (worldObject.isActive() && worldObject._isInsideWorldBoundsBufferThisFrame) {
                global.metrics.startSpan(worldObject);
                worldObject.update();
                global.metrics.endSpan(worldObject);
            }
        }
        global.metrics.endSpan('update');

        global.metrics.startSpan('handleCollisions');
        this.handleCollisions();
        global.metrics.endSpan('handleCollisions');

        global.metrics.startSpan('postUpdate');
        for (let worldObject of this.worldObjects) {
            if (worldObject.isActive() && worldObject._isInsideWorldBoundsBufferThisFrame) {
                global.metrics.startSpan(worldObject);
                worldObject.postUpdate();
                global.metrics.endSpan(worldObject);
            }
        }
        global.metrics.endSpan('postUpdate');

        this.removeDeadWorldObjects();

        this.camera.update();

        for (let layer of this.layers) {
            layer.effects.updateEffects(this.delta);
        }

        this.soundManager.volume = this.volume * global.game.volume * Options.sfxVolume;
        this.soundManager.update(this.delta);

        this.time += this.delta;
    }

    protected updateScriptManager() {
        this.scriptManager.update(this.delta);
    }

    render(screen: Texture) {
        this.worldTexture.clear();

        // Render background color.
        Draw.brush.color = this.backgroundColor;
        Draw.brush.alpha = this.backgroundAlpha;
        Draw.rectangleSolid(this.worldTexture, 0, 0, this.width, this.height);

        for (let layer of this.layers) {
            global.metrics.startSpan(`layer_${layer.name}`);
            global.metrics.recordMetric('renderToOwnLayer', layer.shouldRenderToOwnLayer ? 0 : 1);
            if (layer.shouldRenderToOwnLayer) {
                this.layerTexture.clear();
                this.renderLayerToTexture(layer, this.layerTexture);
                this.layerTexture.renderTo(this.worldTexture, {
                    filters: layer.effects.getFilterList()
                });
            } else {
                this.renderLayerToTexture(layer, this.worldTexture);
            }
            global.metrics.endSpan(`layer_${layer.name}`);
        }

        // Apply world effects.
        this.worldTexture.renderTo(screen, {
            filters: this.effects.getFilterList(),
        });
    }

    renderLayerToTexture(layer: World.Layer, texture: Texture) {
        layer.sort();

        for (let worldObject of layer.worldObjects) {
            if (worldObject.isVisible() && worldObject.isOnScreen()) {
                global.metrics.startSpan(worldObject);
                worldObject.render(texture, worldObject.getRenderScreenX(), worldObject.getRenderScreenY());
                global.metrics.endSpan(worldObject);
            }
        }
    }

    addWorldObject<T extends WorldObject>(obj: T): T {
        return World.Actions.addWorldObjectToWorld(obj, this);
    }
    
    addWorldObjects<T extends WorldObject>(objs: T[]): T[] {
        return World.Actions.addWorldObjectsToWorld(objs, this);
    }

    getDeadWorldObjects() {
        return this.worldObjects.filter(obj => !obj.alive);
    }

    getLayerByName(name: string) {
        for (let layer of this.layers) {
            if (layer.name === name) return layer;
        }
        return undefined;
    }

    getPhysicsGroupByName(name: string) {
        return this.physicsGroups[name];
    }

    getPhysicsGroupsThatCollideWith(physicsGroup: string) {
        let result: string[] = [];
        for (let collision of this.collisions) {
            if (collision.move === physicsGroup) {
                result.push(collision.from);
            } else if (collision.from === physicsGroup) {
                result.push(collision.move);
            }
        }
        return A.removeDuplicates(result);
    }

    getWorldMouseX() {
        return Input.mouseX + Math.floor(this.camera.worldOffsetX);
    }

    getWorldMouseY() {
        return Input.mouseY + Math.floor(this.camera.worldOffsetY);
    }

    getWorldMousePosition() {
        return new Vector2(this.getWorldMouseX(), this.getWorldMouseY());
    }

    handleCollisions() {
        if (_.isEmpty(this.collisions)) return;

        Physics.resolveCollisions(this);
    }

    /**
     * By default, sounds are:
     *   - Humanized (if set globally and sound duration less than 1 second)
     */
    playSound(key: string, config?: World.PlaySoundConfig) {
        let limit = config?.limit ?? Infinity;

        // Check limit
        if (this.soundManager.getSoundsByKey(key).length >= limit) {
            return new Sound(key);
        }

        let sound = this.soundManager.playSound(key);
        let humanized = config?.humanized ?? (sound.duration < 1);
        if (humanized && this.globalSoundHumanizePercent > 0) {
            sound.humanize(this.globalSoundHumanizePercent);
        }
        return sound;
    }
    
    removeWorldObject<T extends WorldObject>(obj: T | string): T {
        if (!obj) return undefined;
        if (_.isString(obj)) {
            obj = this.select.name<T>(obj);
            if (!obj) return;
        }
        if (!obj.world) return;
        if (obj.world !== this) {
            error(`Cannot remove object ${obj.name} from world because it does not exist in the world. World:`, this);
            return undefined;
        }
        return World.Actions.removeWorldObjectFromWorld(obj);
    }
    
    removeWorldObjects<T extends WorldObject>(objs: ReadonlyArray<T | string>): T[] {
        if (_.isEmpty(objs)) return [];
        return objs.map(obj => this.removeWorldObject(obj)).filter(obj => obj);
    }

    runScript(script: Script | Script.Function) {
        return this.scriptManager.runScript(script);
    }

    takeSnapshot() {
        let screen = new BasicTexture(this.camera.width, this.camera.height);
        this.render(screen);
        return screen;
    }

    private createLayers(layers: World.LayerConfig[]) {
        if (_.isEmpty(layers)) layers = [];

        layers.push({ name: World.DEFAULT_LAYER });

        let result: World.Layer[] = [];
        for (let layer of layers) {
            _.defaults(layer, {
                reverseSort: false,
            });
            result.push(new World.Layer(layer.name, layer));
        }

        return result;
    }

    private createPhysicsGroups(physicsGroups: Dict<World.PhysicsGroupConfig>) {
        if (_.isEmpty(physicsGroups)) return {};

        let result: Dict<World.PhysicsGroup> = {};
        for (let name in physicsGroups) {
            _.defaults(physicsGroups[name], {
                collidesWith: [],
            });
            result[name] = new World.PhysicsGroup(name, physicsGroups[name]);
        }
        return result;
    }

    private removeDeadWorldObjects() {
        this.removeWorldObjects(this.getDeadWorldObjects());
    }

    // For use with World.Actions.addWorldObjectToWorld
    private internalAddWorldObjectToWorldWorld(obj: WorldObject) {
        this.worldObjects.push(obj);

        if (obj.layer) {
            World.Actions.setLayer(obj, obj.layer);
        } else {
            World.Actions.setLayer(obj, World.DEFAULT_LAYER);
        }

        if (obj instanceof PhysicsWorldObject && obj.physicsGroup) {
            World.Actions.setPhysicsGroup(obj, obj.physicsGroup);
        }
    }

    // For use with World.Actions.removeWorldObjectFromWorld
    private internalRemoveWorldObjectFromWorldWorld(obj: WorldObject) {
        this.removeFromAllLayers(obj);
        this.removeFromAllPhysicsGroups(obj);
        A.removeAll(this.worldObjects, obj);
    }

    // For use with World.Actions.setLayer
    private internalSetLayerWorld(obj: WorldObject, layerName: string) {
        this.removeFromAllLayers(obj);

        for (let layer of this.layers) {
            if (layer.name === layerName) {
                layer.worldObjects.push(obj);
                return;
            }
        }
    }

    // For use with World.Actions.setPhysicsGroup
    private internalSetPhysicsGroupWorld(obj: PhysicsWorldObject, physicsGroupName: string) {
        this.removeFromAllPhysicsGroups(obj);
        if (!_.isEmpty(physicsGroupName)) {
            this.getPhysicsGroupByName(physicsGroupName).worldObjects.push(obj);
        }
    }

    // For use with World.Actions.addChildToParent
    private internalAddChildToParentWorld(child: WorldObject, obj: WorldObject) {
        if (child.world !== this) {
            World.Actions.addWorldObjectToWorld(child, this);
        }
    }

    // For use with World.Actions.removeChildFromParent
    private internalRemoveChildFromParentWorld(child: WorldObject) {
        
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

    static DEFAULT_LAYER: string = 'default';
}

namespace World {
    export class Layer {
        name: string;
        worldObjects: WorldObject[];
        sortKey: (worldObject: WorldObject) => number;
        reverseSort: boolean;

        effects: Effects;

        get shouldRenderToOwnLayer() {
            return this.effects.hasEffects();
        }
        
        constructor(name: string, config: World.LayerConfig) {
            this.name = name;
            this.worldObjects = [];
            this.sortKey = config.sortKey;
            this.reverseSort = config.reverseSort ?? false;

            this.effects = new Effects(config.effects);
        }

        sort() {
            if (!this.sortKey) return;
            let r = this.reverseSort ? -1 : 1;
            this.worldObjects.sort((a, b) => r*(this.sortKey(a) - this.sortKey(b)));
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
         * Adds a WorldObject to the world. Returns the object added.
         */
        export function addWorldObjectToWorld<T extends WorldObject>(obj: T, world: World): T {
            if (!obj || !world) return obj;

            if (obj.world) {
                error(`Cannot add object ${obj.name} to world because it aleady exists in another world! You must remove object from previous world first. World:`, world, 'Previous world:', obj.world);
                return undefined;
            }

            /// @ts-ignore
            obj.internalAddWorldObjectToWorldWorldObject(world);
            /// @ts-ignore
            world.internalAddWorldObjectToWorldWorld(obj);

            World.Actions.addWorldObjectsToWorld(obj.children, world);

            obj.onAdd();
            return obj;
        }

        /**
         * Adds a list of WorldObjects to a world. Returns as a list the objects added successfully.
         */
        export function addWorldObjectsToWorld<T extends WorldObject>(objs: ReadonlyArray<T>, world: World): T[] {
            if (_.isEmpty(objs)) return [];
            return objs.filter(obj => addWorldObjectToWorld(obj, world));
        }

        /**
         * Removes a WorldObject from its containing world. Returns the object removed.
         */
        export function removeWorldObjectFromWorld<T extends WorldObject>(obj: T): T {
            if (!obj) return obj;

            if (!obj.world) {
                return obj;
            }

            obj.onRemove();

            let world = obj.world;

            /// @ts-ignore
            obj.internalRemoveWorldObjectFromWorldWorldObject(world);
            /// @ts-ignore
            world.internalRemoveWorldObjectFromWorldWorld(obj);
            
            World.Actions.removeWorldObjectsFromWorld(obj.children);

            /* No longer unlinking child from parent due to self-mutating iterator issue*/
            if (obj.parent) {
                World.Actions.removeChildFromParent(obj);
            }
            
            return obj;
        }

        /**
         * Removes a list of WorldObjects from their containing worlds. Returns as a list the objects successfully removed.
         */
        export function removeWorldObjectsFromWorld<T extends WorldObject>(objs: ReadonlyArray<T>): T[] {
            if (_.isEmpty(objs)) return [];
            return A.clone(objs).filter(obj => removeWorldObjectFromWorld(obj));
        }

        /**
         * Sets the layer of a WorldObject. Returns the new layer name of the object.
         */
        export function setLayer(obj: WorldObject, layerName: string): string {
            if (!obj) return undefined;

            if (obj.world && !obj.world.getLayerByName(layerName)) {
                error(`Cannot set layer on object '${obj.name}' as no layer named ${layerName} exists in world!`, obj.world);
                return obj.layer;
            }

            /// @ts-ignore
            obj.internalSetLayerWorldObject(layerName);

            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetLayerWorld(obj, layerName);
            }

            return obj.layer;
        }

        /**
         * Sets the physics group of a WorldObject. Returns the new physics group name of the object.
         */
        export function setPhysicsGroup(obj: WorldObject, physicsGroupName: string): string {
            if (!obj) return undefined;

            if (obj.world && !_.isEmpty(physicsGroupName) && !obj.world.getPhysicsGroupByName(physicsGroupName)) {
                error(`Cannot set physicsGroup on object '${obj.name}' as no physicsGroup named ${physicsGroupName} exists in world!`, obj.world);
                return obj.physicsGroup;
            }

            /// @ts-ignore
            obj.internalSetPhysicsGroupWorldObject(physicsGroupName);

            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetPhysicsGroupWorld(obj, physicsGroupName);
            }

            return obj.physicsGroup;
        }

        /**
         * Adds a WorldObject as a child to a parent. Returns the child object if successful.
         */
        export function addChildToParent<T extends WorldObject>(child: T, obj: WorldObject): T {
            if (!child || !obj) return child;

            if (child.parent) {
                error(`Cannot add child ${child.name} to parent ${obj.name} becase the child is already the child of another parent!`, child.parent);
                return undefined;
            }

            if (child.world && child.world !== obj.world) {
                error(`Cannot add child ${child.name} to parent ${obj.name} becase the child exists in a different world!`, child.world);
                return undefined;
            }

            let cyclicCheckParent = obj.parent;
            while (cyclicCheckParent) {
                if (cyclicCheckParent === child) {
                    error(`Cannot add child ${child.name} to parent ${obj.name} because this would result in a cyclic hierarchy`);
                    return undefined;
                }
                cyclicCheckParent = cyclicCheckParent.parent;
            }

            /// @ts-ignore
            child.internalAddChildToParentWorldObjectChild(obj);
            /// @ts-ignore
            obj.internalAddChildToParentWorldObjectParent(child);

            if (obj.world) {
                /// @ts-ignore
                obj.world.internalAddChildToParentWorld(child, obj);
            }

            return child;
        }

        /**
         * Adds a list of WorldObjects as children to a parent. Returns as a list the children successfully added.
         */
        export function addChildrenToParent<T extends WorldObject>(children: ReadonlyArray<T>, obj: WorldObject): T[] {
            if (_.isEmpty(children)) return [];
            return children.filter(child => addChildToParent(child, obj));
        }

        /**
         * Removes a child from its parent. Returns the child if successfully removed.
         */
        export function removeChildFromParent<T extends WorldObject>(child: T): T {
            if (!child) return child;

            if (!child.parent) {
                debug(`Tried to remove child ${child.name} from its parent, but its parent does not exist! Child:`, child);
                return child;
            }

            /// @ts-ignore
            child.parent.internalRemoveChildFromParentWorldObjectParent(child);
            /// @ts-ignore
            child.internalRemoveChildFromParentWorldObjectChild();

            if (child.world) {
                /// @ts-ignore
                child.world.internalRemoveChildFromParentWorld(child);
            }

            return child;
        }

        /**
         * Removes a list of children from their parents. Returns as a list the children successfully removed.
         */
        export function removeChildrenFromParent<T extends WorldObject>(children: ReadonlyArray<T>): T[] {
            if (_.isEmpty(children)) return [];
            return A.clone(children).filter(child => removeChildFromParent(child));
        }
    }
}
