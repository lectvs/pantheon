type AllStageConfig  = WorldObject.StageConfig & World.StageConfig & PhysicsWorldObject.StageConfig & Sprite.StageConfig & SpriteText.StageConfig & Tilemap.StageConfig;
type SomeStageConfig = WorldObject.StageConfig | World.StageConfig | PhysicsWorldObject.StageConfig | Sprite.StageConfig | SpriteText.StageConfig | Tilemap.StageConfig;

type Stage = World.Config & {
    parent?: Stage;
    entryPoints?: Dict<Pt>;
    worldObjects?: SomeStageConfig[];
};

namespace WorldObject {
    export type StageConfig = Config & {
        name?: string;
        parent?: SomeStageConfig;
        constructor?: any;
        layer?: string;
    }
}

namespace World {
    export type StageConfig = Config & WorldObject.StageConfig & {
        
    };
}

namespace PhysicsWorldObject {
    export type StageConfig = Config & WorldObject.StageConfig & {
        physicsGroup?: string;
    }
}

namespace Sprite {
    export type StageConfig = Sprite.Config & PhysicsWorldObject.StageConfig & {
        
    }
}

namespace SpriteText {
    export type StageConfig = SpriteText.Config & WorldObject.StageConfig & {

    }
}

namespace Tilemap {
    export type StageConfig = Tilemap.Config & WorldObject.StageConfig & {

    }
}

namespace Stage {
    export type EntryPoint = string | Pt;

    export function getEntryPoint(stage: Stage, entryPointKey: string) {
        if (!stage.entryPoints || !stage.entryPoints[entryPointKey]) {
            debug(`Stage does not have an entry point named '${entryPointKey}:'`, stage);
            return undefined;
        }
        return stage.entryPoints[entryPointKey];
    }

    export function resolveStageConfig(config: Stage) {
        if (!config.parent) return _.clone(config);

        let result = resolveStageConfig(config.parent);

        for (let key in config) {
            if (key === 'parent') continue;
            if (!result[key]) {
                result[key] = config[key];
            } else if (key === 'worldObjects') {
                result[key] = mergeArray(config[key], result[key], (e: WorldObject.StageConfig) => e.name,
                    (e: WorldObject.StageConfig, into: WorldObject.StageConfig) => {
                        e = resolveWorldObjectConfig(e);
                        e.parent = into;
                        return resolveWorldObjectConfig(e);
                    });
            } else if (key === 'entryPoints') {
                result[key] = mergeObject(config[key], result[key]);
            } else {
                result[key] = config[key];
            }
        }

        return result;
    }

    export function resolveWorldObjectConfig(config: SomeStageConfig) {
        if (!config.parent) return _.clone(config);

        let result = resolveWorldObjectConfig(config.parent);

        for (let key in config) {
            if (key === 'parent') continue;
            if (!result[key]) {
                result[key] = config[key];
            } else if (key === 'animations') {
                result[key] = mergeArray(config[key], result[key], (e: Animation.Config) => e.name);
            } else if (key === 'data') {
                result[key] = O.withOverrides(result[key], config[key]);
            } else {
                result[key] = config[key];
            }
        }

        return result;
    }

    function mergeArray<T>(array: T[], into: T[], key: (element: T) => any, combine: (e: T, into: T) => T = ((e, into) => e)) {
        let result = A.clone(into);
        for (let element of array) {
            let resultContainedKey = false;
            for (let i = 0; i < result.length; i++) {
                if (key(element) === key(result[i])) {
                    result[i] = combine(element, result[i]);
                    resultContainedKey = true;
                    break;
                }
            }
            if (!resultContainedKey) {
                result.push(element);
            }
        }
        return result;
    }

    function mergeObject<T>(obj: T, into: T, combine: (e: any, into: any) => any = ((e, into) => e)) {
        let result = _.clone(into);
        for (let key in obj) {
            if (result[key]) {
                result[key] = combine(obj[key], result[key]);
            } else {
                result[key] = obj[key];
            }
        }
        return result;
    }
}