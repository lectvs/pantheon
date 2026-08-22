/// <reference path="../worldObject/worldObject.ts"/>

namespace Transition {
    export type BaseConfig = {
        preTime?: number;
        postTime?: number;
        isInstant?: boolean;
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

    protected _oldScreenshot?: Transition.Snapshot;
    protected _newScreenshot?: Transition.Snapshot;

    protected preTime: number;
    protected postTime: number;

    protected script: Script | undefined;

    get done() { return !this.script || this.script.isDone; }

    constructor(config: Transition.BaseConfig) {
        this.preTime = config.preTime ?? 0;
        this.postTime = config.postTime ?? 0;
        this.script = undefined;
    }

    update(delta: number) {
        this.script?.update(delta);
    }

    abstract render(): Render.Result;

    getOldWorldScreenshot() {
        return this._oldScreenshot;
    }

    getNewWorldScreenshot() {
        return this._newScreenshot;
    }

    setData(props: Transition.SetDataProps) {
        this.oldWorld = props.oldWorld;
        this.newWorld = props.newWorld;
        this.doNotPlayWorldMusic = props.doNotPlayWorldMusic;

        if (this.oldWorld) {
            let oldWorldScreenshot = this.oldWorld.takeScreenshot();
            let oldWorldSprite = new PIXI.Sprite(oldWorldScreenshot.texture);
            oldWorldSprite.scale.set(1 / oldWorldScreenshot.upscale);
            this._oldScreenshot = {
                texture: oldWorldScreenshot.texture,
                sprite: oldWorldSprite,
            };
        }
        if (this.newWorld) {
            let newWorldScreenshot = this.newWorld.takeScreenshot();
            let newWorldSprite = new PIXI.Sprite(newWorldScreenshot.texture);
            newWorldSprite.scale.set(1 / newWorldScreenshot.upscale);
            this._newScreenshot = {
                texture: newWorldScreenshot.texture,
                sprite: newWorldSprite,
            };
        }
    }

    free() {
        if (this._oldScreenshot) freePixiRenderTexture(this._oldScreenshot.texture);
        if (this._newScreenshot) freePixiRenderTexture(this._newScreenshot.texture);
    }
}
