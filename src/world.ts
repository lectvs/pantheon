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

    debugMoveCameraWithArrows: boolean;
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

        this.debugMoveCameraWithArrows = false;
        this.debugCameraX = 0;
        this.debugCameraY = 0;
    }

    update() {
        super.update();

        global.pushWorld(this);
        for (let worldObject of this.worldObjects) {
            worldObject.resetController();
        }

        this.scriptManager.update();
        

        for (let worldObject of this.worldObjects) {
            if (worldObject.active) worldObject.preUpdate();
        }

        for (let worldObject of this.worldObjects) {
            if (worldObject.active) worldObject.update();
        }

        this.handleCollisions();

        for (let worldObject of this.worldObjects) {
            if (worldObject.active) worldObject.postUpdate();
        }

        if (DEBUG_MOVE_CAMERA_WITH_ARROWS && this.debugMoveCameraWithArrows) {
            if (Input.isDown('debugMoveCameraLeft'))  this.debugCameraX -= 1;
            if (Input.isDown('debugMoveCameraRight')) this.debugCameraX += 1;
            if (Input.isDown('debugMoveCameraUp'))    this.debugCameraY -= 1;
            if (Input.isDown('debugMoveCameraDown'))  this.debugCameraY += 1;
        }
        this.camera.update();
        global.popWorld();
    }

    render() {
        let oldCameraX = this.camera.x;
        let oldCameraY = this.camera.y;
        if (DEBUG_MOVE_CAMERA_WITH_ARROWS && this.debugMoveCameraWithArrows) {
            this.camera.x += this.debugCameraX;
            this.camera.y += this.debugCameraY;
        }

        // Render background color.
        Draw.brush.color = this.backgroundColor;
        Draw.brush.alpha = this.backgroundAlpha;
        Draw.fill(this.screen);

        global.pushScreen(this.screen);
        global.pushWorld(this);
        for (let layer of this.layers) {
            this.layerTexture.clear();
            global.pushScreen(this.layerTexture);
            this.renderLayer(layer);
            global.popScreen();
            global.screen.render(this.layerTexture);
        }
        global.popWorld();
        global.popScreen();

        this.camera.x = oldCameraX;
        this.camera.y = oldCameraY;
        
        global.screen.render(this.screen);
        super.render();
    }

    renderLayer(layer: World.Layer) {
        layer.sort();
        for (let worldObject of layer.worldObjects) {
            if (worldObject.visible) {
                worldObject.fullRender();
            }
        }
    }
    
    addWorldObject<T extends WorldObject>(obj: T, options?: { name?: string, layer?: string, physicsGroup?: string }) {
        if (!obj) return obj;
        this.worldObjects.push(obj);

        if (!options) options = {};

        if (options.name) {
            this.setName(obj, options.name);
        }

        if (options.layer) {
            this.setLayer(obj, options.layer);
        } else {
            this.setLayer(obj, World.DEFAULT_LAYER);
        }

        if (options.physicsGroup && obj instanceof PhysicsWorldObject) {
            this.setPhysicsGroup(obj, options.physicsGroup);
        }
        
        global.pushWorld(this);
        obj.onAdd();
        global.popWorld();
        return obj;
    }

    getLayer(obj: string | WorldObject) {
        if (_.isString(obj)) obj = this.getWorldObjectByName(obj);
        for (let layer of this.layers) {
            if (_.contains(layer.worldObjects, obj)) return layer.name;
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

    getWorldMouseX() {
        return Input.mouseX + Math.floor(this.camera.x - this.camera.width/2);
    }

    getWorldMouseY() {
        return Input.mouseY + Math.floor(this.camera.y - this.camera.height/2);
    }

    getWorldObjectByName(name: string) {
        if (!this.worldObjectsByName[name]) {
            debug(`No object with name '${name}' exists in world`, this);
        }
        return this.worldObjectsByName[name];
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

    removeName(obj: WorldObject) {
        for (let name in this.worldObjectsByName) {
            if (this.worldObjectsByName[name] === obj) {
                delete this.worldObjectsByName[name];
            }
        }
    }

    removeFromAllLayers(obj: WorldObject) {
        for (let layer of this.layers) {
            A.removeAll(layer.worldObjects, obj);
        }
    }

    removeFromAllPhysicsGroups(obj: WorldObject) {
        for (let name in this.physicsGroups) {
            A.removeAll(this.physicsGroups[name].worldObjects, obj);
        }
    }

    removeWorldObject(obj: WorldObject) {
        this.removeFromAllLayers(obj);
        this.removeFromAllPhysicsGroups(obj);
        A.removeAll(this.worldObjects, obj);
        global.pushWorld(this);
        obj.onRemove();
        global.popWorld();
    }

    runScript(script: Script | Script.Function) {
        return this.scriptManager.runScript(script);
    }

    setName(obj: WorldObject, name: string) {
        if (this.worldObjectsByName[name] && this.worldObjectsByName[name] !== obj) {
            debug(`Cannot name object '${name}' as that name aleady exists in world`, this);
            return;
        }
        this.removeName(obj);
        this.worldObjectsByName[name] = obj;
    }

    setLayer(obj: WorldObject, name: string = World.DEFAULT_LAYER) {
        this.removeFromAllLayers(obj);

        for (let layer of this.layers) {
            if (layer.name === name) {
                layer.worldObjects.push(obj);
                return;
            }
        }

        debug(`Layer '${name}' does not exist in world`, this);
    }

    setPhysicsGroup(obj: PhysicsWorldObject, name: string) {
        this.removeFromAllPhysicsGroups(obj);

        let physicsGroup = this.physicsGroups[name];
        if (!physicsGroup) {
            debug(`PhysicsGroup '${name}' does not exist in world`, this);
            return;
        }

        physicsGroup.worldObjects.push(obj);
    }

    takeSnapshot() {
        let screen = new Texture(this.camera.width, this.camera.height);
        global.pushScreen(screen);
        let lastx = this.x;
        let lasty = this.y;
        this.x = 0;
        this.y = 0;
        this.render();
        this.x = lastx;
        this.y = lasty;
        global.popScreen();
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
}