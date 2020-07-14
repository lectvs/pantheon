namespace Cheat {
    export type Config = Dict<Cheat>;

    export type Cheat = (...params: any[]) => any;
}

class Cheat {
    static init(config: Cheat.Config) {
        for (let cheat in config) {
            let fn = config[cheat];
            Object.defineProperty(this, cheat, {
                get: () => {
                    if (!Debug.CHEATS_ENABLED) return undefined;
                    return fn;
                }
            });
        }
    }
}
