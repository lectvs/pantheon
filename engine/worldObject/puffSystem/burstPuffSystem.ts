/// <reference path="./puffSystem.ts" />

namespace BurstPuffSystem {
    export type Config = WorldObject.Config<BurstPuffSystem> & {
        deleteOnComplete?: boolean;
        puffCount: number;
        puffConfigFactory: Factory<PuffSystem.PuffConfig>;
    }
}

class BurstPuffSystem extends PuffSystem {
    private deleteOnComplete: boolean;
    private puffCount: number;
    private puffConfigFactory: Factory<PuffSystem.PuffConfig>;

    constructor(config: BurstPuffSystem.Config) {
        super(config);

        this.deleteOnComplete = config.deleteOnComplete ?? true;
        this.puffCount = config.puffCount;
        this.puffConfigFactory = config.puffConfigFactory;
    }

    override onAdd(): void {
        super.onAdd();

        for (let i = 0; i < this.puffCount; i++) {
            this.addPuff(this.puffConfigFactory());
        }
    }

    override update() {
        super.update();

        if (this.deleteOnComplete && A.isEmpty(this.puffs)) {
            this.kill();
        }
    }
}