namespace TilemapEntities {

    export type GetEntitiesConfig = {
        tilemap: string | Tilemap.Tilemap;
        tilemapLayer: number;
        tileset: string;
        entities: Dict<SpawnFunction>;
        offsetX?: number;
        offsetY?: number;
    }

    export type SpawnFunction = (x: number, y: number, tile: Tilemap.Tile) => WorldObject;
}

class TilemapEntities {

    static getEntities(config: TilemapEntities.GetEntitiesConfig): WorldObject[] {
        let tilemap = _.isString(config.tilemap) ? AssetCache.getTilemap(config.tilemap) : config.tilemap;
        let tilemapLayer = config.tilemapLayer;
        let tileset = AssetCache.getTileset(config.tileset);
        let entities = config.entities;
        let offsetX = config.offsetX ?? 0;
        let offsetY = config.offsetY ?? 0;

        let layer = tilemap.layers[tilemapLayer];

        let result: WorldObject[] = [];

        for (let y = 0; y < layer.tiles.length; y++) {
            for (let x = 0; x < layer.tiles[y].length; x++) {
                let tile = layer.tiles[y][x];
                if (!entities[tile.index]) continue;

                let entity = entities[tile.index](offsetX + x*tileset.tileWidth, offsetY + y*tileset.tileHeight, tile);
                result.push(entity);
            }
        }

        return result;
    }

}