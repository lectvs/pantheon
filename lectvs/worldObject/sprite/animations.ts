/// <reference path="../../utils/a_array.ts" />

namespace Animation {
    export type Config = {
        name: string;
        frames: Animation.Frame[];
    }

    export type Frame = {
        duration?: number;
        nextFrameRef?: string;
        forceRequired?: boolean;
        callback?: () => any;
    
        texture?: string | Texture;
    }

    export namespace Configs {
        export type FromTextureList = {
            name: string;
            textures: (string | Texture | number)[];
            texturePrefix?: string;
            frameRate: number;
            nextFrameRef?: string;
            count?: number;
            oneOff?: boolean;
            overrides?: {[frame: number]: Frame};
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

        if (config.count < 0 || !isFinite(config.count)) {
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

        let texturePrefix = !config.texturePrefix ? "" : `${config.texturePrefix}_`;

        for (let i = 0; i < textures.length; i++) {
            let animationFrame: Animation.Frame = {
                duration: frameDuration,
                texture: (_.isString(textures[i]) || _.isNumber(textures[i])) ? `${texturePrefix}${textures[i]}` : <Texture>textures[i],
                nextFrameRef: `${config.name}/${i+1}`,
                forceRequired: config.oneOff,
            };

            result.frames.push(animationFrame);
        }

        result.frames[result.frames.length - 1].nextFrameRef = config.nextFrameRef;

        if (config.overrides) {
            for (let key in config.overrides) {
                let frame = <number><any>key;
                result.frames[frame] = this.overrideFrame(result.frames[frame], config.overrides[key]);
            }
        }

        return result;
    }

    private static overrideFrame(frame: Animation.Frame, override: Animation.Frame) {
        return O.withOverrides(frame, override);
    }
}