/// <reference path="./particleSystem.ts" />

namespace BurstParticleSystem {
    export type Config = ParticleSystem.Config<BurstParticleSystem> & {
        particleCount: number;
        particleConfigFactory: (i: number) => ParticleSystem.ParticleConfig;
    }
}

class BurstParticleSystem extends ParticleSystem {
    private particleCount: number;
    private particleConfigFactory: (i: number) => ParticleSystem.ParticleConfig;

    constructor(config: BurstParticleSystem.Config) {
        super(config);

        this.particleCount = config.particleCount;
        this.particleConfigFactory = config.particleConfigFactory;
        this.killOnZeroParticles = config.killOnZeroParticles ?? true;  // Opposite normal particle system.
    }

    override onAdd(): void {
        super.onAdd();

        for (let i = 0; i < this.particleCount; i++) {
            this.addParticle(this.particleConfigFactory(this.particleI));
        }
    }
}