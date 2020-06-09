/// <reference path="texture.ts"/>

namespace Preload {
    export type Options = {
        textures?: Dict<Preload.Texture>;
        pyxelTilemaps?: Dict<Preload.PyxelTilemap>;
        spriteTextTags?: Dict<SpriteText.TagFunction>;
        onLoad?: Function;
    }

    export type Texture = {
        url?: string;
        defaultAnchor?: Pt;
        spritesheet?: TextureSpritesheet;
        frames?: Dict<TextureFrame>;
    } & TextureFrame;

    export type TextureFrame = {
        rect?: Rect;
        anchor?: Pt;
    }

    export type TextureSpritesheet = {
        frameWidth: number;
        frameHeight: number;
        prefix?: string;
        anchor?: Pt;
    }

    export type PyxelTilemap = {
        url?: string;
        tileset: Tilemap.Tileset;
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
}

class Preload {
    static preload(options: Preload.Options) {
        if (options.textures) {
            for (let key in options.textures) {
                this.preloadTexture(key, options.textures[key]);
            }
        }

        if (options.pyxelTilemaps) {
            for (let key in options.pyxelTilemaps) {
                this.preloadPyxelTilemap(key, options.pyxelTilemaps[key]);
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

        if (options.pyxelTilemaps) {
            for (let key in options.pyxelTilemaps) {
                this.loadPyxelTilemap(key, options.pyxelTilemaps[key]);
            }
        }

        if (options.spriteTextTags) {
            SpriteText.addTags(options.spriteTextTags);
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
        AssetCache.pixiTextures[key] = mainTexture;
        AssetCache.textures[key] = Texture.fromPixiTexture(mainTexture);

        let frames: Dict<Preload.TextureFrame> = {};

        if (texture.spritesheet) {
            let numFramesX = Math.floor(baseTexture.width / texture.spritesheet.frameWidth);
            let numFramesY = Math.floor(baseTexture.height / texture.spritesheet.frameHeight);

            for (let y = 0; y < numFramesY; y++) {
                for (let x = 0; x < numFramesX; x++) {
                    let frameKeyPrefix = O.getOrDefault(texture.spritesheet.prefix, `${key}_`);
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

        for (let frame in frames) {
            let frameTexture: PIXI.Texture = new PIXI.Texture(baseTexture);
            let rect = frames[frame].rect || texture.rect;
            let anchor = frames[frame].anchor || texture.defaultAnchor;
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

    static preloadPyxelTilemap(key: string, tilemap: Preload.PyxelTilemap) {
        let url = tilemap.url || `assets/${key}.json`;
        PIXI.Loader.shared.add(key + this.TILEMAP_KEY_SUFFIX, url);
    }

    static loadPyxelTilemap(key: string, tilemap: Preload.PyxelTilemap) {
        let tilemapJson: Preload.PyxelTilemapJson = PIXI.Loader.shared.resources[key + this.TILEMAP_KEY_SUFFIX].data;

        let tilemapForCache: Tilemap.Tilemap = {
            tileset: tilemap.tileset,
            layers: [],
        };
        for (let i = 0; i < tilemapJson.layers.length; i++) {
            let tilemapLayer: Tilemap.TilemapLayer = A.filledArray2D(tilemapJson.tileshigh, tilemapJson.tileswide);
            for (let tile of tilemapJson.layers[i].tiles) {
                tilemapLayer[tile.y][tile.x] = {
                    index: Math.max(tile.tile, -1),
                    angle: tile.rot * 90,
                    flipX: tile.flipX,
                };
            }
            tilemapForCache.layers.push(tilemapLayer);
        }
        AssetCache.tilemaps[key] = tilemapForCache;
    }

    private static TILEMAP_KEY_SUFFIX = '_tilemap_';
}

namespace Preload {
    export function allTilesWithPrefix(prefix: string, count: number = 1000) {
        let result: string[] = [];
        for (let i = 0; i < count; i++) {
            result.push(`${prefix}${i}`);
        }
        return result;
    }
}