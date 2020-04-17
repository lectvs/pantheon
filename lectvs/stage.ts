type SomeWorldObjectConfig =
        | WorldObject.Config
        | World.Config
        | PhysicsWorldObject.Config
        | Sprite.Config
        | SpriteText.Config
        | Tilemap.Config;

type Stage = World.Config & {
    parent?: Stage;
    entryPoints?: Dict<Pt>;
    worldObjects?: SomeWorldObjectConfig[];
};

namespace Stage {
    export type EntryPoint = string | Pt;

    export function getEntryPoint(stage: Stage, entryPointKey: string) {
        if (!stage.entryPoints || !stage.entryPoints[entryPointKey]) {
            debug(`Stage does not have an entry point named '${entryPointKey}:'`, stage);
            return undefined;
        }
        return stage.entryPoints[entryPointKey];
    }

    export function resolveConfig(config: Stage): Stage {
        if (!config.parent) return _.clone(config);

        let result = Stage.resolveConfig(config.parent);

        for (let key in config) {
            if (key === 'parent') continue;
            if (!result[key]) {
                result[key] = config[key];
            } else if (key === 'worldObjects') {
                result[key] = A.mergeArray(config[key], result[key], (e: WorldObject.Config) => e.name,
                    (e: WorldObject.Config, into: WorldObject.Config) => {
                        e = WorldObject.resolveConfig(e);
                        e.parent = into;
                        return WorldObject.resolveConfig(e);
                    });
            } else if (key === 'entryPoints') {
                result[key] = O.mergeObject(config[key], result[key]);
            } else if (key === 'layers') {
                result[key] = A.mergeArray(config[key], result[key], (e: World.LayerConfig) => e.name,
                    (e: World.LayerConfig, into: World.LayerConfig) => {
                        return O.mergeObject(e, into);
                    });
            } else {
                result[key] = config[key];
            }
        }

        return result;
    }
}