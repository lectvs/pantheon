namespace SimpleWarp {
    export type Config = WorldObject.Config<SimpleWarp> & {
        width: number;
        height: number;
        target: OrFactory<WorldObject | string>;
        toStage: Factory<World>;
        transitionProps?: OrFactory<StageManager.StageTransitionProps | undefined>;
        isEnabled?: () => boolean;
    }
}

class SimpleWarp extends WorldObject {
    private bounds: Bounds;
    private target: OrFactory<WorldObject | string>;
    private toStage: Factory<World>;
    private transitionProps: OrFactory<StageManager.StageTransitionProps | undefined>;
    private isEnabled: () => boolean;

    constructor(config: SimpleWarp.Config) {
        super(config);

        this.bounds = new RectBounds(0, 0, config.width, config.height, this);
        this.target = config.target;
        this.toStage = config.toStage;
        this.transitionProps = config.transitionProps;
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
        
        global.game.stageManager.load(this.toStage, OrFactory.resolve(this.transitionProps));
    }
}