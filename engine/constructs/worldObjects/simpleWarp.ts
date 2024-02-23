namespace SimpleWarp {
    export type Config = WorldObject.Config<SimpleWarp> & {
        width: number;
        height: number;
        target: OrFactory<WorldObject | string>;
        toStage: Factory<World>;
        transition?: OrFactory<Transition | undefined>;
        isEnabled?: () => boolean;
    }
}

class SimpleWarp extends WorldObject {
    private bounds: Bounds;
    private target: OrFactory<WorldObject | string>;
    private toStage: Factory<World>;
    private transition: OrFactory<Transition | undefined>;
    private isEnabled: () => boolean;

    constructor(config: SimpleWarp.Config) {
        super(config);

        this.bounds = new RectBounds(0, 0, config.width, config.height, this);
        this.target = config.target;
        this.toStage = config.toStage;
        this.transition = config.transition;
        this.isEnabled = config.isEnabled ?? (() => true);
    }

    override update(): void {
        super.update();

        if (!this.isEnabled()) return;

        let target: WorldObject | string | undefined = OrFactory.resolve(this.target);
        if (St.isString(target)) target = this.world?.select.name(target, 'unchecked');
        if (!target) return;

        let isInBounds = this.bounds.containsPoint(target) || (target instanceof PhysicsWorldObject && target.isOverlapping(this.bounds));
        if (!isInBounds) return;
        
        global.theater.loadStage(this.toStage, OrFactory.resolve(this.transition));
    }
}