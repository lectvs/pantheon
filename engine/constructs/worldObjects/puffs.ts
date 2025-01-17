namespace Particles {
    export function smallBurst(x: number, y: number, layer: string, color: number) {
        return new BurstParticleSystem({
            x, y,
            layer,
            particleCount: 5,
            particleConfigFactory: () => ({
                maxLife: 0.5,
                radius: 2,
                finalRadius: 0,
                color: color,
                v: Random.inDisc(15, 40),
            }),
        });
    }

    export function mediumBurst(x: number, y: number, layer: string, color: number) {
        return new BurstParticleSystem({
            x, y,
            layer,
            particleCount: 12,
            particleConfigFactory: () => ({
                maxLife: 0.5,
                radius: 2,
                finalRadius: 0,
                color: color,
                v: Random.inDisc(20, 70),
            }),
        });
    }
}