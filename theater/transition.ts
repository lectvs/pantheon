/// <reference path="../worldObject/worldObject.ts"/>

namespace Transition {
    export type BaseConfig = {
        preTime?: number;
        postTime?: number;
    }
}

abstract class Transition extends WorldObject {
    protected oldSnapshot: Texture;
    protected newSnapshot: Texture;

    protected preTime: number;
    protected postTime: number;

    done: boolean;

    constructor(config: Transition.BaseConfig) {
        super();
        this.preTime = config.preTime ?? 0;
        this.postTime = config.postTime ?? 0;
        this.done = false;
    }

    abstract start(): void;

    withSnapshots(oldSnapshot: Texture, newSnapshot: Texture) {
        this.oldSnapshot = oldSnapshot;
        this.newSnapshot = newSnapshot;
        return this;
    }
}
