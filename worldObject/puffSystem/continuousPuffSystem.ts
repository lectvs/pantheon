/// <reference path="./puffSystem.ts" />


namespace ContinuousPuffSystem {
    export type Config = ReplaceConfigCallbacks<WorldObject.Config, ContinuousPuffSystem> & {
        startEnabled?: boolean;
        startDelay?: number;
        puffRate: number;
        puffConfigFactory: Factory<PuffSystem.PuffConfig>;
    }
}

class ContinuousPuffSystem extends PuffSystem {
    enabled: boolean;

    constructor(config: ContinuousPuffSystem.Config) {
        super(config);

        this.enabled = config.startEnabled ?? true;

        let puffTimer = new Timer(1/config.puffRate, () => {
            if (this.enabled) {
                this.addPuff(config.puffConfigFactory());
            }
        }, Infinity);

        this.addTimer(new Timer(config.startDelay ?? 0, () => this.addTimer(puffTimer)));
    }
}