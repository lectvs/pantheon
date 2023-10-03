/// <reference path="./puffSystem.ts" />

namespace BurstPuffSystem {
    export type Config = ReplaceConfigCallbacks<WorldObject.Config, ContinuousPuffSystem> & {
        deleteOnComplete?: boolean;
        puffCount: number;
        puffConfigFactory: Factory<PuffSystem.PuffConfig>;
    }
}

class BurstPuffSystem extends PuffSystem {
    private deleteOnComplete: boolean;

    constructor(config: BurstPuffSystem.Config) {
        super(config);

        this.deleteOnComplete = config.deleteOnComplete ?? true;

        for (let i = 0; i < config.puffCount; i++) {
            this.addPuff(config.puffConfigFactory());
        }
    }

    override update() {
        super.update();

        if (this.deleteOnComplete && A.isEmpty(this.puffs)) {
            this.kill();
        }
    }
}