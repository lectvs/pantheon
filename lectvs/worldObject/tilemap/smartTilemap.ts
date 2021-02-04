/// <reference path="./tilemap.ts" />

namespace SmartTilemap {
    export type Config = ReplaceConfigCallbacks<Tilemap.Config, SmartTilemap> & {
        smartConfig: SmartTilemap.Util.SmartTilemapConfig;
    }
}

class SmartTilemap extends Tilemap {
    baseTilemap: Tilemap.Tilemap;
    smartConfig: SmartTilemap.Util.SmartTilemapConfig;

    constructor(config: SmartTilemap.Config) {
        super(config);

        this.smartConfig = config.smartConfig;

        this.baseTilemap = this.tilemap;
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
            rules.push(...peninsulaRules('\\S', config.peninsulaUpIndex));
        }

        if (config.cornerTopLeftIndex !== undefined) {
            rules.push(...cornerRules('\\S', config.cornerTopLeftIndex));
        }

        if (config.doubleEdgeHorizontalIndex !== undefined) {
            rules.push(...doubleEdgeRules('\\S', config.doubleEdgeHorizontalIndex));
        }

        if (config.edgeUpIndex !== undefined) {
            rules.push(...edgeRules('\\S', config.edgeUpIndex));
        }

        if (config.inverseCornerTopLeftIndex !== undefined) {
            rules.push(...inverseCornerRules('\\S', config.inverseCornerTopLeftIndex));
        }

        rules.push(genericRule(' ', config.airIndex));
        rules.push(genericRule('\\S', config.solidIndex));

        return rules;
    }

    export function peninsulaRules(testString: string, peninsulaUpIndex: number): Rule[] {
        let testAgainst = `[^${testString}]`;
        return [
            { pattern: new RegExp(`.${testAgainst}.${testAgainst}${testString}${testAgainst}...`), tile: { index: peninsulaUpIndex, angle: 0, flipX: false } },     // Up
            { pattern: new RegExp(`.${testAgainst}..${testString}${testAgainst}.${testAgainst}.`), tile: { index: peninsulaUpIndex, angle: 90, flipX: false } },    // Right
            { pattern: new RegExp(`...${testAgainst}${testString}${testAgainst}.${testAgainst}.`), tile: { index: peninsulaUpIndex, angle: 180, flipX: false } },   // Down
            { pattern: new RegExp(`.${testAgainst}.${testAgainst}${testString}..${testAgainst}.`), tile: { index: peninsulaUpIndex, angle: 270, flipX: false } },   // Left
        ];
    }

    export function cornerRules(testString: string, cornerTopLeftIndex: number): Rule[] {
        let testAgainst = `[^${testString}]`;
        return [
            { pattern: new RegExp(`.${testAgainst}.${testAgainst}${testString}....`), tile: { index: cornerTopLeftIndex, angle: 0, flipX: false } },    // Top-left
            { pattern: new RegExp(`.${testAgainst}..${testString}${testAgainst}...`), tile: { index: cornerTopLeftIndex, angle: 90, flipX: false } },   // Top-right
            { pattern: new RegExp(`....${testString}${testAgainst}.${testAgainst}.`), tile: { index: cornerTopLeftIndex, angle: 180, flipX: false } },  // Bottom-right
            { pattern: new RegExp(`...${testAgainst}${testString}..${testAgainst}.`), tile: { index: cornerTopLeftIndex, angle: 270, flipX: false } },  // Bottom-left
        ];
    }

    export function doubleEdgeRules(testString: string, doubleEdgeHorizontalIndex: number): Rule[] {
        let testAgainst = `[^${testString}]`;
        return [
            { pattern: new RegExp(`.${testAgainst}..${testString}..${testAgainst}.`), tile: { index: doubleEdgeHorizontalIndex, angle: 0, flipX: false } },     // Horizontal
            { pattern: new RegExp(`....${testString}${testAgainst}${testAgainst}..`), tile: { index: doubleEdgeHorizontalIndex, angle: 90, flipX: false } },    // Vertical
        ];
    }

    export function edgeRules(testString: string, edgeUpIndex: number): Rule[] {
        let testAgainst = `[^${testString}]`;
        return [
            { pattern: new RegExp(`.${testAgainst}..${testString}....`), tile: { index: edgeUpIndex, angle: 0, flipX: false } },    // Up
            { pattern: new RegExp(`....${testString}${testAgainst}...`), tile: { index: edgeUpIndex, angle: 90, flipX: false } },   // Right
            { pattern: new RegExp(`....${testString}..${testAgainst}.`), tile: { index: edgeUpIndex, angle: 180, flipX: false } },  // Down
            { pattern: new RegExp(`...${testAgainst}${testString}....`), tile: { index: edgeUpIndex, angle: 270, flipX: false } },  // Left
        ];
    }

    export function inverseCornerRules(testString: string, inverseCornerTopLeftIndex: number): Rule[] {
        let testAgainst = `[^${testString}]`;
        return [
            { pattern: new RegExp(`${testAgainst}...${testString}....`), tile: { index: inverseCornerTopLeftIndex, angle: 0, flipX: false } },      // Top-left
            { pattern: new RegExp(`..${testAgainst}.${testString}....`), tile: { index: inverseCornerTopLeftIndex, angle: 90, flipX: false } },     // Top-right
            { pattern: new RegExp(`....${testString}...${testAgainst}`), tile: { index: inverseCornerTopLeftIndex, angle: 180, flipX: false } },    // Bottom-right
            { pattern: new RegExp(`....${testString}.${testAgainst}..`), tile: { index: inverseCornerTopLeftIndex, angle: 270, flipX: false } },    // Bottom-left
        ];
    }

    export function genericRule(inString: string, outIndex: number): Rule {
        return { pattern: new RegExp(`....${inString}....`), tile: { index: outIndex, angle: 0, flipX: false } };
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

            if (!emptyRule || emptyRule.type === 'noop') {
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
