namespace Script {
    export type Function = {
        generator: () => IterableIterator<any>;
        endState?: () => any;
        skippable?: boolean;
    }
}

class Script {
    generator: IterableIterator<any>;
    endState: () => any;
    skippable: boolean;

    paused: boolean;
    done: boolean;

    constructor(scriptFunction: Script.Function) {
        this.generator = scriptFunction.generator();
        this.endState = scriptFunction.endState;
        this.skippable = O.getOrDefault(scriptFunction.skippable, true);
    }

    get running() {
        return !this.paused && !this.done;
    }

    update(options: UpdateOptions) {
        if (!this.running) return;

        S.global.delta = options.delta;
        S.global.world = options.world;
        S.global.script = this;

        let result = this.generator.next();
        if (result.done) {
            if (this.endState) this.endState();
            this.done = true;
        }
    }

    finishImmediately(maxIters: number = Script.FINISH_IMMEDIATELY_MAX_ITERS) {
        let result = this.generator.next();
        for (let i = 0; i < maxIters && !result.done; i++) {
            result = this.generator.next();
        }
        if (this.endState) this.endState();
        this.done = true;
    }

    static FINISH_IMMEDIATELY_MAX_ITERS = 1000000;
}

namespace S {
    export var global: {
        delta: number;
        world: World;
        script: Script;
        getSprite: (name: string) => Sprite;
    } = {
        delta: undefined,
        world: undefined,
        script: undefined,
        getSprite: (name: string) => <Sprite>S.global.world.getWorldObjectByName(name),
    };
}