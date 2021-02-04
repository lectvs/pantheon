namespace ConvertTilemap {

    export function convert(binaryTiles: number[][], tileset: Tilemap.Tileset): Tilemap.Config {

        let binaryTilemapLayer = A.map2D(binaryTiles, tileIndex => <Tilemap.Tile>{ index: tileIndex, angle: 0, flipX: false });

        let ceilingTilemapLayer = SmartTilemap.Util.getSmartTilemapLayer(binaryTilemapLayer, {
            rules: SmartTilemap.Rule.oneBitRules({
                airIndex: -1,
                solidIndex: 9,
                cornerTopLeftIndex: 0,
                inverseCornerTopLeftIndex: 4,
                edgeUpIndex: 1,
                doubleEdgeHorizontalIndex: 25,
                peninsulaUpIndex: 3,
            }),
            outsideRule: { type: 'extend' },
        })

        return {
            tilemap: {
                tileset: tileset,
                layers: [ceilingTilemapLayer]
            },
        };
    }

}