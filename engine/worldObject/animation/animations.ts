namespace Animations {
    export type EmptyConfig = {
        priority?: number;
        nextRef?: string;
    }

    export function empty(config: EmptyConfig = {}) {
        return new AnimationInstance.EmptyAnimation(config.priority ?? 0, config.nextRef);
    }

    export type FromSingleTextureConfig = {
        texture: string | PIXI.Texture;
        duration?: number;
        callback?: () => any;
        priority?: number;
        nextRef?: string;
    }

    export function fromSingleTexture(config: FromSingleTextureConfig): AnimationInstance.TextureAnimation {
        return new AnimationInstance.TextureAnimation({
            frames: [{
                duration: config.duration ?? Infinity,
                texture: config.texture,
                callback: config.callback,
            }],
            count: 1,
            priority: config.priority ?? 0,
            nextRef: config.nextRef,
        });
    }

    export type FromTextureListConfig = {
        textureRoot?: string;
        textures: (string | PIXI.Texture | number)[];
        frameRate: number;
        count?: number;
        overrides?: {[frame: number]: AnimationInstance.TextureAnimationFrame};
        priority?: number;
        nextRef?: string;
    }

    export function fromTextureList(config: FromTextureListConfig): AnimationInstance.TextureAnimation {
        let texturePrefix = !config.textureRoot ? "" : `${config.textureRoot}/`;
        let duration = 1 / config.frameRate;

        let frames: AnimationInstance.TextureAnimationFrame[] = config.textures.map(texture => {
            return {
                texture: (St.isString(texture) || M.isNumber(texture)) ? `${texturePrefix}${texture}` : texture,
                duration,
            };
        });

        if (config.overrides) {
            for (let key in config.overrides) {
                let frame = parseInt(key);
                O.override(frames[frame], config.overrides[key]);
            }
        }

        return new AnimationInstance.TextureAnimation({
            frames,
            count: config.count ?? 1,
            priority: config.priority ?? 0,
            nextRef: config.nextRef,
        });
    }

    export type FromScriptConfig = {
        script: Script.Function;
        count?: number;
        onReset?: () => any;
        priority?: number;
        nextRef?: string;
    }

    export function fromScript(config: FromScriptConfig) {
        return new AnimationInstance.ScriptAnimation({
            script: config.script,
            count: config.count ?? 1,
            onReset: config.onReset,
            priority: config.priority ?? 0,
            nextRef: config.nextRef,
        });
    }
}
