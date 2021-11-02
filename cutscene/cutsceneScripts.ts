namespace S {
    export function cameraTransition(duration: number, toMode: Camera.Mode, toMovement?: Camera.Movement, easingFunction: Tween.Easing.Function = Tween.Easing.OutExp): Script.Function {
        return function*() {
            let camera = global.world.camera;

            if (!toMovement) toMovement = camera.movement;

            let cameraPoint = vec2(camera.x, camera.y);
            camera.setModeFollow(cameraPoint);
            camera.setMovementSnap();

            let startPoint = vec2(cameraPoint.x, cameraPoint.y);

            yield S.doOverTime(duration, t => {
                let toPoint = toMode.getTargetPt(camera);
                cameraPoint.x = M.lerp(startPoint.x, toPoint.x, easingFunction(t));
                cameraPoint.y = M.lerp(startPoint.y, toPoint.y, easingFunction(t));
                camera.snapPosition();
            });

            camera.setMode(toMode);
            camera.setMovement(toMovement);
        }
    }

    export function dialog(profileKey: string, text: string): Script.Function {
        return function*() {
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
            let [profile, entry] = DialogProfile.splitKey(profileKey);
            global.theater.dialogBox.setProfile(profile, entry);
            global.theater.dialogBox.addToDialog(text);
            while (!global.theater.dialogBox.done) {
                yield;
            }
        }
    }

    export function fadeSlides(duration: number): Script.Function {
        return function*() {
            if (_.isEmpty(global.theater.slides)) return;

            let slideAlphas = global.theater.slides.map(slide => slide.alpha);

            let timer = new Timer(duration);
            while (!timer.done) {
                for (let i = 0; i < global.theater.slides.length; i++) {
                    global.theater.slides[i].alpha = slideAlphas[i] * (1 - timer.progress);
                }
                timer.update(global.script.delta);
                yield;
            }

            global.theater.clearSlides();
        }
    }

    export function fadeOut(duration: number = 0, tint: number = 0x000000): Script.Function {
        return showSlide(() => {
            let slide = new Slide({ timeToLoad: duration, fadeIn: true });
            slide.setTexture(Texture.filledRect(global.gameWidth, global.gameHeight, tint));
            return slide;
        });
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
            global.world.camera.shakeIntensity += intensity;
            let timer = new Timer(time);
            while (!timer.done) {
                timer.update(global.script.delta);
                yield;
            }
            global.world.camera.shakeIntensity -= intensity;
        }
    }

    export function showSlide(factory: Factory<Slide>, waitForCompletion: boolean = true): Script.Function {
        let slide: Slide;
        return function*() {
            slide = global.theater.addSlide(factory());
            if (waitForCompletion) {
                while (!slide.fullyLoaded) {
                    yield;
                }
            }
        }
    }
}