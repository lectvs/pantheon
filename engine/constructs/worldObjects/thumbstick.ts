namespace Thumbstick {
    export type Config = {
        outerRadius: number;
        outerThickness: number;
        innerRadius: number;
        isDisabled: () => boolean;
    }
}

class Thumbstick extends WorldObject {
    private maxDragDistance: number;
    private isDisabled: () => boolean;

    private center: Vector2;

    private outlineRenderObject: PIXI.Graphics;
    private insideRenderObject: PIXI.Graphics;

    constructor(config: Thumbstick.Config) {
        super({
            alpha: 0.8,
            ignoreCamera: true,
            visible: false,
        });

        this.maxDragDistance = config.outerRadius;
        this.isDisabled = config.isDisabled;

        this.center = vec2(0, 0);

        this.outlineRenderObject = new PIXI.Graphics()
            .lineStyle(config.outerThickness, 0xFFFFFF, 1, 0)
            .beginFill(0, 0)
            .drawCircle(0, 0, config.outerRadius)
            .endFill();
        this.insideRenderObject = new PIXI.Graphics()
            .lineStyle(0, 0, 0)
            .beginFill(0xFFFFFF, 1)
            .drawCircle(0, 0, config.innerRadius)
            .endFill();
    }

    override update(): void {
        super.update();

        let inputDrag = Input.gestures.getDrag$();
        if (inputDrag && !this.isDisabled()) {
            this.x = inputDrag.start.x;
            this.y = inputDrag.start.y;
            this.center.set(inputDrag.d).clampMagnitude(this.maxDragDistance);
            this.setVisible(true);
        } else {
            this.setVisible(false);
        }
    }

    override render(): Render.Result {
        this.outlineRenderObject.x = 0;
        this.outlineRenderObject.y = 0;
        this.outlineRenderObject.alpha = this.alpha;

        this.insideRenderObject.x = this.center.x;
        this.insideRenderObject.y = this.center.y;
        this.insideRenderObject.alpha = this.alpha;

        let result: Render.Result = FrameCache.array(this.outlineRenderObject, this.insideRenderObject);
        result.pushAll(super.render());
        return result;
    }
}