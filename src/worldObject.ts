namespace WorldObject {
    export type Config = {
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
    }

    preUpdate() {
        this.lastx = this.x;
        this.lasty = this.y;
        if (this.isControlled) {
            this.updateControllerFromSchema();
        }
    }

    update() {
        
    }

    postUpdate() {
        
    }

    fullUpdate() {
        this.preUpdate();
        this.update();
        this.postUpdate();
    }

    preRender() {
        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;

        if (!this.ignoreCamera) {
            this.x -= global.world.camera.worldOffsetX;
            this.y -= global.world.camera.worldOffsetY;
        }

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }

    render() {

    }

    postRender() {
        this.x = this.preRenderStoredX;
        this.y = this.preRenderStoredY;
    }

    fullRender() {
        this.preRender();
        this.render();
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
}