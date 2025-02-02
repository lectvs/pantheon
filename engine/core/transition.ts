/// <reference path="../worldObject/worldObject.ts"/>

namespace Transition {
    export type BaseConfig = {
        preTime?: number;
        postTime?: number;
        takeScreenshots?: boolean;
    }

    export type Snapshot = {
        texture: PIXI.RenderTexture;
        sprite: PIXI.Sprite;
    }

    export type SetDataProps = {
        oldWorld: World | undefined;
        newWorld: World | undefined;
        doNotPlayWorldMusic: boolean | undefined;
    }
}

abstract class Transition {
    protected oldWorld?: World;
    protected newWorld?: World;
    doNotPlayWorldMusic?: boolean;

    protected oldScreenshot?: Transition.Snapshot;
    protected newScreenshot?: Transition.Snapshot;

    protected preTime: number;
    protected postTime: number;
    protected takeScreenshots: boolean;

    protected script: Script | undefined;

    get done() { return !this.script || this.script.isDone; }

    constructor(config: Transition.BaseConfig) {
        this.preTime = config.preTime ?? 0;
        this.postTime = config.postTime ?? 0;
        this.takeScreenshots = config.takeScreenshots ?? true;
        this.script = undefined;
    }

    update(delta: number) {
        this.script?.update(delta);
    }

    abstract render(): Render.Result;

    setData(props: Transition.SetDataProps) {
        this.oldWorld = props.oldWorld;
        this.newWorld = props.newWorld;
        this.doNotPlayWorldMusic = props.doNotPlayWorldMusic;

        if (this.takeScreenshots) {
            if (this.oldWorld) {
                let oldWorldScreenshot = this.oldWorld.takeScreenshot();
                let oldWorldSprite = new PIXI.Sprite(oldWorldScreenshot.texture);
                oldWorldSprite.scale.set(1 / oldWorldScreenshot.upscale);
                this.oldScreenshot = {
                    texture: oldWorldScreenshot.texture,
                    sprite: oldWorldSprite,
                };
            }
            if (this.newWorld) {
                let newWorldScreenshot = this.newWorld.takeScreenshot();
                let newWorldSprite = new PIXI.Sprite(newWorldScreenshot.texture);
                newWorldSprite.scale.set(1 / newWorldScreenshot.upscale);
                this.newScreenshot = {
                    texture: newWorldScreenshot.texture,
                    sprite: newWorldSprite,
                };
            }
        }
    }

    free() {
        if (this.oldScreenshot) freePixiRenderTexture(this.oldScreenshot.texture);
        if (this.newScreenshot) freePixiRenderTexture(this.newScreenshot.texture);
    }
}
