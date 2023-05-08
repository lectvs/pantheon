/// <reference path="../worldObject/worldObject.ts"/>

namespace Transition {
    export type BaseConfig = {
        preTime?: number;
        postTime?: number;
    }
}

abstract class Transition extends WorldObject {
    protected oldWorld: World;
    protected newWorld: World;
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

    withData(oldWorld: World, newWorld: World) {
        this.oldWorld = oldWorld;
        this.newWorld = newWorld;
        return this;
    }

    takeWorldSnapshots() {
        this.oldSnapshot = this.oldWorld ? this.oldWorld.takeSnapshot() : Texture.filledRect(global.gameWidth, global.gameHeight, global.backgroundColor).clone('Transition.takeWorldSnapshots');
        this.newSnapshot = this.newWorld.takeSnapshot();
    }

    freeWorldSnapshots() {
        this.oldSnapshot?.free();
        this.newSnapshot?.free();
    }
}
