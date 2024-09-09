namespace Puffs {
    export function smallBurst(x: number, y: number, layer: string, color: number) {
        return new BurstPuffSystem({
            x, y,
            layer,
            puffCount: 5,
            puffConfigFactory: () => ({
                maxLife: 0.5,
                radius: 2,
                finalRadius: 0,
                color: color,
                v: Random.inDisc(15, 40),
            }),
        });
    }

    export function mediumBurst(x: number, y: number, layer: string, color: number) {
        return new BurstPuffSystem({
            x, y,
            layer,
            puffCount: 12,
            puffConfigFactory: () => ({
                maxLife: 0.5,
                radius: 2,
                finalRadius: 0,
                color: color,
                v: Random.inDisc(20, 70),
            }),
        });
    }
}