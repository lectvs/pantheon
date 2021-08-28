namespace Preload {
    export type Options = {
        textures: Dict<Preload.Texture>;
        sounds: Dict<Preload.Sound>;
        tilesets: Dict<Preload.Tileset>;
        pyxelTilemaps: Dict<Preload.PyxelTilemap>;
        fonts: Dict<Preload.Font>;
        progressCallback: (progress: number) => any;
        onLoad: Function;
    }

    export type Texture = {
        url?: string;
        spritesheet?: TextureSpritesheet;
        frames?: Dict<TextureFrame>;
    } & TextureFrame;

    export type TextureFrame = {
        rect?: Rect;
        anchor?: Vector2;
    }

    export type Sound = {
        url?: string;
        volume?: number;
        speed?: number;
    }

    export type TextureSpritesheet = {
        frameWidth: number;
        frameHeight: number;
        prefix?: string;
        anchor?: Vector2;
    }

    export type Tileset = {
        url?: string;
        tileWidth: number;
        tileHeight: number;
        collisionIndices: number[];
    }

    export type PyxelTilemap = {
        url?: string;
    }

    export type PyxelTilemapJson = {
        tilewidth: number;
        tileheight: number;
        tileswide: number;
        tileshigh: number;
        layers: {
            number: number;
            name: string;
            tiles: {
                x: number;
                y: number;
                index: number;
                tile: number;
                flipX: boolean;
                rot: number;
            }[];
        }[];
    }

    export type Font = {
        url?: string;
        charWidth: number;
        charHeight: number;
        spaceWidth: number;
        newlineHeight: number;
    }
}

class Preload {
    private static preloadOptions: Preload.Options;
    private static loaders: Loader[];

    static preload(options: Preload.Options) {
        this.preloadOptions = options;
        this.loaders = [];

        for (let key in options.textures) {
            this.load(new TextureLoader(key, options.textures[key]));
        }

        for (let key in options.sounds) {
            this.load(new SoundLoader(key, options.sounds[key]));
        }

        for (let key in options.tilesets) {
            this.load(new TilesetLoader(key, options.tilesets[key]));
        }

        for (let key in options.pyxelTilemaps) {
            this.load(new PyxelTilemapLoader(key, options.pyxelTilemaps[key]));
        }

        for (let key in options.fonts) {
            this.load(new FontLoader(key, options.fonts[key]));
        }
    }

    private static load(loader: Loader) {
        this.loaders.push(loader);
        loader.load(() => this.onLoaderLoad());
    }

    private static onLoaderLoad() {
        this.preloadOptions.progressCallback(this.getLoadProgress());
        if (this.isLoadComplete()) {
            this.preloadOptions.onLoad();
        }
    }

    private static getLoadProgress() {
        return A.sum(this.loaders, loader => loader.completionPercent) / this.loaders.length;
    }

    private static isLoadComplete() {
        return this.loaders.every(loader => loader.completionPercent >= 1);
    }
}
