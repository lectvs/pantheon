type PyxelFile = {
    name: string;
    version: string;
    palette: {
        numColors: number;
        colors: DictNumber<string>;
    };
    settings: any;
    tileset: {
        tileWidth: number;
        tileHeight: number;
        numTiles: number;
    };
    canvas: {
        width: number;
        height: number;
        tileWidth: number;
        tileHeight: number;
        numLayers: number;
        layers: DictNumber<PyxelFile.Layer>;
    };
    animations: DictNumber<PyxelFile.Animation>;
}

namespace PyxelFile {
    export type Layer = {
        name: string;
        type: 'tile_layer' | 'group_layer';
        alpha: number;
        blendMode: string;
        hidden: boolean;
        parentIndex: number;
    }
    & (GroupLayer | TileLayer)
    
    export type GroupLayer = {
        type: 'group_layer';
    }
    
    export type TileLayer = {
        type: 'tile_layer';
        tileRefs: DictNumber<Tile>;
    }

    export type Tile = {
        index: number;
        rot: number;
        flipX: boolean;
    }

    export type Animation = {
        name: string;
        baseTile: number;
        length: number;
        frameDuration: number;
        frameDurationMultipliers: number[];
    }
}
