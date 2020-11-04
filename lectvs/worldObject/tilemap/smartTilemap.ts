/// <reference path="./tilemap.ts" />

class SmartTilemap extends Tilemap {
    baseTilemap: Tilemap.Tilemap;
    smartConfig: SmartTilemap.Util.SmartTilemapConfig;

    constructor(tilemap: string | Tilemap.Tilemap, smartConfig: SmartTilemap.Util.SmartTilemapConfig, layer: number) {
        super(tilemap, layer);

        this.baseTilemap = this.tilemap;
        this.smartConfig = smartConfig;

        this.tilemap = SmartTilemap.Util.getSmartTilemap(this.baseTilemap, this.smartConfig);
        this.dirty = true;
    }

    getTile(x: number, y: number) {
        return this.baseTilemap[y][x];
    }

    setTile(x: number, y: number, tile: Tilemap.Tile) {
        this.baseTilemap.layers[this.tilemapLayer][y][x] = O.deepClone(tile);
        this.tilemap = SmartTilemap.Util.getSmartTilemap(this.baseTilemap, this.smartConfig);
        this.dirty = true;
    }
}

namespace SmartTilemap.Rule {
    export type Rule = {
        pattern: RegExp;
        tile: Tilemap.Tile;
    };

    export type OutsideRule = OutsideRuleConstant | OutsideRuleExtend;
    type OutsideRuleConstant = { type: 'constant', index: number };
    type OutsideRuleExtend = { type: 'extend' };

    export type EmptyRule = EmptyRuleNoop | EmptyRuleConstant;
    type EmptyRuleNoop = { type: 'noop' };
    type EmptyRuleConstant = { type: 'constant', index: number };

    // Rules for a tilemap with air=empty, solid=non-empty
    export function oneBitRules(config: {
        airIndex: number;
        solidIndex: number;
        edgeUpIndex?: number;
        cornerTopLeftIndex?: number;
        inverseCornerTopLeftIndex?: number;
        doubleEdgeHorizontalIndex?: number;
        peninsulaUpIndex?: number;
    }): Rule[] {
        let rules: Rule[] = [];
        
        if (config.peninsulaUpIndex !== undefined) {
            rules.push({ pattern: /. . \S .../, tile: { index: config.peninsulaUpIndex, angle: 0, flipX: false } });     // Peninsula up
            rules.push({ pattern: /. ..\S . ./, tile: { index: config.peninsulaUpIndex, angle: 90, flipX: false } });    // Peninsula right
            rules.push({ pattern: /... \S . ./, tile: { index: config.peninsulaUpIndex, angle: 180, flipX: false } });   // Peninsula down
            rules.push({ pattern: /. . \S.. ./, tile: { index: config.peninsulaUpIndex, angle: 270, flipX: false } });   // Peninsula left
        }

        if (config.cornerTopLeftIndex !== undefined) {
            rules.push({ pattern: /. . \S..../, tile: { index: config.cornerTopLeftIndex, angle: 0, flipX: false } });      // Corner top-left
            rules.push({ pattern: /. ..\S .../, tile: { index: config.cornerTopLeftIndex, angle: 90, flipX: false } });     // Corner top-right
            rules.push({ pattern: /....\S . ./, tile: { index: config.cornerTopLeftIndex, angle: 180, flipX: false } });    // Corner bottom-right
            rules.push({ pattern: /... \S.. ./, tile: { index: config.cornerTopLeftIndex, angle: 270, flipX: false } });    // Corner bottom-left
        }

        if (config.doubleEdgeHorizontalIndex !== undefined) {
            rules.push({ pattern: /. ..\S.. ./, tile: { index: config.doubleEdgeHorizontalIndex, angle: 0, flipX: false } });   // Double Edge horizontal
            rules.push({ pattern: /... \S .../, tile: { index: config.doubleEdgeHorizontalIndex, angle: 90, flipX: false } });  // Double Edge vertical
        }

        if (config.edgeUpIndex !== undefined) {
            rules.push({ pattern: /. ..\S..../, tile: { index: config.edgeUpIndex, angle: 0, flipX: false } });     // Edge up
            rules.push({ pattern: /....\S .../, tile: { index: config.edgeUpIndex, angle: 90, flipX: false } });    // Edge right
            rules.push({ pattern: /....\S.. ./, tile: { index: config.edgeUpIndex, angle: 180, flipX: false } });   // Edge down
            rules.push({ pattern: /... \S..../, tile: { index: config.edgeUpIndex, angle: 270, flipX: false } });   // Edge left
        }

        if (config.inverseCornerTopLeftIndex !== undefined) {
            rules.push({ pattern: / ...\S..../, tile: { index: config.inverseCornerTopLeftIndex, angle: 0, flipX: false } });   // Inverse Corner top-left
            rules.push({ pattern: /.. .\S..../, tile: { index: config.inverseCornerTopLeftIndex, angle: 90, flipX: false } });  // Inverse Corner top-right
            rules.push({ pattern: /....\S... /, tile: { index: config.inverseCornerTopLeftIndex, angle: 180, flipX: false } }); // Inverse Corner bottom-right
            rules.push({ pattern: /....\S. ../, tile: { index: config.inverseCornerTopLeftIndex, angle: 270, flipX: false } }); // Inverse Corner bottom-left
        }

        rules.push({ pattern: /.... ..../, tile: { index: config.airIndex, angle: 0, flipX: false } });     // Air
        rules.push({ pattern: /....\S..../, tile: { index: config.solidIndex, angle: 0, flipX: false } });  // Solid

        return rules;
    }
}

