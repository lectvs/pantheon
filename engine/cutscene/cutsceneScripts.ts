namespace S {
    export function clearFades(duration: number) {
        let fadeScript = global.theater.clearFades(duration);
        return S.waitUntil(() => fadeScript.isDone);
    }

    export function dialog(profileKey: string, text: string): Script.Function {
        return function*() {
            if (!global.theater.dialogBox) return;
            let [profile, entry] = DialogProfile.splitKey(profileKey);
            global.theater.dialogBox.setProfile(profile, entry);
            global.theater.dialogBox.showDialog(text);
            while (!global.theater.dialogBox.isDone) {
                yield;
            }
        }
    }

    export function dialogAdd(profileKey: string, text: string): Script.Function {
        return function*() {
            if (!global.theater.dialogBox) return;
            let [profile, entry] = DialogProfile.splitKey(profileKey);
            global.theater.dialogBox.setProfile(profile, entry);
            global.theater.dialogBox.addToDialog(text);
            while (!global.theater.dialogBox.isDone) {
                yield;
            }
        }
    }

    export function fade(duration: number, color: number = 0x000000): Script.Function {
        let fadeScript = global.theater.fade(duration, color);
        return S.waitUntil(() => fadeScript.isDone);
    }

    export function jumpZ(duration: number, sprite: Sprite, peakDelta: number, landOnGround: boolean = false): Script.Function {
        return function*() {
            let start = sprite.z;
            let groundDelta = landOnGround ? start : 0;

            yield S.doOverTime(duration, t => {
                sprite.z = M.jumpParabola(start, peakDelta, groundDelta, t);
            });
        }
    }

    export function moveTo(worldObject: WorldObject, x: number, y: number, maxTime: number = 10): Script.Function {
        return simul(
            moveToX(worldObject, x, maxTime),
            moveToY(worldObject, y, maxTime),
        );
    }

    export function moveToX(worldObject: WorldObject, x: number, maxTime: number = 10): Script.Function {
        return function*() {
            let dx = x - worldObject.x;
            if (dx === 0) return;

            let timer = new Timer(maxTime);
            if (dx > 0) {
                while (worldObject.x < x && !timer.isDone) {
                    worldObject.controller.right = true;
                    worldObject.controller.setMoveDirectionByLRUD();
                    timer.update(global.script.delta);
                    yield;
                }
            } else {
                while (worldObject.x > x && !timer.isDone) {
                    worldObject.controller.left = true;
                    worldObject.controller.setMoveDirectionByLRUD();
                    timer.update(global.script.delta);
                    yield;
                }
            }

            worldObject.x = x;
        }
    }

    export function moveToY(worldObject: WorldObject, y: number, maxTime: number = 10): Script.Function {
        return function*() {
            let dy = y - worldObject.y;
            if (dy === 0) return;

            let timer = new Timer(maxTime);
            if (dy > 0) {
                while (worldObject.y < y && !timer.isDone) {
                    worldObject.controller.down = true;
                    worldObject.controller.setMoveDirectionByLRUD();
                    timer.update(global.script.delta);
                    yield;
                }
            } else {
                while (worldObject.y > y && !timer.isDone) {
                    worldObject.controller.up = true;
                    worldObject.controller.setMoveDirectionByLRUD();
                    timer.update(global.script.delta);
                    yield;
                }
            }

            worldObject.y = y;
        }
    }

    /**
     * Play an animation on a WorldObject
     * @param force default true
     * @param waitForCompletion default true
     */
    export function playAnimation(worldObject: WorldObject, animationName: string, force: boolean | 'force' = true, waitForCompletion: boolean = true): Script.Function {
        return function*() {
            worldObject.playAnimation(animationName, force);
            if (waitForCompletion) {
                while (worldObject.getCurrentAnimationName() === animationName) {
                    yield;
                }
            }
        }
    }

    export function shake(world: World | undefined, intensity: number, time: number): Script.Function {
        return function*() {
            if (!world) return;
            if (world.camera.shakeIntensity >= intensity) return;
            world.camera.shakeIntensity += intensity;
            let timer = new Timer(time);
            while (!timer.isDone) {
                timer.update(global.script.delta);
                yield;
            }
            world.camera.shakeIntensity -= intensity;
        }
    }
}