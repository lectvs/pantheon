/// <reference path="./worldObject.ts"/>

namespace Transition {
    export type Config = {
        type: 'instant';
    } | {
        type: 'fade';
        preTime: number;
        time: number;
        postTime: number;
    }
}

class Transition extends WorldObject {
    done: boolean;

    constructor() {
        super({});
        this.done = false;
    }
}

namespace Transition {
    export const INSTANT: Transition.Config = { type: 'instant' };
    export function FADE(preTime: number, time: number, postTime: number): Transition.Config {
        return {
            type: 'fade', preTime, time, postTime
        };
    }

    export function fromConfigAndSnapshots(config: Transition.Config, oldSnapshot: Texture, newSnapshot: Texture) {
        if (config.type === 'instant') {
            return new Instant();
        }

        if (config.type === 'fade') {
            return new Fade(oldSnapshot, newSnapshot, config.preTime, config.time, config.postTime);
        }

        // @ts-ignore
        error(`Transition type ${config.type} not found.`);
        return undefined;
    }

    class Instant extends Transition {
        constructor() {
            super();
            this.done = true;
        }
    }

    class Fade extends Transition {
        private oldSnapshot: Texture;
        private newSnapshot: Texture;
        private newAlpha: number;

        constructor(oldSnapshot: Texture, newSnapshot: Texture, preTime: number, time: number, postTime: number) {
            super();
            this.oldSnapshot = oldSnapshot;
            this.newSnapshot = newSnapshot;
            this.newAlpha = 0;

            global.theater.runScript(S.chain(
                S.wait(preTime),
                S.doOverTime(time, t => {
                    this.newAlpha = t;
                }),
                S.wait(postTime),
                S.call(() => this.done = true),
            ));
        }

        render(screen: Texture) {
            super.render(screen);
            screen.render(this.oldSnapshot);
            screen.render(this.newSnapshot, {
                alpha: this.newAlpha
            });
        }
    }
}
