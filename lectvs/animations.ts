/// <reference path="./utils/a_array.ts" />

namespace Animation {
    export type Config = {
        name: string;
        frames: Animation.Frame[];
    }

    export type Frame = {
        duration?: number;
        nextFrameRef?: string;
        forceRequired?: boolean;
    
        texture?: string;
    }

    export namespace Configs {
        export type FromTextureList = {
            name: string;
            textures: (string | number)[];
            texturePrefix?: string;
            frameRate: number;
            nextFrameRef?: string;
            count?: number;
            forceRequired?: boolean;
        }
    }
}

class Animations {
    static emptyList(...names: string[]): Animation.Config[] {
        if (_.isEmpty(names)) return [];
        return names.map(name => { return { name: name, frames: [] }; })
    }

    static fromTextureList(config: Animation.Configs.FromTextureList): Animation.Config {
        _.defaults(config, {
            texturePrefix: "",
            count: 1,
        });

        if (config.count < 0) {
            config.nextFrameRef = `${config.name}/0`;
            config.count = 1;
        }

        let frameDuration = 1 / config.frameRate;
        let textures = A.repeat(config.textures, config.count);
        
        let result: Animation.Config = {
            name: config.name,
            frames: [],
        };

        if (_.isEmpty(textures)) {
            return result;
        }

        for (let i = 0; i < textures.length; i++) {
            let animationFrame: Animation.Frame = {
                duration: frameDuration,
                texture: `${config.texturePrefix}${textures[i]}`,
                nextFrameRef: `${config.name}/${i+1}`,
                forceRequired: config.forceRequired,
            };

            result.frames.push(animationFrame);
        }

        result.frames[result.frames.length - 1].nextFrameRef = config.nextFrameRef;

        return result;
    }
}