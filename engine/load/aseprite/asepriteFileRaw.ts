type AsepriteFileRaw = {
    header: AsepriteFileRaw.Header;
    frames: AsepriteFileRaw.Frame[];
}

namespace AsepriteFileRaw {
    export type Header = {
        fileSize: number;
        numberOfFrames: number;
        width: number;
        height: number;
        colorDepth: 32 | 16 | 8;
        flags: number;
        transparentPaletteEntry: number;
        numberOfColors: number;
        pixelWidth: number;
        pixelHeight: number;
        gridX: number;
        gridY: number;
        gridWidth: number;
        gridHeight: number;
    }

    export type Frame = {
        frameSize: number;
        duration: number;
        chunks: Chunk[];
    }

    export type Chunk = {
        chunkSize: number;
    } & (OldPaletteChunk | LayerChunk | CelChunk | CelExtraChunk | ColorProfileChunk | ExternalFilesChunk | TagsChunk | PaletteChunk | UserDataChunk | SliceChunk | TilesetChunk);

    export type OldPaletteChunk = {
        chunkType: 0x4 | 0x11;
        packets: {
            entriesToSkipFromLastPacket: number;
            colors: {
                r: number;
                g: number;
                b: number;
            }[];
        }[];
    }

    export type LayerChunk = {
        chunkType: 0x2004;
        flags: number;
        layerType: 0 | 1 | 2;
        childLevel: number;
        blendMode: number;
        opacity: number;
        layerName: string;
        tilesetIndex?: number;
    }

    export type CelChunk = {
        chunkType: 0x2005;
        layerIndex: number;
        xPosition: number;
        yPosition: number;
        opacity: number;
        zIndex: number;
        cel: Cel;
    }

    export type Cel = {
        celType: 0;
        width: number;
        height: number;
        pixels: Pixel[];
    } | {
        celType: 1;
        linkedFrame: number;
    } | {
        celType: 2;
        width: number;
        height: number;
        compressedImage: Uint8Array;
    } | {
        celType: 3;
        widthTiles: number;
        heightTiles: number;
        bitmaskForTileId: number;
        bitmaskForXFlip: number;
        bitmaskForYFlip: number;
        bitmaskForDiagonalFlip: number;
        compressedTiles: Uint8Array;
    }

    export type Pixel = {
        colorDepth: 32;
        r: number;
        g: number;
        b: number;
        a: number;
    } | {
        colorDepth: 16;
        v: number;
        a: number;
    } | {
        colorDepth: 8;
        i: number;
    };

    export type CelExtraChunk = {
        chunkType: 0x2006;
        flags: number;
        preciseXPosition: number;
        preciseYPosition: number;
        celWidthInSprite: number;
        celHeightInSprite: number;
    }

    export type ColorProfileChunk = {
        chunkType: 0x2007;
        colorProfileType: 0 | 1 | 2;
        flags: number;
        fixedGamma: number;
        iccProfile: number[];
    }

    export type ExternalFilesChunk = {
        chunkType: 0x2008;
        entries: {
            id: number;
            type: 0 | 1 | 2 | 3;
            fileNameOrExtensionId: string;
        }[];
    }

    export type TagsChunk = {
        chunkType: 0x2018;
        tags: {
            fromFrame: number;
            toFrame: number;
            loopAnimationDirection: 0 | 1 | 2 | 3;
            repeatNTimes: number;
            tagName: string;
        }[];
    }

    export type PaletteChunk = {
        chunkType: 0x2019;
        firstColorToChange: number;
        lastColorToChange: number;
        paletteEntries: {
            entryName?: string;
            color: {
                r: number;
                g: number;
                b: number;
                a: number;
            };
        }[];
    }

    export type UserDataChunk = {
        chunkType: 0x2020;
        text?: string;
        color?: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
    }

    export type SliceChunk = {
        chunkType: 0x2022;
        sliceName: string;
        sliceKeys: {
            frameNumber: number;
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
        }[];
    }

