type AsepriteFile = {
    width: number;
    height: number;
    colorDepth: AsepriteFile.ColorDepth;
    colorProfile: AsepriteFile.ColorProfile;
    userData?: AsepriteFile.UserData;
    palette: AsepriteFile.Palette;
    tilesets: AsepriteFile.Tileset[];
    layers: AsepriteFile.Layer[];
    frames: AsepriteFile.Frame[];
    slices: AsepriteFile.Slice[];
    tags: AsepriteFile.Tag[];
}

namespace AsepriteFile {
    export type ColorDepth = 32 | 16 | 8;
    export type ColorProfile = {
        type: 'none';
    } | {
        type: 'sRGB';
        specialFixedGamma?: number;
    } | {
        type: 'icc';
        profile: number[];
    }

    export type Palette = {
        colors: {
            r: number;
            g: number;
            b: number;
            a: number;
        }[];
    }

    export type Tileset = {
        id: number;
        name: string;
        tileWidth: number;
        tileHeight: number;
        emptyTileId: number;
        tiles: {
            imageData: Uint8Array;
            userData?: UserData;
        }[];
        userData?: UserData;
    }

    export type LayerBase = {
        name: string;
        /**
         * Child level in relation to previous layer. Base child level is 0.
         * e.g. If child levels are equal, they are siblings.
         * e.g. If this child level is one greater than previous, it is a child of the previous.
         */
        childLevel: number;
        blendMode: PIXI.BLEND_MODES;
        opacity: number;
        visible: boolean;
        userData?: UserData;
    }

    export type ImageLayer = LayerBase & {
        type: 'image';
    }

    export type GroupLayer = LayerBase & {
        type: 'group';
    }

    export type TilemapLayer = LayerBase & {
        type: 'tilemap';
        tilesetIndex: number;
    }

    export type Layer = ImageLayer | GroupLayer | TilemapLayer;

    export type Frame = {
        cels: Cel[];
    }

    export type Cel = {
        xPosition: number;
        yPosition: number;
        layerIndex: number;
        zIndex: number;
        opacity: number;
        celData: CelData;
        userData?: UserData;
    }

    export type CelData = {
        type: 'image';
        width: number;
        height: number;
        imageData: Uint8Array;
    } | {
        type: 'linked';
        linkedFrame: number;
    } | {
        type: 'tilemap';
        widthTiles: number;
        heightTiles: number;
        tiles: CelTile[];
    }

    export type CelTile = {
        id: number;
        flipX: boolean;
        flipY: boolean;
        flipDiagonal: boolean;
    }

    export type Tag = {
        name: string;
        fromFrame: number;
        toFrame: number;
        loopAnimationDirection: 'forward' | 'reverse' | 'pingpong' | 'pingpongreverse';
        /**
         * Number of times the animations plays. Ping-pong forward and back count as 1 each.
         */
        count: number;
        userData?: UserData;
    }

    export type Slice = {
        name: string;
        x: number;
        y: number;
        width: number;
        height: number;
        ninePatch?: {
            centerX: number;
            centerY: number;
            centerWidth: number;
            centerHeight: number;
        };
        pivot?: {
            x: number;
            y: number;
        };
        userData?: UserData;
    }

    export type UserData = {
        text?: string;
        color?: Rgba;
    }

