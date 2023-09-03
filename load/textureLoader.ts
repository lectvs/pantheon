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
    }

    load(callback?: () => void) {
        let url = Preload.getAssetUrl(this.key, this.texture.url, 'png');
        this.pixiLoader = new PIXI.Loader();
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
        let anchor = this.texture.anchor;
        if (rect) {
            mainTexture.frame = new Rectangle(rect.x, rect.y, rect.width, rect.height);
        }
        if (anchor) {
            mainTexture.defaultAnchor = new Point(anchor.x, anchor.y);
        }
        AssetCache.pixiTextures[this.key] = mainTexture;
        AssetCache.textures[this.key] = Texture.fromPixiTexture(mainTexture);

        let frames = TextureLoader.getAllFrames(this.key, this.texture);

        for (let frame in frames) {
            let frameTexture: PIXI.Texture = new PIXI.Texture(baseTexture);
            let rect = frames[frame].rect || this.texture.rect;
            let anchor = frames[frame].anchor || this.texture.anchor;
            if (rect) {
                frameTexture.frame = new Rectangle(rect.x, rect.y, rect.width, rect.height);
            }
            if (anchor) {
                frameTexture.defaultAnchor = new Point(anchor.x, anchor.y);
            }
            AssetCache.pixiTextures[frame] = frameTexture;
            AssetCache.textures[frame] = Texture.fromPixiTexture(frameTexture);
        }
    }

    static getAllFrames(key: string, texture: Preload.Texture, width: number = AssetCache.textures[key].width, height: number = AssetCache.textures[key].height) {
        let frames: Dict<Preload.TextureFrame> = {};

        if (texture.spritesheet) {
            let numFramesX = Math.floor(width / texture.spritesheet.frameWidth);
            let numFramesY = Math.floor(height / texture.spritesheet.frameHeight);

            for (let y = 0; y < numFramesY; y++) {
                for (let x = 0; x < numFramesX; x++) {
                    let frameKeyPrefix = texture.spritesheet.prefix ?? `${key}/`;
                    let frameKey = `${frameKeyPrefix}${x + y*numFramesX}`;
                    frames[frameKey] = {
                        rect: {
                            x: x*texture.spritesheet.frameWidth,
                            y: y*texture.spritesheet.frameHeight,
                            width: texture.spritesheet.frameWidth,
                            height: texture.spritesheet.frameHeight
                        },
                        anchor: texture.spritesheet.anchor,
                    };
                }
            }
        }

        if (texture.frames) {
            for (let frame in texture.frames) {
                frames[frame] = texture.frames[frame];
            }
        }

        return frames;
    }
}