    export type TilesetChunk = {
        chunkType: 0x2023;
        tilesetId: number;
        flags: number;
        numberOfTiles: number;
        tileWidth: number;
        tileHeight: number;
        baseIndex: number;
        tilesetName: string;
        externalFile?: {
            externalFileId: number;
            tilesetId: number;
        };
        tileData?: {
            compressedTilesetImage: Uint8Array;
        };
    }

    export function readAsepriteFileRaw(reader: BytesReader) {
        try {
            let header = readHeader(reader);
            let frames: Frame[] = [];
            for (let i = 0; i < header.numberOfFrames; i++) {
                frames.push(readFrame(reader, header));
            }
            if (!reader.isAtEnd()) {
                throw new Error('More data in file after finished reading');
            }
            return {
                header,
                frames,
            };
        } catch (e) {
            throw new Error('Error reading Aseprite file', { cause: e });
        }
    }

    export function readHeader(reader: BytesReader): Header {
        let fileSize = reader.readDword();
        let magicNumber = reader.readWord();
        if (magicNumber !== 0xA5E0) {
            throw new Error('Invalid magic number: ' + magicNumber);
        }
        let numberOfFrames = reader.readWord();
        let width = reader.readWord();
        let height = reader.readWord();
        let colorDepth = reader.readWord();
        if (colorDepth !== 32 && colorDepth !== 16 && colorDepth !== 8) {
            throw new Error('Invalid color depth: ' + colorDepth);
        }
        let flags = reader.readDword();
        reader.readWord();  // Speed
        reader.readDword();  // Ignore
        reader.readDword();  // Ignore
        let transparentPaletteEntry = reader.readByte();
        reader.readBytes(3);  // Ignore
        let numberOfColors = reader.readWord();
        let pixelWidth = reader.readByte();
        let pixelHeight = reader.readByte();
        let gridX = reader.readShort();
        let gridY = reader.readShort();
        let gridWidth = reader.readWord();
        let gridHeight = reader.readWord();
        reader.readBytes(84);

        return {
            fileSize,
            numberOfFrames,
            width,
            height,
            colorDepth,
            flags,
            transparentPaletteEntry,
            numberOfColors,
            pixelWidth,
            pixelHeight,
            gridX,
            gridY,
            gridWidth,
            gridHeight,
        };
    }

    export function readFrame(reader: BytesReader, header: Header): Frame {
        let frameSize = reader.readDword();
        let magicNumber = reader.readWord();
        if (magicNumber !== 0xF1FA) {
            throw new Error('Invalid frame magic number: ' + magicNumber);
        }
        let oldChunks = reader.readWord();
        let duration = reader.readWord();
        reader.readBytes(2);  // Ignore
        let newChunks = reader.readDword();

        let numberOfChunks = newChunks === 0 ? oldChunks : newChunks;

        let chunks: Chunk[] = [];
        for (let i = 0; i < numberOfChunks; i++) {
            chunks.push(readChunk(reader, header));
        }

        return {
            frameSize,
            duration,
            chunks,
        };
    }

    export function readChunk(reader: BytesReader, header: Header): Chunk {
        let chunkSize = reader.readDword();
        let chunkType = reader.readWord();
        return {
            chunkSize,
            ...readChunkData(reader, header, chunkSize, chunkType),
        };
    }

    export function readChunkData(reader: BytesReader, header: Header, chunkSize: number, chunkType: number) {
        let chunkDataSize = chunkSize - 6;
        if (chunkType === 0x4 || chunkType === 0x11) {
            return readOldPaletteChunk(reader, chunkType);
        } else if (chunkType === 0x2004) {
            return readLayerChunk(reader);
        } else if (chunkType === 0x2005) {
            return readCelChunk(reader, header, chunkDataSize);
        } else if (chunkType === 0x2006) {
            return readCelExtraChunk(reader);
        } else if (chunkType === 0x2007) {
            return readColorProfileChunk(reader);
        } else if (chunkType === 0x2008) {
            return readExternalFilesChunk(reader);
        } else if (chunkType === 0x2016) {
            throw new Error('Mask chunk (0x2016) is unsupported');
        } else if (chunkType === 0x2017) {
            throw new Error('Path chunk (0x2017) is unsupported');
        } else if (chunkType === 0x2018) {
            return readTagsChunk(reader);
        } else if (chunkType === 0x2019) {
            return readPaletteChunk(reader);
        } else if (chunkType === 0x2020) {
            return readUserDataChunk(reader);
        } else if (chunkType === 0x2022) {
            return readSliceChunk(reader);
        } else if (chunkType === 0x2023) {
            return readTilesetChunk(reader);
        } else {
            throw new Error('Invalid chunk type: ' + chunkType);
        }
    }

