/// <reference path="./worldObject.ts" />

namespace World {
    export type Config = WorldObject.Config & {
        physicsGroups?: Dict<World.PhysicsGroupConfig>;
        collisionOrder?: CollisionConfig[];
        layers?: World.LayerConfig[];

        camera?: Camera.Config;

        width?: number;
        height?: number;

        backgroundColor?: number;
        backgroundAlpha?: number;

        entryPoints?: Dict<Pt>;
        worldObjects?: WorldObject.Config[];
    }

    export type CollisionConfig = {
        move: string | string[];
        from: string | string[];
        callback?: Physics.Collision.Callback;
        transferMomentum?: boolean;
    }

    export type LayerConfig = {
        name: string;
        sortKey?: string;
        reverseSort?: boolean;
        effects?: Effects.Config;
    }

    export type PhysicsGroupConfig = {
    }

    export type EntryPoint = string | Pt;
}

class World extends WorldObject {
    width: number;
    height: number;
    entryPoints: Dict<Pt>;
    worldObjects: WorldObject[];

    physicsGroups: Dict<World.PhysicsGroup>;
    collisionOrder: World.CollisionConfig[];
    worldObjectsByName: Dict<WorldObject>;
    layers: World.Layer[];

    backgroundColor: number;
    backgroundAlpha: number;

    camera: Camera;
    private screen: Texture;
    private layerTexture: Texture;

    private debugCameraX: number;
    private debugCameraY: number;

    constructor(config: World.Config, defaults?: World.Config) {
        config = WorldObject.resolveConfig<World.Config>(config, defaults);
        super(config);

        this.width = O.getOrDefault(config.width, global.gameWidth);
        this.height = O.getOrDefault(config.height, global.gameHeight);
        this.worldObjects = [];

        this.physicsGroups = this.createPhysicsGroups(config.physicsGroups);
        this.collisionOrder = O.getOrDefault(config.collisionOrder, []);
        this.worldObjectsByName = {};
        this.layers = this.createLayers(config.layers);

        this.backgroundColor = O.getOrDefault(config.backgroundColor, global.backgroundColor);
        this.backgroundAlpha = O.getOrDefault(config.backgroundAlpha, 1);

        let cameraConfig = O.getOrDefault(config.camera, {});
        _.defaults(cameraConfig, {
            width: this.width,
            height: this.height,
        });
        this.camera = new Camera(cameraConfig);

        this.screen = new Texture(this.width, this.height);
        this.layerTexture = new Texture(this.width, this.height);

        this.entryPoints = O.getOrDefault(config.entryPoints, {});

        for (let worldObjectConfig of config.worldObjects || []) {
            World.Actions.addWorldObjectToWorld(WorldObject.fromConfig(worldObjectConfig), this);
        }
        
        this.debugCameraX = 0;
        this.debugCameraY = 0;
    }

    update(delta: number) {
        super.update(delta);

        for (let worldObject of this.worldObjects) {
            if (worldObject.active) worldObject.preUpdate();
        }

        for (let worldObject of this.worldObjects) {
            if (worldObject.active) worldObject.update(delta);
        }

        this.handleCollisions();

        for (let worldObject of this.worldObjects) {
            if (worldObject.active) worldObject.postUpdate();
        }

        this.removeDeadWorldObjects();

        if (Debug.MOVE_CAMERA_WITH_ARROWS && global.theater && this === global.theater.currentWorld) {
            if (Input.isDown('debugMoveCameraLeft'))  this.debugCameraX -= 1;
            if (Input.isDown('debugMoveCameraRight')) this.debugCameraX += 1;
            if (Input.isDown('debugMoveCameraUp'))    this.debugCameraY -= 1;
            if (Input.isDown('debugMoveCameraDown'))  this.debugCameraY += 1;
        }
        this.camera.update(this, delta);
    }

    protected updateScriptManager(delta: number) {
        this.scriptManager.update(this, this, delta);
    }

    render(screen: Texture) {
        let oldCameraX = this.camera.x;
        let oldCameraY = this.camera.y;
        if (Debug.MOVE_CAMERA_WITH_ARROWS && global.theater && this === global.theater.currentWorld) {
            this.camera.x += this.debugCameraX;
            this.camera.y += this.debugCameraY;
        }

        // Render background color.
        Draw.brush.color = this.backgroundColor;
        Draw.brush.alpha = this.backgroundAlpha;
        Draw.fill(this.screen);

        for (let layer of this.layers) {
            this.renderLayer(layer, this.layerTexture, this.screen);
        }

        this.camera.x = oldCameraX;
        this.camera.y = oldCameraY;
        
        screen.render(this.screen);
        super.render(screen);
    }

    renderLayer(layer: World.Layer, layerTexture: Texture, screen: Texture) {
        layerTexture.clear();
        layer.sort();
        for (let worldObject of layer.worldObjects) {
            if (worldObject.visible) {
                worldObject.fullRender(layerTexture);
            }
        }
        screen.render(layerTexture, {
            filters: layer.effects.getFilterList()
        });
    }

