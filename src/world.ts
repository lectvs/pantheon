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
}

class World extends WorldObject {
    width: number;
    height: number;
    worldObjects: WorldObject[];

    physicsGroups: Dict<World.PhysicsGroup>;
    collisionOrder: World.CollisionConfig[];
    worldObjectsByName: Dict<WorldObject>;
    layers: World.Layer[];

    backgroundColor: number;
    backgroundAlpha: number;

    camera: Camera;
    private scriptManager: ScriptManager;
    private screen: Texture;
    private layerTexture: Texture;

    private debugCameraX: number;
    private debugCameraY: number;

    constructor(config: World.Config, defaults: World.Config = {}) {
        config = O.withDefaults(config, defaults);
        super(config);

        this.width = O.getOrDefault(config.width, Main.width);
        this.height = O.getOrDefault(config.width, Main.height);
        this.worldObjects = [];

        this.physicsGroups = this.createPhysicsGroups(config.physicsGroups);
        this.collisionOrder = O.getOrDefault(config.collisionOrder, []);
        this.worldObjectsByName = {};
        this.layers = this.createLayers(config.layers);

        this.backgroundColor = O.getOrDefault(config.backgroundColor, Main.backgroundColor);
        this.backgroundAlpha = O.getOrDefault(config.backgroundAlpha, 1);

        let cameraConfig = O.getOrDefault(config.camera, {});
        _.defaults(cameraConfig, {
            width: this.width,
            height: this.height,
        });
        this.camera = new Camera(cameraConfig);

        this.scriptManager = new ScriptManager();

        this.screen = new Texture(this.width, this.height);
        this.layerTexture = new Texture(this.width, this.height);

        this.debugCameraX = 0;
        this.debugCameraY = 0;
    }

    update(delta: number) {
        super.update(delta);

        this.scriptManager.update(this, delta);
        

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

        if (DEBUG_MOVE_CAMERA_WITH_ARROWS && global.theater && this === global.theater.currentWorld) {
            if (Input.isDown('debugMoveCameraLeft'))  this.debugCameraX -= 1;
            if (Input.isDown('debugMoveCameraRight')) this.debugCameraX += 1;
            if (Input.isDown('debugMoveCameraUp'))    this.debugCameraY -= 1;
            if (Input.isDown('debugMoveCameraDown'))  this.debugCameraY += 1;
        }
        this.camera.update(this);
    }

    render(screen: Texture) {
        let oldCameraX = this.camera.x;
        let oldCameraY = this.camera.y;
        if (DEBUG_MOVE_CAMERA_WITH_ARROWS && global.theater && this === global.theater.currentWorld) {
            this.camera.x += this.debugCameraX;
            this.camera.y += this.debugCameraY;
        }

        // Render background color.
        Draw.brush.color = this.backgroundColor;
        Draw.brush.alpha = this.backgroundAlpha;
        Draw.fill(this.screen);

        for (let layer of this.layers) {
            this.layerTexture.clear();
            this.renderLayer(layer);
            this.screen.render(this.layerTexture);
        }

        this.camera.x = oldCameraX;
        this.camera.y = oldCameraY;
        
        screen.render(this.screen);
        super.render(screen);
    }

    renderLayer(layer: World.Layer) {
        layer.sort();
        for (let worldObject of layer.worldObjects) {
            if (worldObject.visible) {
                worldObject.fullRender(this.layerTexture, this);
            }
        }
    }

    containsWorldObject(obj: string | WorldObject) {
        if (_.isString(obj)) {
            return !!this.worldObjectsByName[obj];
        }
        return _.contains(this.worldObjects, obj);
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

    runScript(script: Script | Script.Function) {
        return this.scriptManager.runScript(script);
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
        export function addWorldObjectToWorld(obj: WorldObject, world: World): boolean {
            if (!obj) return false;

            if (obj.world) {
                debug(`Cannot add object ${obj.name} to world because it aleady exists in another world! You must remove object from previous world first. World:`, world, 'Previous world:', obj.world);
                return false;
            }

            if (obj.name && world.containsWorldObject(obj.name)) {
                debug(`Cannot add object ${obj.name} to world because an object already exists with that name! World:`, world);
                return false;
            }

            /// @ts-ignore
            obj.internalAddWorldObjectToWorldWorldObject(world);
            /// @ts-ignore
            world.internalAddWorldObjectToWorldWorld(obj);

            obj.onAdd(world);
            return true;
        }

        export function removeWorldObjectFromWorld(obj: WorldObject): boolean {
            if (!obj) return false;

            if (!obj.world) {
                debug(`Cannot remove object ${obj.name} from world because it does not belong to a world! Object:`, obj);
                return false;
            }

            let world = obj.world;

            /// @ts-ignore
            obj.internalRemoveWorldObjectFromWorldWorldObject(world);
            /// @ts-ignore
            world.internalRemoveWorldObjectFromWorldWorld(obj);
            
            obj.onRemove(world);
            return true;
        }

        export function setName(obj: WorldObject, name: string) {
            if (!obj) return false;

            if (obj.world && obj.world.containsWorldObject(name)) {
                debug(`Cannot name object '${name}' as that name already exists in world!`, obj.world);
                return false;
            }

            /// @ts-ignore
            obj.internalSetNameWorldObject(name);

            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetNameWorld(obj, name);
            }
        }

        export function setLayer(obj: WorldObject, layerName: string) {
            if (!obj) return false;

            if (obj.world && !obj.world.getLayerByName(layerName)) {
                debug(`Cannot set layer on object '${obj.name}' as no layer named ${layerName} exists in world!`, obj.world);
                return false;
            }

            /// @ts-ignore
            obj.internalSetLayerWorldObject(layerName);

            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetLayerWorld(obj, layerName);
            }
        }

        export function setPhysicsGroup(obj: PhysicsWorldObject, physicsGroupName: string) {
            if (!obj) return false;

            if (obj.world && !obj.world.getPhysicsGroupByName(physicsGroupName)) {
                debug(`Cannot set physicsGroup on object '${obj.name}' as no physicsGroup named ${physicsGroupName} exists in world!`, obj.world);
                return;
            }

            /// @ts-ignore
            obj.internalSetPhysicsGroupWorldObject(physicsGroupName);

            if (obj.world) {
                /// @ts-ignore
                obj.world.internalSetPhysicsGroupWorld(obj, physicsGroupName);
            }

            return true;
        }
    }
}