/// <reference path="./particleSystem.ts" />

namespace BurstParticleSystem {
    export type Config = ParticleSystem.Config<BurstParticleSystem> & {
        deleteOnComplete?: boolean;
        particleCount: number;
        particleConfigFactory: (i: number) => ParticleSystem.ParticleConfig;
    }
}

class BurstParticleSystem extends ParticleSystem {
    private deleteOnComplete: boolean;
    private particleCount: number;
    private particleConfigFactory: (i: number) => ParticleSystem.ParticleConfig;

    constructor(config: BurstParticleSystem.Config) {
        super(config);

        this.deleteOnComplete = config.deleteOnComplete ?? true;
        this.particleCount = config.particleCount;
        this.particleConfigFactory = config.particleConfigFactory;
    }

    override onAdd(): void {
        super.onAdd();

        for (let i = 0; i < this.particleCount; i++) {
            this.addParticle(this.particleConfigFactory(this.particleI));
        }
    }

    override update() {
        super.update();

        if (this.deleteOnComplete && A.isEmpty(this.particles)) {
            this.kill();
        }
    }
}