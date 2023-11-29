/// <reference path="../worldObject/worldObject.ts"/>

namespace Transition {
    export type BaseConfig = {
        preTime?: number;
        postTime?: number;
    }
}

abstract class Transition {
    protected oldWorld?: World;
    protected newWorld?: World;
    protected oldSnapshot?: Texture;
    protected newSnapshot?: Texture;

    protected preTime: number;
    protected postTime: number;

    protected script: Script | undefined;

    get done() { return !this.script || this.script.done; }

    constructor(config: Transition.BaseConfig) {
        this.preTime = config.preTime ?? 0;
        this.postTime = config.postTime ?? 0;
        this.script = undefined;
    }

    update(delta: number) {
        this.script?.update(delta);
    }

    abstract compile(): CompileResult;
    abstract render(screen: Texture): void;

    setData(oldWorld: World | undefined, newWorld: World | undefined) {
        this.oldWorld = oldWorld;
        this.newWorld = newWorld;

        this.oldSnapshot = this.oldWorld ? this.oldWorld.takeSnapshot() : Texture.filledRect(global.gameWidth, global.gameHeight, global.backgroundColor).clone('Transition.takeWorldSnapshots');
        this.newSnapshot = this.newWorld?.takeSnapshot();
    }

    free() {
        this.oldSnapshot?.free();
        this.newSnapshot?.free();
    }
}
