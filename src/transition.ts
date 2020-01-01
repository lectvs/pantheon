type Transition = {
    type: 'instant';
} | {
    type: 'fade';
    preTime: number;
    time: number;
    postTime: number;
}

namespace Transition {
    export const INSTANT: Transition = { type: 'instant' };
    export function FADE(preTime: number, time: number, postTime: number): Transition {
        return {
            type: 'fade', preTime, time, postTime
        };
    }

    export class Obj extends WorldObject {
        oldSprite: Sprite;
        newSprite: Sprite;
        done: boolean;

        constructor(oldSnapshot: Texture, newSnapshot: Texture, transition: Transition) {
            super({});

            this.oldSprite = new Sprite({ texture: oldSnapshot });
            this.newSprite = new Sprite({ texture: newSnapshot });
            this.done = false;

            if (transition.type === 'instant') {
                this.done = true;
            } else if (transition.type === 'fade') {
                this.oldSprite.alpha = 1;
                this.newSprite.alpha = 0;
                global.theater.runScript({
                    generator: S.chain(
                        S.wait(transition.preTime),
                        S.doOverTime(transition.time, t => {
                            this.oldSprite.alpha = 1 - t;
                            this.newSprite.alpha = t;
                        }),
                        S.wait(transition.postTime),
                    ).generator,
                    endState: () => (this.done = true),
                });
            }
        }

        update() {
            super.update();
        }

        render() {
            super.render();
            this.newSprite.render();
            this.oldSprite.render();
        }
    }
}
