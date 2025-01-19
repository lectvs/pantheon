class TextureLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private texture: Preload.Texture;
    private pixiLoader: PIXI.Loader;

    constructor(key: string, texture: Preload.Texture) {
        this.key = key;
        this.texture = texture;
        this._completionPercent = 0;
        this.pixiLoader = new PIXI.Loader();
    }

    load(callback?: () => void) {
        let url = Preload.getAssetUrl(this.key, this.texture.url, 'png');
        this.pixiLoader.add(this.key, url);
        this.pixiLoader.load(() => {
            this.onLoad();
            this._completionPercent = 1;
            if (callback) callback();
        });
    }

    private onLoad() {
        let baseTexture: PIXI.BaseTexture = this.pixiLoader.resources[this.key].texture.baseTexture;
        if (!baseTexture) {
            console.error(`Failed to load texture ${this.key}`);
            return;
        }

        let mainTexture = new PIXI.Texture(baseTexture);
        let rect = this.texture.rect;
        let anchor = this.texture.anchor || Anchor.CENTER;
        if (rect) {
            mainTexture.frame = new PIXI.Rectangle(rect.x, rect.y, rect.width, rect.height);
        }
        mainTexture.defaultAnchor = new Point(anchor.x, anchor.y);
        AssetCache.textures[this.key] = mainTexture;

        TextureLoader.splitTextureInAssetCache(this.key, this.texture);
    }

    static splitTextureInAssetCache(key: string, texture: Preload.Texture) {
        let mainTexture = AssetCache.getTexture(key);
        if (!mainTexture) return;

        let frames = TextureLoader.getAllFrames(key, texture);

        for (let frame in frames) {
            let frameTexture: PIXI.Texture = new PIXI.Texture(mainTexture.baseTexture);
            let rect = frames[frame].rect || texture.rect;
            let anchor = frames[frame].anchor || texture.anchor || Anchor.CENTER;
            if (rect) {
                frameTexture.frame = new PIXI.Rectangle(rect.x, rect.y, rect.width, rect.height);
            }
            frameTexture.defaultAnchor.set(0, 0);
            let renderTexture = newPixiRenderTexture(frameTexture.width, frameTexture.height, 'TextureLoader');
            TextureUtils.render(frameTexture, renderTexture, {});
            renderTexture.defaultAnchor.set(anchor.x, anchor.y);
            TextureUtils.setImmutable(renderTexture);
            AssetCache.textures[frame] = renderTexture;
            frameTexture.destroy();
        }
    }

    static getAllFrames(key: string, texture: Preload.Texture) {
        let width = AssetCache.getTexture(key).width;
        let height = AssetCache.getTexture(key).height;
        let frames: Dict<Preload.TextureFrame> = {};

        if (texture.spritesheet) {
            let numFramesX = Math.floor(width / texture.spritesheet.width);
            let numFramesY = Math.floor(height / texture.spritesheet.height);

            for (let y = 0; y < numFramesY; y++) {
                for (let x = 0; x < numFramesX; x++) {
                    let frameKeyPrefix = texture.spritesheet.prefix ?? `${key}/`;
                    let frameKeyIndex = this.getFrameKeyIndex(texture, x, y, numFramesX);
                    let frameKey = `${frameKeyPrefix}${frameKeyIndex}`;
                    frames[frameKey] = {
                        rect: {
                            x: x*texture.spritesheet.width,
                            y: y*texture.spritesheet.height,
                            width: texture.spritesheet.width,
                            height: texture.spritesheet.height
                        },
                        anchor: texture.spritesheet.anchor,
                    };
                }
            }
        }

        if (texture.ninepatch) {
            for (let subrect of ['topleft', 'top', 'topright', 'left', 'center', 'right', 'bottomleft', 'bottom', 'bottomright']) {
                frames[`${key}/ninepatch/${subrect}`] = {
                    rect: this.getNinepatchSubRect(width, height, texture.ninepatch.innerRect, subrect),
                    anchor: Anchor.TOP_LEFT,
                };
            }
        }

        if (texture.frames) {
            for (let frame in texture.frames) {
                frames[frame] = texture.frames[frame];
            }
        }

        return frames;
    }

    private static getFrameKeyIndex(texture: Preload.Texture, x: number, y: number, numFramesX: number) {
        let index = x + y*numFramesX;
        if (!texture.spritesheet) return index;
        if (texture.spritesheet.naming === 'x/y') return `${x}/${y}`;
        if (texture.spritesheet.naming === 'y/x') return `${y}/${x}`;
        if (A.isArray(texture.spritesheet.naming) && index < texture.spritesheet.naming.length) return texture.spritesheet.naming[index];
        return index;
    }

    private static getNinepatchSubRect(textureWidth: number, textureHeight: number, innerRect: Rect, name: string) {
        let x = name.includes('left') ? 0 : (name.includes('right') ? innerRect.x + innerRect.width : innerRect.x);
        let y = name.includes('top') ? 0 : (name.includes('bottom') ? innerRect.y + innerRect.height : innerRect.y);
        let width = name.includes('left') ? innerRect.x : (name.includes('right') ? textureWidth - (innerRect.x + innerRect.width) : innerRect.width);
        let height = name.includes('top') ? innerRect.y : (name.includes('bottom') ? textureHeight - (innerRect.y + innerRect.height) : innerRect.height);
        return rect(x, y, width, height);
    }
}