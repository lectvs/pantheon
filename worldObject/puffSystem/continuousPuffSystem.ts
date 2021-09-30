/// <reference path="./puffSystem.ts" />


namespace ContinuousPuffSystem {
    export type Config = ReplaceConfigCallbacks<WorldObject.Config, ContinuousPuffSystem> & {
        startEnabled?: boolean;
        puffRate: number;
        puffConfigFactory: Factory<PuffSystem.PuffConfig>;
    }
}

class ContinuousPuffSystem extends PuffSystem {
    enabled: boolean;

    constructor(config: ContinuousPuffSystem.Config) {
        super(config);

        this.enabled = config.startEnabled ?? true;
        this.addTimer(new Timer(1/config.puffRate, () => {
            if (this.enabled) {
                this.addPuff(config.puffConfigFactory());
            }
        }, Infinity));
    }
}