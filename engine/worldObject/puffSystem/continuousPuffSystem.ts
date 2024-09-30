/// <reference path="./puffSystem.ts" />


namespace ContinuousPuffSystem {
    export type Config = WorldObject.Config<ContinuousPuffSystem> & {
        startEnabled?: boolean;
        startDelay?: number;
        puffRate: number;
        puffConfigFactory: Factory<PuffSystem.PuffConfig>;
    }
}

class ContinuousPuffSystem extends PuffSystem {
    enabled: boolean;

    private puffRate: number;
    private puffConfigFactory: Factory<PuffSystem.PuffConfig>;

    constructor(config: ContinuousPuffSystem.Config) {
        super(config);

        this.enabled = config.startEnabled ?? true;
        this.puffRate = config.puffRate;
        this.puffConfigFactory = config.puffConfigFactory;

        let puffTimer = new Timer(1/this.puffRate, () => {
            if (this.enabled) {
                this.addPuff(this.puffConfigFactory());
            }
        }, Infinity);

        this.addTimer(new Timer(config.startDelay ?? 0, () => this.addTimer(puffTimer)));
    }

    warmUp(time: number) {
        let iters = 100;
        let delta = time / iters;

        let warmupTimer = new Timer(1/this.puffRate, () => {
            this.addPuff(this.puffConfigFactory());
        }, Infinity);

        for (let i = 0; i < iters; i++) {
            warmupTimer.update(delta);
            this.updateParticles(delta);
        }
    }
}