    export type Rgba = {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    export function fromRaw(raw: AsepriteFileRaw): AsepriteFile {
        let result: AsepriteFile = {
            width: raw.header.width,
            height: raw.header.height,
            colorDepth: raw.header.colorDepth,
            colorProfile: getColorProfile(raw),
            palette: getPalette(raw),
            tilesets: [],
            layers: [],
            frames: [],
            slices: [],
            tags: [],
        };

        for (let frame of raw.frames) {
            let resultFrame: Frame = {
                cels: [],
            };

            let i = 0;
            while (i < frame.chunks.length) {
                i = readChunk(result, resultFrame, frame.chunks, i);
            }

            result.frames.push(resultFrame);
        }

        return result;
    }

    function readChunk(result: AsepriteFile, resultFrame: Frame, chunks: AsepriteFileRaw.Chunk[], index: number) {
        let chunk = chunks[index];
        if (chunk.chunkType === 0x4 || chunk.chunkType === 0x11) {
            return readOldPaletteChunk(result, resultFrame, chunk, chunks, index);
        }
        if (chunk.chunkType === 0x2004) {
            return readLayerChunk(result, resultFrame, chunk, chunks, index);
        }
        if (chunk.chunkType === 0x2005) {
            return readCelChunk(result, resultFrame, chunk, chunks, index);
        }
        if (chunk.chunkType === 0x2006) {
            console.error('Stray cel extra chunk found', chunks);
            return index + 1;
        }
        if (chunk.chunkType === 0x2007) {
            return readColorProfileChunk(result, resultFrame, chunk, chunks, index);
        }
        if (chunk.chunkType === 0x2008) {
            console.error('External files are not unsupported', chunks);
            return index + 1;
        }
        if (chunk.chunkType === 0x2018) {
            return readTagsChunk(result, resultFrame, chunk, chunks, index);
        }
        if (chunk.chunkType === 0x2019) {
            return readPaletteChunk(result, resultFrame, chunk, chunks, index);
        }
        if (chunk.chunkType === 0x2020) {
            console.error('Stray user data chunk found', chunks);
            return index + 1;
        }
        if (chunk.chunkType === 0x2022) {
            return readSliceChunk(result, resultFrame, chunk, chunks, index);
        }
        if (chunk.chunkType === 0x2023) {
            return readTilesetChunk(result, resultFrame, chunk, chunks, index);
        }
        console.error('Invalid chunk type:', chunk.chunkType);
        return index + 1;
    }

    function readOldPaletteChunk(result: AsepriteFile, resultFrame: Frame, chunk: AsepriteFileRaw.OldPaletteChunk, chunks: AsepriteFileRaw.Chunk[], index: number) {
        // Palette has already been processed, just handle user data.
        let userData = getAttachedUserData(chunks, index);
        if (userData) {
            result.userData = userData
            return index + 2;
        }

        return index + 1;
    }

    function readLayerChunk(result: AsepriteFile, resultFrame: Frame, chunk: AsepriteFileRaw.LayerChunk, chunks: AsepriteFileRaw.Chunk[], index: number): number {
        let blendMode = asepriteBlendModeToPixiBlendMode(chunk.blendMode);
        let opacity = chunk.opacity / 255.0;
        let visible = (chunk.flags & 0x1) !== 0;
        let userData = getAttachedUserData(chunks, index);

        if (chunk.layerType === 0) {
            result.layers.push({
                name: chunk.layerName,
                type: 'image',
                childLevel: chunk.childLevel,
                blendMode,
                opacity,
                visible,
                userData,
            });
        } else if (chunk.layerType === 1) {
            result.layers.push({
                name: chunk.layerName,
                type: 'group',
                childLevel: chunk.childLevel,
                blendMode,
                opacity,
                visible,
                userData,
            });
        } else {
            if (chunk.tilesetIndex === undefined) {
                console.log(`No tileset index at chunk ${index}. Using default 0.`, chunks);
            }
            result.layers.push({
                name: chunk.layerName,
                type: 'tilemap',
                tilesetIndex: chunk.tilesetIndex ?? 0,
                childLevel: chunk.childLevel,
                blendMode,
                opacity,
                visible,
                userData,
            });
        }
        
        return userData ? index + 2 : index + 1;
    }

    function readCelChunk(result: AsepriteFile, resultFrame: Frame, chunk: AsepriteFileRaw.CelChunk, chunks: AsepriteFileRaw.Chunk[], index: number): number {
        let userData = getAttachedUserData(chunks, index);
        let celExtraChunk = getAttachedCelExtraChunk(chunks, index);
        
        let celData: CelData;
        if (chunk.cel.celType === 0) {
            let imageData = new Uint8Array(chunk.cel.pixels.length * 4);
            for (let p = 0; p < chunk.cel.pixels.length; p++) {
                writePixelToRGBA(chunk.cel.pixels[p], result, imageData, p);
            }
            celData = {
                type: 'image',
                width: chunk.cel.width,
                height: chunk.cel.height,
                imageData,
            };
        } else if (chunk.cel.celType === 1) {
            celData = {
                type: 'linked',
                linkedFrame: chunk.cel.linkedFrame,
            };
        } else if (chunk.cel.celType === 2) {
            let decompressedImage = decompress(chunk.cel.compressedImage);
            let totalNumberOfPixels = chunk.cel.width * chunk.cel.height;
            if (decompressedImage.byteLength !== totalNumberOfPixels * (result.colorDepth / 8)) {
                console.error(`Decompressed image is not the correct size at chunk ${index}`, chunks);
            }
            let imageData = new Uint8Array(totalNumberOfPixels * 4);
            for (let p = 0; p < totalNumberOfPixels; p++) {
                if (result.colorDepth === 32) {
                    writePixelToRGBA({
                        colorDepth: 32,
                        r: decompressedImage[p*4],
                        g: decompressedImage[p*4 + 1],
                        b: decompressedImage[p*4 + 2],
                        a: decompressedImage[p*4 + 3],
                    }, result, imageData, p);
                } else if (result.colorDepth === 16) {
                    writePixelToRGBA({
                        colorDepth: 16,
                        v: decompressedImage[p*2],
                        a: decompressedImage[p*2 + 1],
                    }, result, imageData, p);
                } else {
                    writePixelToRGBA({
                        colorDepth: 8,
                        i: decompressedImage[p],
                    }, result, imageData, p);
                }
            }
            celData = {
                type: 'image',
                width: chunk.cel.width,
                height: chunk.cel.height,
                imageData,
            }
        } else {
            let decompressedTiles = decompress(chunk.cel.compressedTiles);
            let tiles: CelTile[] = [];
            for (let i = 0; i < chunk.cel.widthTiles * chunk.cel.heightTiles; i++) {
                let tileDword =
                    (decompressedTiles[i*4 + 3] << 24) |
                    (decompressedTiles[i*4 + 2] << 16) |
                    (decompressedTiles[i*4 + 1] << 8) |
                    (decompressedTiles[i*4 + 0]);
                tiles.push({
                    id: tileDword & chunk.cel.bitmaskForTileId,
                    flipX: (tileDword & chunk.cel.bitmaskForXFlip) !== 0,
                    flipY: (tileDword & chunk.cel.bitmaskForYFlip) !== 0,
                    flipDiagonal: (tileDword & chunk.cel.bitmaskForDiagonalFlip) !== 0,
                });
            }
            celData = {
                type: 'tilemap',
                widthTiles: chunk.cel.widthTiles,
                heightTiles: chunk.cel.heightTiles,
                tiles,
            };
        }

        if (celExtraChunk) {
            console.error(`Cel extra chunk found at chunk ${index}, this was previously unseen! Please investigate and implement properly :)`, chunks);
        }

        resultFrame.cels.push({
            xPosition: chunk.xPosition,
            yPosition: chunk.yPosition,
            layerIndex: chunk.layerIndex,
            zIndex: chunk.zIndex,
            opacity: chunk.opacity / 255.0,
            celData,
            userData,
        });

        return index + 1 + (userData ? 1 : 0) + (celExtraChunk ? 1 : 0);
    }

    function readColorProfileChunk(result: AsepriteFile, resultFrame: Frame, chunk: AsepriteFileRaw.ColorProfileChunk, chunks: AsepriteFileRaw.Chunk[], index: number): number {
        // Skip as it's already been processed.
        return index + 1;
    }

    function readTagsChunk(result: AsepriteFile, resultFrame: Frame, chunk: AsepriteFileRaw.TagsChunk, chunks: AsepriteFileRaw.Chunk[], index: number): number {
        for (let i = 0; i < chunk.tags.length; i++) {
            let tag = chunk.tags[i];
            result.tags.push({
                name: tag.tagName,
                fromFrame: tag.fromFrame,
                toFrame: tag.toFrame,
                loopAnimationDirection:
                    tag.loopAnimationDirection === 0 ? 'forward' :
                    tag.loopAnimationDirection === 1 ? 'reverse' :
                    tag.loopAnimationDirection === 2 ? 'pingpong' :
                    'pingpongreverse',
                count: tag.repeatNTimes === 0 ? Infinity : tag.repeatNTimes,
                userData: getAttachedUserData(chunks, index + i),
            });
        }
        return index + 1 + chunk.tags.length;
    }

    function readPaletteChunk(result: AsepriteFile, resultFrame: Frame, chunk: AsepriteFileRaw.PaletteChunk, chunks: AsepriteFileRaw.Chunk[], index: number): number {
        // Palette has already been processed, just handle user data.
        let userData = getAttachedUserData(chunks, index);
        if (userData) {
            result.userData = userData
            return index + 2;
        }

        return index + 1;
    }

    function readSliceChunk(result: AsepriteFile, resultFrame: Frame, chunk: AsepriteFileRaw.SliceChunk, chunks: AsepriteFileRaw.Chunk[], index: number): number {
        if (chunk.sliceKeys.length === 0) {
            console.error(`No slice keys at chunk ${index}, this was previously unseen! Skipping chunk.`, chunks);
            return index + 1;
        }
        if (chunk.sliceKeys.length > 1) {
            console.error(`Animated slices are not currently supported at chunk ${index}. Using only the first.`, chunks);
        }
        let sliceKey = chunk.sliceKeys[0];
        if (sliceKey.frameNumber !== 0) {
            console.error(`Unexpected slice key frame number at chunk ${index}, this was previously unseen! Ignoring.`, chunks);
        }

        let userData = getAttachedUserData(chunks, index);

        result.slices.push({
            name: chunk.sliceName,
            x: sliceKey.x,
            y: sliceKey.y,
            width: sliceKey.width,
            height: sliceKey.height,
            ninePatch: O.clone(sliceKey.ninePatch),
            pivot: O.clone(sliceKey.pivot),
            userData,
        });
        
        return userData ? index + 2 : index + 1;
    }

    function readTilesetChunk(result: AsepriteFile, resultFrame: Frame, chunk: AsepriteFileRaw.TilesetChunk, chunks: AsepriteFileRaw.Chunk[], index: number): number {
        if (!chunk.tileData) {
            console.error(`No tile image data at chunk ${index}, this was previously unseen! Skipping chunk.`, chunks);
            return index + 1;
        }

        if (chunk.externalFile) {
            console.error(`External files not supported at chunk ${index}, this was previously unseen! Ignoring.`, chunks);
        }

        let pixelsPerTile = chunk.tileWidth * chunk.tileHeight;
        let tilesetUserData = getAttachedUserData(chunks, index);

        /**
         * Pixel data, in groups of 4 bytes RGBA, left-to-right, grouped by individual tile.
         * For example, the pixels in two 2x2 tiles would be arranged as such:
         * 01 45
         * 23 67
         */
        let decompressedTilesetImage = decompress(chunk.tileData.compressedTilesetImage);
        let totalNumberOfPixels = pixelsPerTile * chunk.numberOfTiles;
        if (decompressedTilesetImage.byteLength !== totalNumberOfPixels * (result.colorDepth / 8)) {
            console.error(`Decompressed tileset image is not the correct size at chunk ${index}`, chunks);
        }

        let tiles: Tileset['tiles'] = [];

        for (let i = 0; i < chunk.numberOfTiles; i++) {
            let imageData = new Uint8Array(pixelsPerTile * 4);
            for (let p = 0; p < pixelsPerTile; p++) {
                if (result.colorDepth === 32) {
                    writePixelToRGBA({
                        colorDepth: 32,
                        r: decompressedTilesetImage[i*pixelsPerTile*4 + p*4],
                        g: decompressedTilesetImage[i*pixelsPerTile*4 + p*4 + 1],
                        b: decompressedTilesetImage[i*pixelsPerTile*4 + p*4 + 2],
                        a: decompressedTilesetImage[i*pixelsPerTile*4 + p*4 + 3],
                    }, result, imageData, p);
                } else if (result.colorDepth === 16) {
                    writePixelToRGBA({
                        colorDepth: 16,
                        v: decompressedTilesetImage[i*pixelsPerTile*2 + p*2],
                        a: decompressedTilesetImage[i*pixelsPerTile*2 + p*2 + 1],
                    }, result, imageData, p);
                } else {
                    writePixelToRGBA({
                        colorDepth: 8,
                        i: decompressedTilesetImage[i*pixelsPerTile + p],
                    }, result,  imageData, p);
                }
            }
            let tileUserData = tilesetUserData
                ? getAttachedUserData(chunks, index + 1 + i)
                : undefined;
            tiles.push({
                imageData,
                userData: tileUserData,
            });
        }

        result.tilesets.push({
            id: chunk.tilesetId,
            name: chunk.tilesetName,
            tileWidth: chunk.tileWidth,
            tileHeight: chunk.tileHeight,
            emptyTileId: (chunk.flags & 0x4) ? 0 : 0xFFFFFFFF,
            tiles,
            userData: tilesetUserData,
        });

        return tilesetUserData
            ? index + 2 + chunk.numberOfTiles
            : index + 1;
    }

    function getAttachedUserData(chunks: AsepriteFileRaw.Chunk[], index: number): UserData | undefined {
        index++;
        if (index < chunks.length && chunks[index].chunkType === 0x2006) {
            // Next is a cel extra chunk, look after it.
            index++;
        }
        if (index >= chunks.length) return undefined;
        if (chunks[index].chunkType !== 0x2020) return undefined;
        let userDataChunk = chunks[index] as AsepriteFileRaw.UserDataChunk;
        return {
            text: userDataChunk.text,
            color: O.clone(userDataChunk.color),
        };
    }

    function getAttachedCelExtraChunk(chunks: AsepriteFileRaw.Chunk[], index: number): AsepriteFileRaw.CelExtraChunk | undefined {
        index++;
        if (index < chunks.length && chunks[index].chunkType === 0x2020) {
            // Next is a user data chunk, look after it.
            index++;
        }
        if (index >= chunks.length) return undefined;
        if (chunks[index].chunkType !== 0x2006) return undefined;
        return chunks[index] as AsepriteFileRaw.CelExtraChunk;
    }

    function getPalette(raw: AsepriteFileRaw): Palette {
        let paletteChunks = raw.frames.map(frame => frame.chunks).flat()
            .filter(chunk => chunk.chunkType === 0x4 || chunk.chunkType === 0x11 || chunk.chunkType === 0x2019);

        // Use new palette if it exists.
        let newPaletteChunks = paletteChunks.filter(chunk => chunk.chunkType === 0x2019) as AsepriteFileRaw.PaletteChunk[];
        if (newPaletteChunks.length > 1) {
            console.error(`Multiple new palette chunks found, this was previously unseen! Using only the first.`, paletteChunks, raw);
        }
        if (newPaletteChunks.length > 0) {
            let newPaletteChunk = newPaletteChunks[0];
            if (newPaletteChunk.firstColorToChange !== 0 || newPaletteChunk.lastColorToChange !== newPaletteChunk.paletteEntries.length-1) {
                console.error(`First or last colors to change differ from expected in palette chunk, this was previously unseen! Ignoring.`, newPaletteChunk, raw);
            }
            return {
                colors: newPaletteChunk.paletteEntries.map(entry => O.clone(entry.color)),
            };
        }

        // Otherwise it's an old palette.
        let oldPaletteChunks = paletteChunks.filter(chunk => chunk.chunkType === 0x4 || chunk.chunkType === 0x11) as AsepriteFileRaw.OldPaletteChunk[];
        if (oldPaletteChunks.length === 0) {
            console.error(`No old palette chunks found, this was previously unseen! Using empty palette.`, paletteChunks, raw);
            return {
                colors: [],
            };
        }

        if (oldPaletteChunks.length > 1) {
            console.error(`Multiple old palette chunks found, this was previously unseen! Using only the first.`, paletteChunks, raw);
        }

        let oldPaletteChunk = oldPaletteChunks[0];

        return {
            colors: oldPaletteChunk.packets[0].colors.map(color => ({
                r: color.r,
                g: color.g,
                b: color.b,
                a: 255,
            })),
        };
    }

    function getColorProfile(raw: AsepriteFileRaw): ColorProfile {
        let colorProfileChunks = raw.frames.map(frame => frame.chunks).flat().filter(chunk => chunk.chunkType === 0x2007) as AsepriteFileRaw.ColorProfileChunk[];
        if (colorProfileChunks.length === 0) {
            console.error(`No color profile chunks found, this was previously unseen! Using default sRGB.`, raw);
            return {
                type: 'sRGB',
            };
        }

        if (colorProfileChunks.length > 1) {
            console.error(`Multiple color profile chunks found, this was previously unseen! Using only the first.`, colorProfileChunks, raw);
        }

        let colorProfileChunk = colorProfileChunks[0];

        if (colorProfileChunk.colorProfileType === 0) {
            console.error('Only sRGB color profile is currently supported, your image may look wrong!', raw);
            return {
                type: 'none',
            };
        }
        if (colorProfileChunk.colorProfileType === 1) {
            if (colorProfileChunk.flags & 0x1) {
                console.error('sRGB special fixed gamma is currently supported, your image may look wrong!', raw);
            }
            return {
                type: 'sRGB',
                specialFixedGamma: (colorProfileChunk.flags & 0x1) ? colorProfileChunk.fixedGamma : undefined,
            };
        }
        if (colorProfileChunk.colorProfileType === 2) {
            console.error('Only sRGB color profile is currently supported, your image may look wrong!', raw);
            return {
                type: 'icc',
                profile: colorProfileChunk.iccProfile,
            };
        }
        console.error('Invalid color profile type:', colorProfileChunk.colorProfileType);
        return {
            type: 'sRGB',
        };
    }

    function decompress(array: Uint8Array) {
        return new Zlib.Inflate(array).decompress();
    }

    function asepriteBlendModeToPixiBlendMode(blendMode: number): PIXI.BLEND_MODES {
        if (blendMode === 0) return PIXI.BLEND_MODES.NORMAL;
        if (blendMode === 1) return PIXI.BLEND_MODES.MULTIPLY;
        if (blendMode === 2) return PIXI.BLEND_MODES.SCREEN;
        if (blendMode === 3) return PIXI.BLEND_MODES.OVERLAY;
        if (blendMode === 4) return PIXI.BLEND_MODES.DARKEN;
        if (blendMode === 5) return PIXI.BLEND_MODES.LIGHTEN;
        if (blendMode === 6) return PIXI.BLEND_MODES.COLOR_DODGE;
        if (blendMode === 7) return PIXI.BLEND_MODES.COLOR_BURN;
        if (blendMode === 8) return PIXI.BLEND_MODES.HARD_LIGHT;
        if (blendMode === 9) return PIXI.BLEND_MODES.SOFT_LIGHT;
        if (blendMode === 10) return PIXI.BLEND_MODES.DIFFERENCE;
        if (blendMode === 11) return PIXI.BLEND_MODES.EXCLUSION;
        if (blendMode === 12) return PIXI.BLEND_MODES.HUE;
        if (blendMode === 13) return PIXI.BLEND_MODES.SATURATION;
        if (blendMode === 14) return PIXI.BLEND_MODES.COLOR;
        if (blendMode === 15) return PIXI.BLEND_MODES.LUMINOSITY;
        if (blendMode === 16) return PIXI.BLEND_MODES.ADD;
        if (blendMode === 17) return PIXI.BLEND_MODES.SUBTRACT;
        if (blendMode === 18) {
            console.error(`Unsupported blend mode: Divide (18). Using Normal.`);
            return PIXI.BLEND_MODES.NORMAL;
        };
        console.error(`Invalid blend mode: ${blendMode}. Using Normal.`);
        return PIXI.BLEND_MODES.NORMAL;
    }

    function writePixelToRGBA(pixel: AsepriteFileRaw.Pixel, file: AsepriteFile, toArray: Uint8Array, toPixelIndex: number) {
        if (pixel.colorDepth === 32) {
            toArray.set([pixel.r, pixel.g, pixel.b, pixel.a], toPixelIndex * 4);
        } else if (pixel.colorDepth === 16) {
            toArray.set([pixel.v, pixel.v, pixel.v, pixel.a], toPixelIndex * 4);
        } else {
            let color = file.palette.colors[pixel.i];
            toArray.set([color.r, color.g, color.b, color.a], toPixelIndex * 4);
        }
    }
}