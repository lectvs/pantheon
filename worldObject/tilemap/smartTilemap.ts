/// <reference path="./tilemap.ts" />

namespace SmartTilemap.Rule {
    export type Rule = {
        pattern: Pattern;
        tile: number | Tilemap.Tile;
    };

    export type PatternTile = number | { type: 'is' | 'not', index: number };

    export type Pattern = {
        tile: PatternTile;
        above?: PatternTile;
        below?: PatternTile;
        left?: PatternTile;
        right?: PatternTile;
        aboveLeft?: PatternTile;
        aboveRight?: PatternTile;
        belowLeft?: PatternTile;
        belowRight?: PatternTile;
    }

    export type OutsideRule = OutsideRuleConstant | OutsideRuleExtend;
    type OutsideRuleConstant = { type: 'constant', index: number };
    type OutsideRuleExtend = { type: 'extend' };

    export type EmptyRule = EmptyRuleNoop | EmptyRuleConstant;
    type EmptyRuleNoop = { type: 'noop' };
    type EmptyRuleConstant = { type: 'constant', index: number };
}

namespace SmartTilemap {

    export type RuleConfig = {
        rules: SmartTilemap.Rule.Rule[];
        outsideRule: SmartTilemap.Rule.OutsideRule;
        emptyRule?: SmartTilemap.Rule.EmptyRule;
    }

    export function sortedRules(rules: Rule.Rule[]) {
        return A.sort(rules, rule => getPatternSpecificity(rule.pattern), true);
    }

    export function getSmartTilemap(tilemap: string | Tilemap.Tilemap, config: RuleConfig): Tilemap.Tilemap {
        if (_.isString(tilemap)) {
            tilemap = AssetCache.getTilemap(tilemap);
            if (!tilemap) return undefined;
        }
        return {
            layers: tilemap.layers.map(layer => getSmartTilemapLayer(layer, config)),
        };
    }

    export function getSmartTilemapLayer(tilemapLayer: Tilemap.TilemapLayer, config: RuleConfig): Tilemap.TilemapLayer {
        let tiles: Tilemap.Tile[][] = [];

        for (let y = 0; y < tilemapLayer.tiles.length; y++) {
            let line: Tilemap.Tile[] = [];
            for (let x = 0; x < tilemapLayer.tiles[y].length; x++) {
                line.push(getSmartTile(tilemapLayer, x, y, config));
            }
            tiles.push(line);
        }

        return {
            name: tilemapLayer.name,
            tiles: tiles,
        };
    }

    function getSmartTile(tilemap: Tilemap.TilemapLayer, x: number, y: number, config: RuleConfig): Tilemap.Tile {
        for (let rule of config.rules) {
            if (matchTilePattern(tilemap, x, y, config, rule.pattern)) {
                return _.isNumber(rule.tile) ? { index: rule.tile, angle: 0, flipX: false } : rule.tile;
            }
        }

        return tilemap[y][x];
    }

    function matchTilePattern(tilemap: Tilemap.TilemapLayer, x: number, y: number, config: RuleConfig, pattern: SmartTilemap.Rule.Pattern): boolean {
        return matchTilePatternTile(pattern.tile, getTileIndex(tilemap, x, y, config))
            && matchTilePatternTile(pattern.above, getTileIndex(tilemap, x, y-1, config))
            && matchTilePatternTile(pattern.below, getTileIndex(tilemap, x, y+1, config))
            && matchTilePatternTile(pattern.left, getTileIndex(tilemap, x-1, y, config))
            && matchTilePatternTile(pattern.right, getTileIndex(tilemap, x+1, y, config))
            && matchTilePatternTile(pattern.aboveLeft, getTileIndex(tilemap, x-1, y-1, config))
            && matchTilePatternTile(pattern.aboveRight, getTileIndex(tilemap, x+1, y-1, config))
            && matchTilePatternTile(pattern.belowLeft, getTileIndex(tilemap, x-1, y+1, config))
            && matchTilePatternTile(pattern.belowRight, getTileIndex(tilemap, x+1, y+1, config));
    }

    function matchTilePatternTile(patternTile: SmartTilemap.Rule.PatternTile, tileIndex: number): boolean {
        if (patternTile === undefined) return true;
        if (_.isNumber(patternTile)) return patternTile === tileIndex;
        if (patternTile.type === 'is') return patternTile.index === tileIndex;
        if (patternTile.type === 'not') return patternTile.index !== tileIndex;
        return false;
    }

    function getPatternSpecificity(pattern: SmartTilemap.Rule.Pattern): number {
        return getPatternTileSpecificity(pattern.tile)
             + getPatternTileSpecificity(pattern.above)
             + getPatternTileSpecificity(pattern.below)
             + getPatternTileSpecificity(pattern.left)
             + getPatternTileSpecificity(pattern.right)
             + getPatternTileSpecificity(pattern.aboveLeft)
             + getPatternTileSpecificity(pattern.aboveRight)
             + getPatternTileSpecificity(pattern.belowLeft)
             + getPatternTileSpecificity(pattern.belowRight);
    }

    function getPatternTileSpecificity(patternTile: SmartTilemap.Rule.PatternTile): number {
        if (patternTile === undefined) return 0;
        return 1;
    }

    function getTileIndex(tilemapLayer: Tilemap.TilemapLayer, x: number, y: number, config: RuleConfig): number {
        if (0 <= y && y < tilemapLayer.tiles.length && 0 <= x && x < tilemapLayer.tiles[y].length) {
            if (tilemapLayer.tiles[y][x].index >= 0) {
                return tilemapLayer.tiles[y][x].index;
            }

            if (!config.emptyRule || config.emptyRule.type === 'noop') {
                return tilemapLayer.tiles[y][x].index;
            }
            
            if (config.emptyRule.type === 'constant') {
                return config.emptyRule.index;
            }
        }

        if (config.outsideRule.type === 'constant') {
            return config.outsideRule.index;
        }
        
        if (config.outsideRule.type === 'extend') {
            let nearesty = M.clamp(y, 0, tilemapLayer.tiles.length-1);
            let nearestx = M.clamp(x, 0, tilemapLayer.tiles[nearesty].length-1);
            return tilemapLayer.tiles[nearesty][nearestx].index;
        }

        return -1;
    }
}
