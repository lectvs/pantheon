namespace S {
    export function cameraTransition(duration: number, toMode: Camera.Mode, toMovement?: Camera.Movement, easingFunction: Tween.Easing.Function = Tween.Easing.OutExp): Script.Function {
        return function*() {
            if (!global.world) return;
            let camera = global.world.camera;

            if (!toMovement) toMovement = camera.movement;

            let cameraPoint = vec2(camera.x, camera.y);
            camera.setModeFollow(cameraPoint);
            camera.setMovementSnap();

            let startPoint = vec2(cameraPoint.x, cameraPoint.y);

            yield S.doOverTime(duration, t => {
                let toPoint = toMode.getTargetPt(camera);
                cameraPoint.x = M.lerp(t, startPoint.x, toPoint.x, easingFunction);
                cameraPoint.y = M.lerp(t, startPoint.y, toPoint.y, easingFunction);
                camera.snapPosition();
            });

            camera.setMode(toMode);
            camera.setMovement(toMovement);
        }
    }

    export function clearFades(duration: number) {
        let fadeScript = global.theater.clearFades(duration);
        return S.waitUntil(() => fadeScript.done);
    }

    export function dialog(profileKey: string, text: string): Script.Function {
        return function*() {
            if (!global.theater.dialogBox) return;
            let [profile, entry] = DialogProfile.splitKey(profileKey);
            global.theater.dialogBox.setProfile(profile, entry);
            global.theater.dialogBox.showDialog(text);
            while (!global.theater.dialogBox.done) {
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
            while (!global.theater.dialogBox.done) {
                yield;
            }
        }
    }

    export function fade(duration: number, color: number = 0x000000): Script.Function {
        let fadeScript = global.theater.fade(duration, color);
        return S.waitUntil(() => fadeScript.done);
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
                while (worldObject.x < x && !timer.done) {
                    worldObject.controller.right = true;
                    timer.update(global.script.delta);
                    yield;
                }
            } else {
                while (worldObject.x > x && !timer.done) {
                    worldObject.controller.left = true;
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
                while (worldObject.y < y && !timer.done) {
                    worldObject.controller.down = true;
                    timer.update(global.script.delta);
                    yield;
                }
            } else {
                while (worldObject.y > y && !timer.done) {
                    worldObject.controller.up = true;
                    timer.update(global.script.delta);
                    yield;
                }
            }

            worldObject.y = y;
        }
    }

    export function playAnimation(sprite: Sprite, animationName: string, force: boolean = true, waitForCompletion: boolean = true): Script.Function {
        return function*() {
            sprite.playAnimation(animationName, force);
            if (waitForCompletion) {
                while (sprite.getCurrentAnimationName() === animationName) {
                    yield;
                }
            }
        }
    }

    export function shake(intensity: number, time: number): Script.Function {
        return function*() {
            if (!global.world) return;
            global.world.camera.shakeIntensity += intensity;
            let timer = new Timer(time);
            while (!timer.done) {
                timer.update(global.script.delta);
                yield;
            }
            global.world.camera.shakeIntensity -= intensity;
        }
    }
}