    export function readOldPaletteChunk(reader: BytesReader, type: 0x4 | 0x11): OldPaletteChunk {
        let numPackets = reader.readWord();
        let packets: OldPaletteChunk['packets'] = [];
        for (let i = 0; i < numPackets; i++) {
            let entriesToSkipFromLastPacket = reader.readByte();
            let numColors = reader.readByte();
            let colors: OldPaletteChunk['packets'][number]['colors'] = [];
            for (let j = 0; j < numColors; j++) {
                colors.push(reader.readPixelRGB());
            }
            packets.push({
                entriesToSkipFromLastPacket,
                colors,
            });
        }
        return {
            chunkType: type,
            packets,
        };
    }

    export function readLayerChunk(reader: BytesReader): LayerChunk {
        let flags = reader.readWord();
        let layerType = reader.readWord();
        if (layerType !== 0 && layerType !== 1 && layerType !== 2) {
            throw new Error('Invalid layer type: ' + layerType);
        }
        let childLevel = reader.readWord();
        reader.readWord();  // Default layer width (ignored)
        reader.readWord();  // Default layer height (ignored)
        let blendMode = reader.readWord();
        let opacity = reader.readByte();
        reader.readBytes(3);  // Ignore
        let layerName = reader.readString();
        let tilesetIndex = layerType === 2 ? reader.readDword() : undefined;

        return {
            chunkType: 0x2004,
            flags,
            layerType,
            childLevel,
            blendMode,
            opacity,
            layerName,
            tilesetIndex,
        };
    }

    export function readCelChunk(reader: BytesReader, header: Header, chunkDataSize: number): CelChunk {
        let initialPosition = reader.getPosition();

        let layerIndex = reader.readWord();
        let xPosition = reader.readShort();
        let yPosition = reader.readShort();
        let opacity = reader.readByte();
        let celType = reader.readWord();
        let zIndex = reader.readShort();
        reader.readBytes(5);  // Ignore

        let cel: Cel;
        if (celType === 0) {
            let width = reader.readWord();
            let height = reader.readWord();
            let pixels: Pixel[] = [];
            for (let i = 0; i < width * height; i++) {
                pixels.push(readPixel(reader, header.colorDepth));
            }
            cel = {
                celType: 0,
                width,
                height,
                pixels,
            };
        } else if (celType === 1) {
            let linkedFrame = reader.readWord();
            cel = {
                celType: 1,
                linkedFrame,
            };
        } else if (celType === 2) {
            let width = reader.readWord();
            let height = reader.readWord();
            let compressedImageSize = chunkDataSize - (reader.getPosition() - initialPosition);  // Remaining bytes
            let compressedImage = reader.readBytes(compressedImageSize);
            cel = {
                celType: 2,
                width,
                height,
                compressedImage,
            };
        } else if (celType === 3) {
            let widthTiles = reader.readWord();
            let heightTiles = reader.readWord();
            let bitsPerTile = reader.readWord();
            if (bitsPerTile !== 32) {
                throw new Error('Invalid bits per tile: ' + bitsPerTile);
            }
            let bitmaskForTileId = reader.readDword();
            let bitmaskForXFlip = reader.readDword();
            let bitmaskForYFlip = reader.readDword();
            let bitmaskForDiagonalFlip = reader.readDword();
            reader.readBytes(10);  // Ignore
            let compressedTilesetSize = chunkDataSize - (reader.getPosition() - initialPosition);  // Remaining bytes
            let compressedTiles = reader.readBytes(compressedTilesetSize);
            cel = {
                celType: 3,
                widthTiles,
                heightTiles,
                bitmaskForTileId,
                bitmaskForXFlip,
                bitmaskForYFlip,
                bitmaskForDiagonalFlip,
                compressedTiles,
            };
        } else {
            throw new Error('Invalid cel type: ' + celType);
        }

        return {
            chunkType: 0x2005,
            layerIndex,
            xPosition,
            yPosition,
            opacity,
            zIndex,
            cel,
        };
    }