    addWorldObject<T extends WorldObject>(obj: T | WorldObject.Config): T {
        let worldObject: T = obj instanceof WorldObject ? obj : WorldObject.fromConfig<T>(obj);
        return World.Actions.addWorldObjectToWorld(worldObject, this);
    }
    
    addWorldObjects<T extends WorldObject>(objs: (T | WorldObject)[]): T[] {
        let worldObjects: T[] = _.isEmpty(objs) ? [] : objs.map(obj => obj instanceof WorldObject ? <T>obj : WorldObject.fromConfig<T>(obj));
        return World.Actions.addWorldObjectsToWorld(worldObjects, this);
    }

    getDeadWorldObjects() {
        return this.worldObjects.filter(obj => !obj.alive);
    }

    getEntryPoint(entryPointKey: string) {
        if (!this.entryPoints || !this.entryPoints[entryPointKey]) {
            debug(`World does not have an entry point named '${entryPointKey}':`, this);
            return undefined;
        }
        return this.entryPoints[entryPointKey];
    }

    getLayer(obj: string | WorldObject) {
        if (_.isString(obj)) obj = this.getWorldObjectByName(obj);
        for (let layer of this.layers) {
            if (_.contains(layer.worldObjects, obj)) return layer.name;
        }
        return undefined;
    }

    getLayerByName(name: string) {
        for (let layer of this.layers) {
            if (layer.name === name) return layer;
        }
        return undefined;
    }

    getName(obj: string | WorldObject) {
        if (_.isString(obj)) return obj;
        for (let name in this.worldObjectsByName) {
            if (this.worldObjectsByName[name] === obj) return name;
        }
        return undefined;
    }

    getPhysicsGroup(obj: string | WorldObject) {
        if (_.isString(obj)) obj = this.getWorldObjectByName(obj);
        for (let name in this.physicsGroups) {
            if (_.contains(this.physicsGroups[name].worldObjects, obj)) return name;
        }
        return undefined;
    }

    getPhysicsGroupByName(name: string) {
        return this.physicsGroups[name];
    }

    getWorldMouseX() {
        return Input.mouseX + Math.floor(this.camera.x - this.camera.width/2);
    }

    getWorldMouseY() {
        return Input.mouseY + Math.floor(this.camera.y - this.camera.height/2);
    }

    getWorldMousePosition(): Pt {
        return { x: this.getWorldMouseX(), y: this.getWorldMouseY() };
    }

    getWorldObjectByName<T extends WorldObject>(name: string): T {
        if (!this.worldObjectsByName[name]) {   
            debug(`No object with name '${name}' exists in world`, this);
        }
        return <T>this.worldObjectsByName[name];
    }

    getWorldObjectByType<T extends WorldObject>(type: new (...args) => T) {
        let results = this.getWorldObjectsByType<T>(type);
        if (_.isEmpty(results)) {
            debug(`No object of type ${type.name} exists in world`, this);
            return undefined;
        }
        if (results.length > 1) {
            debug(`Multiple objects of type ${type.name} exist in world. Returning one of them. World:`, this);
        }
        return <T>results[0];
    }

    getWorldObjectsByType<T extends WorldObject>(type: new (...args) => T) {
        return <T[]>this.worldObjects.filter(obj => obj instanceof type);
    }

    handleCollisions() {
        for (let collision of this.collisionOrder) {
            let move = _.isArray(collision.move) ? collision.move : [collision.move];
            let from = _.isArray(collision.from) ? collision.from : [collision.from];
            let fromObjects = <PhysicsWorldObject[]>_.flatten(from.map(name => this.physicsGroups[name].worldObjects));
            for (let moveGroup of move) {
                let group = this.physicsGroups[moveGroup].worldObjects;
                for (let obj of group) {
                    Physics.collide(obj, fromObjects, {
                        callback: collision.callback,
                        transferMomentum: collision.transferMomentum,
                    });
                }
            }
        }
    }

    hasWorldObject(obj: string | WorldObject) {
        if (_.isString(obj)) {
            return !!this.worldObjectsByName[obj];
        }
        return _.contains(this.worldObjects, obj);
    }

    
    removeWorldObject<T extends WorldObject>(obj: T | string): T {
        if (!obj) return undefined;
        if (_.isString(obj)) {
            obj = this.getWorldObjectByName<T>(obj);
            if (!obj) return;
        }
        if (obj.world !== this) {
            debug(`Cannot remove object ${obj.name} from world because it does not exist in the world. World:`, this);
            return undefined;
        }
        return World.Actions.removeWorldObjectFromWorld(obj);
    }
    
    removeWorldObjects<T extends WorldObject>(objs: ReadonlyArray<T | string>): T[] {
        if (_.isEmpty(objs)) return [];
        return objs.map(obj => this.removeWorldObject(obj)).filter(obj => obj);
    }

