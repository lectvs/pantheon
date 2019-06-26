namespace WorldObject {
    export type Config = {
        x?: number;
        y?: number;
        visible?: boolean;
    }
}

abstract class WorldObject {
    x: number;
    y: number;
    visible: boolean;

    lastx: number;
    lasty: number;

    protected controller: Controller;
    protected controllerSchema: Controller.Schema;

    get mask(): Mask { return undefined; }
    set mask(value: Mask) { }

    constructor(config: WorldObject.Config, defaults: WorldObject.Config = {}) {
        config = O.withDefaults(config, defaults);
        this.x = O.getOrDefault(config.x, 0);
        this.y = O.getOrDefault(config.y, 0);
        this.visible = O.getOrDefault(config.visible, true);

        this.lastx = this.x;
        this.lasty = this.y;

        this.controller = {};
        this.controllerSchema = {};
    }

    update(options: UpdateOptions) {
        this.lastx = this.x;
        this.lasty = this.y;
    }

    render(opitons: RenderOptions) {

    }

    resetController() {
        for (let key in this.controller) {
            this.controller[key] = false;
        }
    }

    updateController() {
        for (let key in this.controllerSchema) {
            this.controller[key] = this.controllerSchema[key]();
        }
    }
}