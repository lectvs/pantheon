/// <reference path="./particleSystem.ts" />

namespace BurstParticleSystem {
    export type Config = WorldObject.Config<BurstParticleSystem> & {
        deleteOnComplete?: boolean;
        particleCount: number;
        particleConfigFactory: Factory<ParticleSystem.ParticleConfig>;
    }
}

class BurstParticleSystem extends ParticleSystem {
    private deleteOnComplete: boolean;
    private particleCount: number;
    private particleConfigFactory: Factory<ParticleSystem.ParticleConfig>;

    constructor(config: BurstParticleSystem.Config) {
        super(config);

        this.deleteOnComplete = config.deleteOnComplete ?? true;
        this.particleCount = config.particleCount;
        this.particleConfigFactory = config.particleConfigFactory;
    }

    override onAdd(): void {
        super.onAdd();

        for (let i = 0; i < this.particleCount; i++) {
            this.addParticle(this.particleConfigFactory());
        }
    }

    override update() {
        super.update();

        if (this.deleteOnComplete && A.isEmpty(this.particles)) {
            this.kill();
        }
    }
}