namespace S {
    export function dialog(text: string): Script.Function {
        return {
            generator: function*() {
                Main.theater.dialogBox.showDialog(text);
                while (!Main.theater.dialogBox.done) {
                    yield;
                }
            },
            endState: () => {
                Main.theater.dialogBox.done = true;
            }
        }
    }

    export function jump(sprite: Sprite, peakDelta: number, time: number, landOnGround: boolean = false): Script.Function {
        let start = sprite.offset.y;
        let groundDelta = landOnGround ? -start : 0;
        return {
            generator: function*() {
                let t = new Timer(time);
                while (!t.done) {
                    sprite.offset.y = M.jumpParabola(start, -peakDelta, groundDelta, t.progress);
                    t.update(S.global.delta);
                    yield;
                }
            },
            endState: () => {
                sprite.offset.y = start + groundDelta;
            }
        }
    }

    export function playAnimation(sprite: Sprite, animationName: string, startFrame: number = 0, force: boolean = true, waitForCompletion: boolean = true): Script.Function {
        return {
            generator: function*() {
                sprite.playAnimation(animationName, startFrame, force);
                while (waitForCompletion && sprite.getCurrentAnimationName() == animationName) {
                    yield;
                }
            }
        }
    }
}