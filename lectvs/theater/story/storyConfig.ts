namespace StoryConfig {
    export type Config = {
        initialConfig: any;
        executeFn: ExecuteFn;
    }

    export type ExecuteFn = (storyConfig: StoryConfig) => any;
}

class StoryConfig {
    theater: Theater;
    config: any;
    executeFn: StoryConfig.ExecuteFn;

    constructor(theater: Theater, config: StoryConfig.Config) {
        this.theater = theater;
        this.config = O.deepClone(config.initialConfig);
        this.executeFn = config.executeFn;
    }

    execute() {
        this.executeFn(this);
    }

    updateConfig(config: any) {
        O.deepOverride(this.config, config);

        for (let key in config) {
            if (this.config[key] === undefined) {
                this.config[key] = config[key];
            }
        }
    }
}

namespace StoryConfig {
    export const EMPTY: StoryConfig.Config = {
        initialConfig: {},
        executeFn: sc => null,
    }
}