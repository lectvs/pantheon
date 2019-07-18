namespace WorldObject {
    export type Config = {
        x?: number;
        y?: number;
        visible?: boolean;
        active?: boolean;
        data?: any;
    }
}

class WorldObject {
    x: number;
    y: number;
    visible: boolean;
    active: boolean;
    data: any;

    lastx: number;
    lasty: number;

    protected controller: Controller;
    protected controllerSchema: Controller.Schema;

    private preRenderStoredX: number;
    private preRenderStoredY: number;

    get mask(): Mask { return undefined; }
    set mask(value: Mask) { }

    constructor(config: WorldObject.Config, defaults: WorldObject.Config = {}) {
        config = O.withDefaults(config, defaults);
        this.x = O.getOrDefault(config.x, 0);
        this.y = O.getOrDefault(config.y, 0);
        this.visible = O.getOrDefault(config.visible, true);
        this.active = O.getOrDefault(config.active, true);
        this.data = _.clone(O.getOrDefault(config.data, {}));

        this.lastx = this.x;
        this.lasty = this.y;

        this.controller = {};
        this.controllerSchema = {};

        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;
    }

    preUpdate(options: UpdateOptions) {
        this.lastx = this.x;
        this.lasty = this.y;
    }

    update(options: UpdateOptions) {
        
    }

    postUpdate(options: UpdateOptions) {
        
    }

    preRender(options: RenderOptions) {
        this.preRenderStoredX = this.x;
        this.preRenderStoredY = this.y;
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }

    render(options: RenderOptions) {

    }

    postRender(options: RenderOptions) {
        this.x = this.preRenderStoredX;
        this.y = this.preRenderStoredY;
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

    onAdd(world: World) {

    }

    onRemove(world: World) {
        
    }
}