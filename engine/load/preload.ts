namespace Preload {
    export type Options = {
        textures: Dict<Preload.Texture>;
        sounds: Dict<Preload.Sound>;
        tilesets: Dict<Preload.Tileset>;
        pyxelTilemaps: Dict<Preload.PyxelTilemap>;
        ldtkWorlds: Dict<Preload.LdtkWorld>;
        lciFiles: Dict<Preload.LciFile>;
        asepriteFiles: Dict<Preload.AsepriteFile>;
        pyxelFiles: Dict<Preload.PyxelFile>;
        textFiles: Dict<Preload.TextFile>;
        fonts: Dict<Preload.Font>;
        custom: Dict<Preload.CustomResource>;
        progressCallback: (progress: number) => any;
        onLoad: () => void;
        onError: (message: string) => void;
    }

    export type Texture = {
        url?: string;
        spritesheet?: TextureSpritesheet;
        ninepatch?: TextureNinepatch;
        frames?: Dict<TextureFrame>;
    } & TextureFrame;

    export type TextureFrame = {
        rect?: Rect;
        anchor?: Vector2;
    }

    export type TextureSpritesheet = {
        width: number;
        height: number;
        prefix?: string;
        anchor?: Vector2;
        naming?: 'index' | 'x/y' | 'y/x' | string[];
    }

    export type TextureNinepatch = {
        innerRect: Rect;
    }

    export type LciFile = {
        url?: string;
        spritesheet?: TextureSpritesheet;
        ninepatch?: TextureNinepatch;
        frames?: Dict<TextureFrame>;
    } & TextureFrame;

    export type AsepriteFile = {
        url?: string;
        anchor?: Vector2;
        // Array applies to all tilesets in the file, Dict applies per tileset ID.
        collisionIndices?: number[] | DictNumber<number[]>;
        after?: () => void;
    }

    export type PyxelFile = {
        url?: string;
        anchor?: Vector2;
    }

    export type Sound = {
        url?: string;
        volume?: number;
        speed?: number;
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

    export type LdtkWorld = {
        url?: string;
        solidEnumName: string;
    }

    export type TextFile = {
        url?: string;
    }

    export type Font = {
        url?: string;
        charWidth: number;
        charHeight: number;
        spaceWidth?: number;
        spaceBetweenLines?: number;
        blankLineHeight?: number;
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
            loaders.push(new TextureLoader(key, options.textures[key]));
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

        for (let key in options.ldtkWorlds) {
            loaders.push(new LdtkWorldLoader(key, options.ldtkWorlds[key]));
        }

        for (let key in options.lciFiles) {
            loaders.push(new LciLoader(key, options.lciFiles[key]));
        }

        for (let key in options.asepriteFiles) {
            loaders.push(new AsepriteLoader(key, options.asepriteFiles[key]));
        }

        for (let key in options.pyxelFiles) {
            loaders.push(new PyxelLoader(key, options.pyxelFiles[key]));
        }

        for (let key in options.textFiles) {
            loaders.push(new TextFileLoader(key, options.textFiles[key]));
        }

        for (let key in options.textFiles) {
            loaders.push(new TextFileLoader(key, options.textFiles[key]));
        }

        for (let key in options.fonts) {
            loaders.push(new FontLoader(key, options.fonts[key]));
        }

        for (let key in options.custom) {
            loaders.push(new CustomResourceLoader(key, options.custom[key].load));
        }

        this.loaderSystem = new LoaderSystem(loaders);
        this.loaderSystem.load(options.progressCallback, options.onLoad, options.onError);
    }

    static getAssetUrl(key: string, url: string | undefined, defaultExtension: string) {
        let baseUrl = url || `${key}.${defaultExtension}`;
        let overridenUrl = this.assetUrlOverrides[baseUrl] || baseUrl;
        if (overridenUrl.startsWith('data:')) return overridenUrl;

        return Main.getRootPath() + 'assets/' + overridenUrl;
    }
}
