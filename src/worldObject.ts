namespace WorldObject {
    export type Config = {
        parent?: SomeWorldObjectConfig;
        constructor?: any;
        name?: string;
        layer?: string;
        physicsGroup?: string;
        x?: number;
        y?: number;
        visible?: boolean;
        active?: boolean;
        ignoreCamera?: boolean;
        data?: any;
        controllable?: boolean;
    }
}

class WorldObject {
    x: number;
    y: number;
    visible: boolean;
    active: boolean;
    ignoreCamera: boolean;
    data: any;

    // World data
    private _world: World;
    private _name: string;
    private _layer: string;
    private _physicsGroup: string;

    get world() { return this._world; }
    get name() { return this._name; }
    get layer() { return this._layer; }
    get physicsGroup() { return this._physicsGroup; }
    //

    lastx: number;
    lasty: number;

    controllable: boolean;
    controller: Controller;
    protected controllerSchema: Controller.Schema;

    mask: Texture;

    private preRenderStoredX: number;
    private preRenderStoredY: number;

    get isControlled() { return this.controllable && !global.theater.isCutscenePlaying; }

    constructor(config: WorldObject.Config, defaults: WorldObject.Config = {}) {
        config = O.withDefaults(config, defaults);
        this.x = O.getOrDefault(config.x, 0);
        this.y = O.getOrDefault(config.y, 0);
        this.visible = O.getOrDefault(config.visible, true);
        this.active = O.getOrDefault(config.active, true);
        this.ignoreCamera = O.getOrDefault(config.ignoreCamera, false);
        this.data = _.clone(O.getOrDefault(config.data, {}));

        this.lastx = this.x;
        this.lasty = this.y;

        this.controllable = O.getOrDefault(config.controllable, false);
        this.controller = {};
        this.controllerSchema = {};

        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;

        this.internalSetNameWorldObject(config.name);
        this.internalSetLayerWorldObject(config.layer);
        this.internalSetPhysicsGroupWorldObject(config.physicsGroup);
    }

    preUpdate() {
        this.lastx = this.x;
        this.lasty = this.y;
        if (this.isControlled) {
            this.updateControllerFromSchema();
        }
    }

    update(delta: number) {
        
    }

    postUpdate() {
        this.resetController();
    }

    fullUpdate(delta: number) {
        this.preUpdate();
        this.update(delta);
        this.postUpdate();
    }

    preRender(world: World) {
        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;

        if (!this.ignoreCamera) {
            this.x -= world.camera.worldOffsetX;
            this.y -= world.camera.worldOffsetY;
        }

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }

    render(screen: Texture) {

    }

    postRender(world: World) {
        this.x = this.preRenderStoredX;
        this.y = this.preRenderStoredY;
    }

    fullRender(screen: Texture, world: World) {
        this.preRender(world);
        this.render(screen);
        this.postRender(world);
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

    onAdd(world: World) {

    }

    onRemove(world: World) {
        
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

    // For use with World.Actions.setLyer
    private internalSetLayerWorldObject(layer: string) {
        this._layer = layer;
    }

    // For use with World.Actions.setPhysicsGroup
    private internalSetPhysicsGroupWorldObject(physicsGroup: string) {
        this._physicsGroup = physicsGroup;
    }
}

namespace WorldObject {
    export function resolveConfig(config: SomeWorldObjectConfig): SomeWorldObjectConfig {
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
            } else {
                result[key] = config[key];
            }
        }

        return result;
    }

    export function fromConfig<T extends WorldObject>(config: SomeWorldObjectConfig): T {
        config = WorldObject.resolveConfig(config);
        if (!config.constructor) return null;

        return <T>new config.constructor(config);
    }
}