    export function readCelExtraChunk(reader: BytesReader): CelExtraChunk {
        let flags = reader.readDword();
        let preciseXPosition = reader.readFixed();
        let preciseYPosition = reader.readFixed();
        let celWidthInSprite = reader.readFixed();
        let celHeightInSprite = reader.readFixed();
        reader.readBytes(16);  // Ignore
        return {
            chunkType: 0x2006,
            flags,
            preciseXPosition,
            preciseYPosition,
            celWidthInSprite,
            celHeightInSprite,
        };
    }

    export function readColorProfileChunk(reader: BytesReader): ColorProfileChunk {
        let colorProfileType = reader.readWord();
        if (colorProfileType !== 0 && colorProfileType !== 1 && colorProfileType !== 2) {
            throw new Error('Invalid color profile type: ' + colorProfileType);
        }
        let flags = reader.readWord();
        let fixedGamma = reader.readFixed();
        reader.readBytes(8);  // Ignore
        let iccProfile: number[] = [];
        if (colorProfileType === 2) {
            let iccProfileSize = reader.readDword();
            for (let i = 0; i < iccProfileSize; i++) {
                iccProfile.push(reader.readByte());
            }
        }
        return {
            chunkType: 0x2007,
            colorProfileType,
            flags,
            fixedGamma,
            iccProfile,
        };
    }

    export function readExternalFilesChunk(reader: BytesReader): ExternalFilesChunk {
        let numberOfEntries = reader.readDword();
        let entries: ExternalFilesChunk['entries'] = [];
        for (let i = 0; i < numberOfEntries; i++) {
            let id = reader.readDword();
            let type = reader.readByte();
            if (type !== 0 && type !== 1 && type !== 2 && type !== 3) {
                throw new Error('Invalid external file type: ' + type);
            }
            reader.readBytes(7);  // Ignore
            let fileNameOrExtensionId = reader.readString();
            entries.push({
                id,
                type,
                fileNameOrExtensionId,
            });
        }
        return {
            chunkType: 0x2008,
            entries,
        };
    }

    export function readTagsChunk(reader: BytesReader): TagsChunk {
        let numberOfTags = reader.readWord();
        reader.readBytes(8);  // Ignore
        let tags: TagsChunk['tags'] = [];
        for (let i = 0; i < numberOfTags; i++) {
            let fromFrame = reader.readWord();
            let toFrame = reader.readWord();
            let loopAnimationDirection = reader.readByte();
            if (loopAnimationDirection !== 0 && loopAnimationDirection !== 1 && loopAnimationDirection !== 2 && loopAnimationDirection !== 3) {
                throw new Error('Invalid loop animation direction: ' + loopAnimationDirection);
            }
            let repeatNTimes = reader.readWord();
            reader.readBytes(6);  // Ignore
            reader.readBytes(3);  // Deprecated tag color
            reader.readByte();  // Ignore
            let tagName = reader.readString();
            tags.push({
                fromFrame,
                toFrame,
                loopAnimationDirection,
                repeatNTimes,
                tagName,
            });
        }
        return {
            chunkType: 0x2018,
            tags,
        };
    }