    takeSnapshot() {
        let screen = new Texture(this.camera.width, this.camera.height);
        let lastx = this.x;
        let lasty = this.y;
        this.x = 0;
        this.y = 0;
        this.render(screen);
        this.x = lastx;
        this.y = lasty;
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
            result.push(new World.Layer(layer.name, layer, this.width, this.height));
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

        if (obj.name) {
            World.Actions.setName(obj, obj.name);
        }

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
        this.removeName(obj);
        this.removeFromAllLayers(obj);
        this.removeFromAllPhysicsGroups(obj);
        A.removeAll(this.worldObjects, obj);
    }

    // For use with World.Actions.setName
    private internalSetNameWorld(obj: WorldObject, name: string) {
        this.removeName(obj);
        this.worldObjectsByName[name] = obj;
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
        this.getPhysicsGroupByName(physicsGroupName).worldObjects.push(obj);
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

    private removeName(obj: WorldObject) {
        for (let name in this.worldObjectsByName) {
            if (this.worldObjectsByName[name] === obj) {
                delete this.worldObjectsByName[name];
            }
        }
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
        sortKey: string;
        reverseSort: boolean;

        effects: Effects;
        
        constructor(name: string, config: World.LayerConfig, width: number, height: number) {
            this.name = name;
            this.worldObjects = [];
            this.sortKey = config.sortKey;
            this.reverseSort = config.reverseSort;

            this.effects = new Effects(config.effects);
        }

        sort() {
            if (!this.sortKey) return;
            let r = this.reverseSort ? -1 : 1;
            this.worldObjects.sort((a, b) => r*(a[this.sortKey] - b[this.sortKey]));
        }
    }

    export class PhysicsGroup {
        name: string;
        worldObjects: PhysicsWorldObject[];

        constructor(name: string, config: World.PhysicsGroupConfig) {
            this.name = name;
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
                debug(`Cannot add object ${obj.name} to world because it aleady exists in another world! You must remove object from previous world first. World:`, world, 'Previous world:', obj.world);
                return undefined;
            }

            if (obj.name && world.hasWorldObject(obj.name)) {
                debug(`Cannot add object ${obj.name} to world because an object already exists with that name! World:`, world);
                return undefined;
            }

            /// @ts-ignore
            obj.internalAddWorldObjectToWorldWorldObject(world);
            /// @ts-ignore
            world.internalAddWorldObjectToWorldWorld(obj);

            for (let child of obj.children) {
                World.Actions.addWorldObjectToWorld(child, world);
            }

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
                debug(`Tried to remove object ${obj.name} from its containing world, but it does not belong to a world! Object:`, obj);
                return obj;
            }

            let world = obj.world;

            obj.onRemove();

            /// @ts-ignore
            obj.internalRemoveWorldObjectFromWorldWorldObject(world);
            /// @ts-ignore
            world.internalRemoveWorldObjectFromWorldWorld(obj);
            
            for (let child of obj.children) {
                World.Actions.removeWorldObjectFromWorld(child);
            }

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
            return objs.filter(obj => removeWorldObjectFromWorld(obj));
        }

        /**
         * Sets the name of a WorldObject. Returns the new name of the object.
         */
        export function setName(obj: WorldObject, name: string): string {
            if (!obj) return undefined;

            if (obj.world && obj.world.hasWorldObject(name)) {
                debug(`Cannot name object '${name}' as that name already exists in world!`, obj.world);
                return obj.name;
            }

            /// @ts-ignore
            obj.internalSetNameWorldObject(name);

            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetNameWorld(obj, name);
            }

            return obj.name;
        }

        /**
         * Sets the layer of a WorldObject. Returns the new layer name of the object.
         */
        export function setLayer(obj: WorldObject, layerName: string): string {
            if (!obj) return undefined;

            if (obj.world && !obj.world.getLayerByName(layerName)) {
                debug(`Cannot set layer on object '${obj.name}' as no layer named ${layerName} exists in world!`, obj.world);
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
        export function setPhysicsGroup(obj: PhysicsWorldObject, physicsGroupName: string): string {
            if (!obj) return undefined;

            if (obj.world && !obj.world.getPhysicsGroupByName(physicsGroupName)) {
                debug(`Cannot set physicsGroup on object '${obj.name}' as no physicsGroup named ${physicsGroupName} exists in world!`, obj.world);
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
                debug(`Cannot add child ${child.name} to parent ${obj.name} becase the child is already the child of another parent!`, child.parent);
                return undefined;
            }

            if (child.world && child.world !== obj.world) {
                debug(`Cannot add child ${child.name} to parent ${obj.name} becase the child exists in a different world!`, child.world);
                return undefined;
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
            // Protect against iterating against the same list you're removing from.
            if (children[0].parent && children === children[0].parent.children) children = A.clone(<T[]>children);
            return children.filter(child => removeChildFromParent(child));
        }
    }
}