namespace SmartTilemap.Util {

    export type SmartTilemapConfig = {
        rules: SmartTilemap.Rule.Rule[];
        outsideRule: SmartTilemap.Rule.OutsideRule;
        emptyRule?: SmartTilemap.Rule.EmptyRule;
    }

    export function getSmartTilemap(tilemap: string | Tilemap.Tilemap, config: SmartTilemapConfig): Tilemap.Tilemap {
        if (_.isString(tilemap)) {
            tilemap = AssetCache.getTilemap(tilemap);
            if (!tilemap) return;
        }
        return {
            tileset: tilemap.tileset,
            layers: tilemap.layers.map(layer => getSmartTilemapLayer(layer, config)),
        };
    }

    export function getSmartTilemapLayer(tilemap: Tilemap.TilemapLayer, config: SmartTilemapConfig): Tilemap.TilemapLayer {
        let result = [];

        for (let y = 0; y < tilemap.length; y++) {
            let line = [];
            for (let x = 0; x < tilemap[y].length; x++) {
                line.push(getSmartTile(tilemap, x, y, config));
            }
            result.push(line);
        }

        return result;
    }

    export function getSmartTile(tilemap: Tilemap.TilemapLayer, x: number, y: number, config: SmartTilemapConfig): Tilemap.Tile {
        let pattern = getTilePattern(tilemap, x, y, config);

        for (let rule of config.rules) {
            if (pattern.search(rule.pattern) > -1) {
                return rule.tile;
            }
        }

        return tilemap[y][x];
    }


    function getTilePattern(tilemap: Tilemap.TilemapLayer, x: number, y: number, config: SmartTilemapConfig) {
        let pattern = '';
        for (let j = y-1; j <= y+1; j++) {
            for (let i = x-1; i <= x+1; i++) {
                let index = getTileIndex(tilemap, i, j, config.outsideRule, config.emptyRule);
                pattern += index >= 0 ? index : ' ';
            }
        }
        return pattern;
    }

    function getTileIndex(tilemap: Tilemap.TilemapLayer, x: number, y: number,
                          outsideRule: SmartTilemap.Rule.OutsideRule, emptyRule: SmartTilemap.Rule.EmptyRule): number {
        if (0 <= y && y < tilemap.length && 0 <= x && x < tilemap[y].length) {
            if (tilemap[y][x].index >= 0) {
                return tilemap[y][x].index;
            }

            if (emptyRule.type === 'noop') {
                return tilemap[y][x].index;
            }
            
            if (emptyRule.type === 'constant') {
                return emptyRule.index;
            }
        }

        if (outsideRule.type === 'constant') {
            return outsideRule.index;
        }
        
        if (outsideRule.type === 'extend') {
            let nearesty = M.clamp(y, 0, tilemap.length-1);
            let nearestx = M.clamp(x, 0, tilemap[nearesty].length-1);
            return tilemap[nearesty][nearestx].index;
        }
    }
}
