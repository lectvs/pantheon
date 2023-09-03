namespace Preload {
    export type Options = {
        textures: Dict<Preload.Texture>;
        sounds: Dict<Preload.Sound>;
        tilesets: Dict<Preload.Tileset>;
        pyxelTilemaps: Dict<Preload.PyxelTilemap>;
        fonts: Dict<Preload.Font>;
        custom: Dict<Preload.CustomResource>;
        progressCallback: (progress: number) => any;
        onLoad: () => void;
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
        customCharacters?: Dict<string>;
    }

    export type CustomResource = {
        load: () => void;
    }
}

class Preload {
    static assetUrlOverrides: Dict<string> = {};

    private static loaderSystem: LoaderSystem;

    static preload(options: Preload.Options) {
        let loaders: Loader[] = [];

        for (let key in options.textures) {
            if (this.isLciImage(options.textures[key].url)) {
                loaders.push(new LciLoader(key, options.textures[key]));
            } else {
                loaders.push(new TextureLoader(key, options.textures[key]));
            }
        }

        for (let key in options.sounds) {
            loaders.push(new SoundLoader(key, options.sounds[key]));
        }

        for (let key in options.tilesets) {
            loaders.push(new TilesetLoader(key, options.tilesets[key]));
        }

        for (let key in options.pyxelTilemaps) {
            loaders.push(new PyxelTilemapLoader(key, options.pyxelTilemaps[key]));
        }

        for (let key in options.fonts) {
            loaders.push(new FontLoader(key, options.fonts[key]));
        }

        for (let key in options.custom) {
            loaders.push(new CustomResourceLoader(options.custom[key].load));
        }

        this.loaderSystem = new LoaderSystem(loaders);
        this.loaderSystem.load(options.progressCallback, options.onLoad);
    }

    private static isLciImage(url: string) {
        if (!url) return false;
        return url.endsWith('.lci') || url.startsWith('data:image/lci;');
    }

    static getAssetUrl(key: string, url: string | undefined, defaultExtension: string) {
        let baseUrl = url || `${key}.${defaultExtension}`;
        let overridenUrl = this.assetUrlOverrides[baseUrl] || baseUrl;
        if (overridenUrl.startsWith('data:')) return overridenUrl;

        return Main.getRootPath() + 'assets/' + overridenUrl;
    }
}
