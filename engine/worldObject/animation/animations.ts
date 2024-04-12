namespace Animations {
    export type EmptyConfig = AnimationInstance.Config & {};

    export function empty(config: EmptyConfig = {}) {
        return new AnimationInstance.EmptyAnimation(config);
    }

    export type CompositeConfig = AnimationInstance.Config & {
        animations: AnimationInstance[];
    }

    export function composite(config: CompositeConfig) {
        return new AnimationInstance.CompositeAnimation({
            animations: config.animations,
            priority: config.priority,
            nextRef: config.nextRef,
            variantOf: config.variantOf,
        });
    }

    export type FromSingleTextureConfig = AnimationInstance.Config & {
        texture: string | PIXI.Texture;
        duration?: number;
        callback?: () => any;
    }

    export function fromSingleTexture(config: FromSingleTextureConfig): AnimationInstance.TextureAnimation {
        return new AnimationInstance.TextureAnimation({
            frames: [{
                duration: config.duration ?? Infinity,
                texture: config.texture,
                callback: config.callback,
            }],
            count: 1,
            priority: config.priority,
            nextRef: config.nextRef,
            variantOf: config.variantOf,
        });
    }

    export type FromTextureListConfig = AnimationInstance.Config & {
        textureRoot?: string;
        textures: (string | PIXI.Texture | number)[];
        frameRate: number;
        count?: number;
        overrides?: {[frame: number]: AnimationInstance.TextureAnimationFrame};
    }

    export function fromTextureList(config: FromTextureListConfig): AnimationInstance.TextureAnimation {
        let texturePrefix = !config.textureRoot ? "" : `${config.textureRoot}/`;
        let duration = 1 / config.frameRate;

        let frames: AnimationInstance.TextureAnimationFrame[] = config.textures.map(texture => ({
            texture: (St.isString(texture) || M.isNumber(texture)) ? `${texturePrefix}${texture}` : texture,
            duration,
        }));

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
            variantOf: config.variantOf,
        });
    }

    export type FromScriptConfig = AnimationInstance.Config & {
        script: () => Script.Function;
        count?: number;
        onReset?: () => any;
    }

    export function fromScript(config: FromScriptConfig) {
        return new AnimationInstance.ScriptAnimation({
            script: config.script,
            count: config.count ?? 1,
            onReset: config.onReset,
            priority: config.priority,
            nextRef: config.nextRef,
            variantOf: config.variantOf,
        });
    }
}
