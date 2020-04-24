namespace WorldObject {
    export type Config = {
        parent?: WorldObject.Config;
        constructor?: any;
        name?: string;
        layer?: string;
        physicsGroup?: string;
        x?: number;
        y?: number;
        visible?: boolean;
        active?: boolean;
        life?: number;
        ignoreCamera?: boolean;
        data?: any;
        controllable?: boolean;
        children?: WorldObject.Config[];
        updateCallback?: UpdateCallback;
    }

    export type UpdateCallback = (delta: number, obj: WorldObject) => any;
}

class WorldObject {
    localx: number;
    localy: number;
    visible: boolean;
    active: boolean;
    life: Timer;
    ignoreCamera: boolean;
    data: any;

    get x() { return this.localx + (this.parent ? this.parent.x : 0); }
    get y() { return this.localy + (this.parent ? this.parent.y : 0); }
    set x(value: number) { this.localx = value - (this.parent ? this.parent.x : 0); }
    set y(value: number) { this.localy = value - (this.parent ? this.parent.y : 0); }

    // World data
    private _world: World;
    private _name: string;
    private _layer: string;
    private _physicsGroup: string;
    private _children: WorldObject[];
    private _parent: WorldObject;

    get world() { return this._world; }
    get name() { return this._name; }
    get layer() { return this._layer; }
    get physicsGroup() { return this._physicsGroup; }
    get children() { return <ReadonlyArray<WorldObject>>this._children; }
    get parent() { return this._parent; }
    //

    lastx: number;
    lasty: number;

    controllable: boolean;
    controller: Controller;
    protected controllerSchema: Controller.Schema;

    mask: Texture;

    private preRenderStoredX: number;
    private preRenderStoredY: number;

    private updateCallback: WorldObject.UpdateCallback;

    get isControlled() { return this.controllable && !global.theater.isCutscenePlaying; }

    constructor(config: WorldObject.Config, defaults: WorldObject.Config = {}) {
        config = O.withDefaults(config, defaults);
        this.localx = O.getOrDefault(config.x, 0);
        this.localy = O.getOrDefault(config.y, 0);
        this.visible = O.getOrDefault(config.visible, true);
        this.active = O.getOrDefault(config.active, true);
        this.life = new Timer(O.getOrDefault(config.life, Infinity), () => World.Actions.removeWorldObjectFromWorld(this));
        this.ignoreCamera = O.getOrDefault(config.ignoreCamera, false);
        this.data = _.clone(O.getOrDefault(config.data, {}));

        this.lastx = this.x;
        this.lasty = this.y;

        this.controllable = O.getOrDefault(config.controllable, false);
        this.controller = {};
        this.controllerSchema = {};

        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;

        this._world = null;
        this.internalSetNameWorldObject(config.name);
        this.internalSetLayerWorldObject(config.layer);
        this.internalSetPhysicsGroupWorldObject(config.physicsGroup);
        this._children = [];
        this._parent = null;

        if (!_.isEmpty(config.children)) {
            World.Actions.addChildrenToParent(config.children.map(WorldObject.fromConfig), this);
        }

        this.updateCallback = O.getOrDefault(config.updateCallback, (delta, obj) => null);
    }

    preUpdate() {
        this.lastx = this.x;
        this.lasty = this.y;
        if (this.isControlled) {
            this.updateControllerFromSchema();
        }
    }

    update(delta: number) {
        this.updateCallback(delta, this);
        this.life.update(delta);
    }

    postUpdate() {
        this.resetController();
    }

    fullUpdate(delta: number) {
        this.preUpdate();
        this.update(delta);
        this.postUpdate();
    }

    preRender() {
        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;

        if (!this.ignoreCamera) {
            this.x -= this.world.camera.worldOffsetX;
            this.y -= this.world.camera.worldOffsetY;
        }

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }

    render(screen: Texture) {

    }

    postRender() {
        this.x = this.preRenderStoredX;
        this.y = this.preRenderStoredY;
    }

    fullRender(screen: Texture) {
        this.preRender();
        this.render(screen);
        this.postRender();
    }

    resetController() {
        for (let key in this.controller) {
            this.controller[key] = false;
        }
    }

    updateControllerFromSchema() {
        for (let key in this.controllerSchema) {
            this.controller[key] = this.controllerSchema[key]();
        }
    }

    onAdd() {

    }

    onRemove() {
        
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

    // For use with World.Actions.setName
    private internalSetNameWorldObject(name: string) {
        this._name = name;
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
}

namespace WorldObject {
    export function resolveConfig(config: WorldObject.Config): WorldObject.Config {
        if (!config.parent) return _.clone(config);

        let result = WorldObject.resolveConfig(config.parent);

        for (let key in config) {
            if (key === 'parent') continue;
            if (!result[key]) {
                result[key] = config[key];
            } else if (key === 'animations') {
                result[key] = A.mergeArray(config[key], result[key], (e: Animation.Config) => e.name);
            } else if (key === 'data') {
                result[key] = O.withOverrides(result[key], config[key]);
            } else if (key === 'entryPoints') {
                result[key] = O.mergeObject(config[key], result[key]);
            } else if (key === 'worldObjects') {
                result[key] = A.mergeArray(config[key], result[key], (e: WorldObject.Config) => e.name,
                    (e: WorldObject.Config, into: WorldObject.Config) => {
                        e = WorldObject.resolveConfig(e);
                        e.parent = into;
                        return WorldObject.resolveConfig(e);
                    });
            } else if (key === 'layers') {
                // TODO: what does it mean to merge LayerConfig objects? what's the use case?
                result[key] = A.mergeArray(config[key], result[key], (e: World.LayerConfig) => e.name,
                    (e: World.LayerConfig, into: World.LayerConfig) => {
                        return O.mergeObject(e, into);
                    });
            } else {
                result[key] = config[key];
            }
        }

        return result;
    }

    export function fromConfig<T extends WorldObject>(config: WorldObject.Config): T {
        config = WorldObject.resolveConfig(config);
        if (!config.constructor) return null;

        return <T>new config.constructor(config);
    }
}