/// <reference path="../worldObject/worldObject.ts"/>

namespace Transition {
    export type BaseConfig = {
        preTime?: number;
        postTime?: number;
    }

    export type Snapshot = {
        texture: PIXI.RenderTexture;
        sprite: PIXI.Sprite;
    }
}

abstract class Transition {
    protected oldWorld?: World;
    protected newWorld?: World;
    protected oldSnapshot?: Transition.Snapshot;
    protected newSnapshot?: Transition.Snapshot;

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

    abstract render(): RenderResult[];

    setData(oldWorld: World | undefined, newWorld: World | undefined) {
        this.oldWorld = oldWorld;
        this.newWorld = newWorld;

        if (this.oldWorld) {
            let oldWorldTexture = this.oldWorld.takeSnapshot();
            this.oldSnapshot = {
                texture: oldWorldTexture,
                sprite: new PIXI.Sprite(oldWorldTexture),
            };
        }
        if (this.newWorld) {
            let newWorldTexture = this.newWorld.takeSnapshot();
            this.newSnapshot = {
                texture: newWorldTexture,
                sprite: new PIXI.Sprite(newWorldTexture),
            };
        }
    }

    free() {
        if (this.oldSnapshot) freePixiRenderTexture(this.oldSnapshot.texture);
        if (this.newSnapshot) freePixiRenderTexture(this.newSnapshot.texture);
    }
}
