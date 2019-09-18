
namespace Group {
    export type Config = {
        worldObjects: SomeStageConfig[];
        overrides?: SomeStageConfig[];
        x?: number;
        y?: number;
        prefix?: string;
    }
}

function group(config: Group.Config) {
    _.defaults(config, {
        overrides: [],
        x: 0, y: 0,
        prefix: '',
    });

    let results = config.worldObjects.map(obj => Stage.resolveWorldObjectConfig(obj));

    for (let override of config.overrides) {
        for (let i = 0; i < results.length; i++) {
            if (results[i].name === override.name) {
                override = Stage.resolveWorldObjectConfig(override);
                override.parent = results[i];
                delete override.name;
                results[i] = override;
                break;
            }

            if (i === results.length - 1) {
                debug("No world object in group that matches override", override);
            }
        }
    }

    for (let i = 0; i < results.length; i++) {
        results[i].x = config.x + O.getOrDefault(config.worldObjects[i].x, 0);
        results[i].y = config.y + O.getOrDefault(config.worldObjects[i].y, 0);
        results[i].name = config.prefix + O.getOrDefault(config.worldObjects[i].name, '');
    }

    return results;
}