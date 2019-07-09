/// <reference path="./worldObject.ts" />

namespace World {
    export type Config = WorldObject.Config & {
        physicsGroups?: Dict<World.PhysicsGroupConfig>;
        collisionOrder?: CollisionConfig[];
        layers?: World.LayerConfig[];

        renderDirectly?: boolean;
        width?: number;
        height?: number;
    }

    export type CollisionConfig = {
        move: string | string[];
        from: string | string[];
        transferMomentum?: boolean;
    }

    export type LayerConfig = {
        name: string;
        sortKey?: string;
        reverseSort?: boolean;
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

    camera: Camera;
    private scriptManager: ScriptManager;
    private renderTexture: PIXIRenderTextureSprite;

    debugMoveCameraWithArrows: boolean;

    get renderingDirectly() { return !this.renderTexture; }

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

        this.camera = new Camera(this.width, this.height);
        this.scriptManager = new ScriptManager();

        if (!config.renderDirectly) {
            this.renderTexture = new PIXIRenderTextureSprite(this.width, this.height);
        }

        this.debugMoveCameraWithArrows = false;
    }

    update(options: UpdateOptions) {
        this.updateControllers();
        super.update(options);

        let thisOptions = O.withOverrides(options, {
            world: this,
        });

        this.scriptManager.update(thisOptions);

        for (let worldObject of this.worldObjects) {
            worldObject.update(thisOptions);
        }

        this.handleCollisions();

        this.camera.update(thisOptions);
        if (DEBUG_MOVE_CAMERA_WITH_ARROWS && this.debugMoveCameraWithArrows) {
            if (Input.isDown('left'))  (this.camera.x -= 1) && this.camera.setModeFocus(this.camera.x, this.camera.y);
            if (Input.isDown('right')) (this.camera.x += 1) && this.camera.setModeFocus(this.camera.x, this.camera.y);
            if (Input.isDown('up'))    (this.camera.y -= 1) && this.camera.setModeFocus(this.camera.x, this.camera.y);
            if (Input.isDown('down'))  (this.camera.y += 1) && this.camera.setModeFocus(this.camera.x, this.camera.y);
        }
    }

    render(options: RenderOptions) {
        if (this.renderingDirectly) {
            this.renderWorld(options);
        } else {
            this.renderTexture.clear(options.renderer);
            this.renderWorld(O.withOverrides(options, {
                renderTexture: this.renderTexture.renderTexture,
            }));
            options.renderer.render(this.renderTexture, options.renderTexture, false, options.matrix);
        }
        super.render(options);
    }

    renderWorld(options: RenderOptions) {
        let cameraMatrix = this.camera.rendererMatrix;
        options.matrix.translate(cameraMatrix.tx, cameraMatrix.ty);
        for (let layer of this.layers) {
            layer.sort();
            for (let worldObject of layer.worldObjects) {
                if (worldObject.visible) {
                    worldObject.render(options);
                }
            }
        }
        options.matrix.translate(-cameraMatrix.tx, -cameraMatrix.ty);
    }
    
    addWorldObject<T extends WorldObject>(obj: T) {
        this.worldObjects.push(obj);
        this.setLayer(obj, World.DEFAULT_LAYER);
        return obj;
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

    private updateControllers() {
        let inControl = Main.theater.inControl.map(name => this.worldObjectsByName[name]);
        for (let worldObject of this.worldObjects) {
            if (_.contains(inControl, worldObject)) {
                worldObject.updateController();
            } else {
                worldObject.resetController();
            }
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

        constructor(name: string, config: World.LayerConfig) {
            this.name = name;
            this.worldObjects = [];
            this.sortKey = config.sortKey;
            this.reverseSort = config.reverseSort;
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