    export function readPaletteChunk(reader: BytesReader): PaletteChunk {
        let paletteSize = reader.readDword();
        let firstColorToChange = reader.readDword();
        let lastColorToChange = reader.readDword();
        reader.readBytes(8);  // Ignore
        let paletteEntries: PaletteChunk['paletteEntries'] = [];
        for (let i = 0; i < paletteSize; i++) {
            let flags = reader.readWord();
            let color = reader.readPixelRGBA();
            let entryName = (flags & 0x1) ? reader.readString() : undefined;
            paletteEntries.push({
                color,
                entryName,
            });
        }
        return {
            chunkType: 0x2019,
            firstColorToChange,
            lastColorToChange,
            paletteEntries,
        };
    }

    export function readUserDataChunk(reader: BytesReader): UserDataChunk {
        let flags = reader.readDword();
        let text = (flags & 0x1) ? reader.readString() : undefined;
        let color = (flags & 0x2) ? reader.readPixelRGBA() : undefined;
        if (flags & 0x4) {
            debug('Warning: properties are unsupported on user data chunks');
        }
        return {
            chunkType: 0x2020,
            text,
            color,
        };
    }

    export function readSliceChunk(reader: BytesReader): SliceChunk {
        let numberOfSliceKeys = reader.readDword();
        let flags = reader.readDword();
        reader.readDword();  // Ignore
        let sliceName = reader.readString();
        let sliceKeys: SliceChunk['sliceKeys'] = [];
        for (let i = 0; i < numberOfSliceKeys; i++) {
            let frameNumber = reader.readDword();
            let x = reader.readLong();
            let y = reader.readLong();
            let width = reader.readDword();
            let height = reader.readDword();
            let ninePatch: SliceChunk['sliceKeys'][number]['ninePatch'];
            if (flags & 0x1) {
                let centerX = reader.readLong();
                let centerY = reader.readLong();
                let centerWidth = reader.readDword();
                let centerHeight = reader.readDword();
                ninePatch = {
                    centerX,
                    centerY,
                    centerWidth,
                    centerHeight,
                };
            }
            let pivot: SliceChunk['sliceKeys'][number]['pivot'];
            if (flags & 0x2) {
                let pivotX = reader.readLong();
                let pivotY = reader.readLong();
                pivot = {
                    x: pivotX,
                    y: pivotY,
                };
            }
            sliceKeys.push({
                frameNumber,
                x,
                y,
                width,
                height,
                ninePatch,
                pivot,
            });
        }
        return {
            chunkType: 0x2022,
            sliceName,
            sliceKeys,
        };
    }

    export function readTilesetChunk(reader: BytesReader): TilesetChunk {
        let id = reader.readDword();
        let flags = reader.readDword();
        let numberOfTiles = reader.readDword();
        let tileWidth = reader.readWord();
        let tileHeight = reader.readWord();
        let baseIndex = reader.readShort();
        reader.readBytes(14);  // Ignore
        let tilesetName = reader.readString();
        let externalFile: TilesetChunk['externalFile'];
        if (flags & 0x1) {
            let externalFileId = reader.readDword();
            let tilesetId = reader.readDword();
            externalFile = {
                externalFileId,
                tilesetId,
            };
        }
        let tileData: TilesetChunk['tileData'];
        if (flags & 0x2) {
            let compressedTilesetImageLength = reader.readDword();
            let compressedTilesetImage = reader.readBytes(compressedTilesetImageLength);
            tileData = {
                compressedTilesetImage,
            };
        }

        return {
            chunkType: 0x2023,
            tilesetId: id,
            flags,
            numberOfTiles,
            tileWidth,
            tileHeight,
            baseIndex,
            tilesetName,
            externalFile,
            tileData,
        };
    }

    function readPixel(reader: BytesReader, colorDepth: 32 | 16 | 8): Pixel {
        if (colorDepth === 32) {
            return {
                colorDepth: 32,
                ...reader.readPixelRGBA(),
            };
        } else if (colorDepth === 16) {
            return {
                colorDepth: 16,
                ...reader.readPixelGrayscale(),
            };
        } else if (colorDepth === 8) {
            return {
                colorDepth: 8,
                ...reader.readPixelIndexed(),
            };
        } else {
            throw new Error('Invalid color depth: ' + colorDepth);
        }
    }
}