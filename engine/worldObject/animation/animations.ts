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
        textures?: (string | PIXI.Texture | number)[];
        frameRate?: number;
        humanize?: number | boolean;
        count?: number;
        overrides?: {[frame: number]: AnimationInstance.TextureAnimationFrame};
    }

    export function fromTextureList(config: FromTextureListConfig): AnimationInstance.TextureAnimation {
        let texturePrefix = !config.textureRoot ? "" : `${config.textureRoot}/`;
        let frameRate = config.frameRate ?? 1;
        let textures = config.textures ?? [];

        let humanize = config.humanize === true ? 0.05 : (config.humanize || 0);
        frameRate *= Random.float(1 - humanize, 1 + humanize);
        let duration = 1 / frameRate;

        let frames: AnimationInstance.TextureAnimationFrame[] = textures.map(texture => ({
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

    export type FromTextureListDirectionalConfig = AnimationInstance.Config & {
        getDirection: () => Vector2;
        directions: PartialRecord<AnimationInstance.TextureAnimationDirection, FromTextureListConfig>;
        textureRoot?: string;
        textures?: (string | PIXI.Texture | number)[];
        frameRate?: number;
        count?: number;
        overrides?: {[frame: number]: AnimationInstance.TextureAnimationFrame};
    }

    export function fromTextureListDirectional(config: FromTextureListDirectionalConfig): AnimationInstance.TextureAnimationDirectional {
        let directions: PartialRecord<AnimationInstance.TextureAnimationDirection, AnimationInstance.TextureAnimation> = {};

        for (let key in config.directions) {
            let direction = key as AnimationInstance.TextureAnimationDirection;
            directions[direction] = fromTextureList(O.withDefaults(config.directions[direction], config));
        }

        return new AnimationInstance.TextureAnimationDirectional({
            getDirection: config.getDirection,
            directions: directions,
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
