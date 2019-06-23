namespace Script {
    export type Function = {
        generator: () => IterableIterator<any>;
        endState?: () => any;
    }
}

class Script {
    generator: IterableIterator<any>;
    endState: () => any;

    paused: boolean;
    done: boolean;

    constructor(scriptFunction: Script.Function) {
        this.generator = scriptFunction.generator();
        this.endState = scriptFunction.endState;
    }

    get running() {
        return !this.paused && !this.done;
    }

    update(delta: number, world?: World) {
        if (!this.running) return;

        S.global = {
            delta: delta,
            world: world,
            script: this,
        };

        let result = this.generator.next();
        if (result.done) {
            if (this.endState) this.endState();
            this.done = true;
        }
    }
}

namespace S {
    export var global: {
        delta: number;
        world: World;
        script: Script;
    }
}