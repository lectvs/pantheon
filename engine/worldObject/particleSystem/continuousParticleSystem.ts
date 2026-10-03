/// <reference path="./particleSystem.ts" />


namespace ContinuousParticleSystem {
    export type Config = ParticleSystem.Config<ContinuousParticleSystem> & {
        startEnabled?: boolean;
        startDelay?: number;
        particleRate: number;
        particleConfigFactory: (i: number) => ParticleSystem.ParticleConfig;
    }
}

class ContinuousParticleSystem extends ParticleSystem {
    enabled: boolean;

    private particleRate: number;
    private particleConfigFactory: (i: number) => ParticleSystem.ParticleConfig;

    private particleTimer: Timer;

    constructor(config: ContinuousParticleSystem.Config) {
        super(config);

        this.enabled = config.startEnabled ?? true;
        this.particleRate = config.particleRate;
        this.particleConfigFactory = config.particleConfigFactory;

        this.particleTimer = new Timer(1/this.particleRate, () => {
            if (this.enabled) {
                this.addParticle(this.particleConfigFactory(this.particleI));
            }
        }, Infinity);

        this.addTimer(new Timer(config.startDelay ?? 0, () => this.addTimer(this.particleTimer)));
    }

    warmUp(time: number) {
        let iters = 100;
        let delta = time / iters;

        let warmupTimer = new Timer(1/this.particleRate, () => {
            this.addParticle(this.particleConfigFactory(this.particleI));
        }, Infinity);

        for (let i = 0; i < iters; i++) {
            warmupTimer.update(delta);
            this.updateParticles(delta);
        }
    }

    setParticleRate(particleRate: number) {
        this.particleRate = particleRate;
        this.particleTimer.duration = this.particleRate === 0 ? Infinity : 1/this.particleRate;
        this.particleTimer.time = Math.min(this.particleTimer.time, this.particleTimer.duration);
    }
}