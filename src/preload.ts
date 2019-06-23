namespace Preload {
    export type Options = {
        textures?: {[key: string]: Preload.Texture};
        onLoad?: Function;
    }

    export type Texture = {
        url?: string;
        frames?: {
            [key: string]: TextureFrame;
        }
    } & TextureFrame;

    export type TextureFrame = {
        rect?: Rect;
        anchor?: Pt;
    }
}

class Preload {
    static preload(options: Preload.Options) {
        if (options.textures) {
            for (let key in options.textures) {
                this.preloadTexture(key, options.textures[key]);
            }
        }

        PIXI.Loader.shared.load(() => this.load(options));
    }

    static load(options: Preload.Options) {
        if (options.textures) {
            for (let key in options.textures) {
                this.loadTexture(key, options.textures[key]);
            }
        }

        if (options.onLoad) {
            options.onLoad();
        }
    }

    static preloadTexture(key: string, texture: Preload.Texture) {
        let url = texture.url || `assets/${key}.png`;
        PIXI.Loader.shared.add(key, url);
    }

    static loadTexture(key: string, texture: Preload.Texture) {
        let baseTexture: PIXI.BaseTexture = PIXI.utils.TextureCache[key];

        let mainTexture = new PIXI.Texture(baseTexture);
        let rect = texture.rect;
        let anchor = texture.anchor;
        if (rect) {
            mainTexture.frame = new Rectangle(rect.x, rect.y, rect.width, rect.height);
        }
        if (anchor) {
            mainTexture.defaultAnchor = new Point(anchor.x, anchor.y);
        }
        AssetCache.textures[key] = mainTexture;

        if (texture.frames) {
            for (let frame in texture.frames) {
                let frameTexture: PIXI.Texture = new PIXI.Texture(baseTexture);
                let rect = texture.frames[frame].rect || texture.rect;
                let anchor = texture.frames[frame].anchor || texture.anchor;
                if (rect) {
                    frameTexture.frame = new Rectangle(rect.x, rect.y, rect.width, rect.height);
                }
                if (anchor) {
                    frameTexture.defaultAnchor = new Point(anchor.x, anchor.y);
                }
                AssetCache.textures[frame] = frameTexture;
            }
        }
    }
}

namespace Preload {
    export type SpritesheetConfig = {
        prefix: string;
        frameWidth: number;
        frameHeight: number;
        numFramesX: number;
        numFramesY: number;
    }

    export function spritesheet(config: SpritesheetConfig) {
        let result: {[name: string]: Preload.TextureFrame} = {};
        for (let x = 0; x < config.numFramesX; x++) {
            for (let y = 0; y < config.numFramesY; y++) {
                let name = `${config.prefix}${x + y*config.numFramesX}`;
                let frame: Preload.TextureFrame = {
                    rect: { x: x*config.frameWidth, y: y*config.frameHeight, width: config.frameWidth, height: config.frameHeight },
                };
                result[name] = frame;
            }
        }
        return result;
    }
}