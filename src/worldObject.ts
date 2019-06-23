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

    get mask(): Mask { return undefined; }
    set mask(value: Mask) { }

    constructor(config: WorldObject.Config, defaults: WorldObject.Config = {}) {
        config = O.withDefaults(config, defaults);
        this.x = O.getOrDefault(config.x, 0);
        this.y = O.getOrDefault(config.y, 0);
        this.visible = O.getOrDefault(config.visible, true);

        this.lastx = this.x;
        this.lasty = this.y;
    }

    update(delta: number, world?: World) {
        this.lastx = this.x;
        this.lasty = this.y;
    }

    render(renderer: PIXI.Renderer, renderTexture?: PIXI.RenderTexture) {

    }
}