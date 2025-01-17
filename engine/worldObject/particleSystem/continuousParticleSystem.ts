/// <reference path="./particleSystem.ts" />


namespace ContinuousParticleSystem {
    export type Config = WorldObject.Config<ContinuousParticleSystem> & {
        startEnabled?: boolean;
        startDelay?: number;
        particleRate: number;
        particleConfigFactory: Factory<ParticleSystem.ParticleConfig>;
    }
}

class ContinuousParticleSystem extends ParticleSystem {
    enabled: boolean;

    private particleRate: number;
    private particleConfigFactory: Factory<ParticleSystem.ParticleConfig>;

    constructor(config: ContinuousParticleSystem.Config) {
        super(config);

        this.enabled = config.startEnabled ?? true;
        this.particleRate = config.particleRate;
        this.particleConfigFactory = config.particleConfigFactory;

        let particleTimer = new Timer(1/this.particleRate, () => {
            if (this.enabled) {
                this.addParticle(this.particleConfigFactory());
            }
        }, Infinity);

        this.addTimer(new Timer(config.startDelay ?? 0, () => this.addTimer(particleTimer)));
    }

    warmUp(time: number) {
        let iters = 100;
        let delta = time / iters;

        let warmupTimer = new Timer(1/this.particleRate, () => {
            this.addParticle(this.particleConfigFactory());
        }, Infinity);

        for (let i = 0; i < iters; i++) {
            warmupTimer.update(delta);
            this.updateParticles(delta);
        }
    }
}