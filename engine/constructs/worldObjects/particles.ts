namespace Particles {
    export function smallBurst(x: number, y: number, color: number) {
        return new BurstParticleSystem({
            x, y,
            particleCount: 5,
            particleConfigFactory: () => ({
                maxLife: 0.5,
                stages: [{
                    v: Random.inDisc(15, 40),
                    radius: 2,
                    finalRadius: 0,
                    color: color,
                }],
            }),
        });
    }

    export function mediumBurst(x: number, y: number, color: number) {
        return new BurstParticleSystem({
            x, y,
            particleCount: 12,
            particleConfigFactory: () => ({
                maxLife: 0.5,
                stages: [{
                    v: Random.inDisc(20, 70),
                    radius: 2,
                    finalRadius: 0,
                    color: color,
                }],
            }),
        });
    }
}