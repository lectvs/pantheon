namespace S {
    export function dialog(p1: string, p2?: string): Script.Function {
        return {
            generator: function*() {
                if (p2) {
                    global.theater.dialogBox.showPortrait(p1);
                    global.theater.dialogBox.showDialog(p2);
                } else {
                    global.theater.dialogBox.showDialog(p1);
                }
                while (!global.theater.dialogBox.done) {
                    yield;
                }
            },
            endState: () => {
                global.theater.dialogBox.done = true;
            }
        }
    }

    export function exitUp(sprite: Sprite): Script.Function {
        return {
            generator: function*() {
                let script = global.world.runScript(moveTo(sprite, 0, sprite.y - 1000));
                while (!script.done || Main.theater.stageLoadQueue) {
                    yield;
                }
            },
            endState: () => {

            }
        }
    }

    export function fadeSlides(duration: number, removeAllButLast: number = 1): Script.Function {
        return {
            generator: function*() {
                global.theater.clearSlides(removeAllButLast);
                if (_.isEmpty(global.theater.slides)) return;

                let slideAlphas = global.theater.slides.map(slide => slide.alpha);

                let timer = new Timer(duration);
                while (!timer.done) {
                    for (let i = 0; i < global.theater.slides.length; i++) {
                        global.theater.slides[i].alpha = slideAlphas[i] * (1 - timer.progress);
                    }
                    timer.update();
                    yield;
                }
            },
            endState: () => {
                global.theater.clearSlides();
            }
        }
    }

    export function fadeOut(duration: number, tint: number = 0x000000): Script.Function {
        let texture = new Texture(Main.width, Main.height);
        Draw.brush.color = tint;
        Draw.brush.alpha = 1;
        Draw.fill(texture);
        return showSlide({ x: 0, y: 0, texture: texture, timeToLoad: duration, fadeIn: true });
    }

    export function jump(sprite: Sprite, peakDelta: number, time: number, landOnGround: boolean = false): Script.Function {
        let start = sprite.offset.y;
        let groundDelta = landOnGround ? -start : 0;
        return {
            generator: function*() {
                let timer = new Timer(time);
                while (!timer.done) {
                    sprite.offset.y = M.jumpParabola(start, -peakDelta, groundDelta, timer.progress);
                    timer.update();
                    yield;
                }
            },
            endState: () => {
                sprite.offset.y = start + groundDelta;
            }
        }
    }

    export function moveTo(worldObject: WorldObject, x: number, y: number, maxTime: number = 10) {
        return simul(
            moveToX(worldObject, x, maxTime),
            moveToY(worldObject, y, maxTime),
        );
    }

    export function moveToX(worldObject: WorldObject, x: number, maxTime: number = 10) {
        return {
            generator: function*() {
                let dx = x - worldObject.x;
                if (dx === 0) return;

                let timer = new Timer(maxTime);
                if (dx > 0) {
                    while (worldObject.x < x && !timer.done) {
                        worldObject.controller.right = true;
                        timer.update();
                        yield;
                    }
                } else {
                    while (worldObject.x > x && !timer.done) {
                        worldObject.controller.left = true;
                        timer.update();
                        yield;
                    }
                }
            },
            endState: () => {
                worldObject.x = x;
            }
        }
    }

    export function moveToY(worldObject: WorldObject, y: number, maxTime: number = 10) {
        return {
            generator: function*() {
                let dy = y - worldObject.y;
                if (dy === 0) return;

                let timer = new Timer(maxTime);
                if (dy > 0) {
                    while (worldObject.y < y && !timer.done) {
                        worldObject.controller.down = true;
                        timer.update();
                        yield;
                    }
                } else {
                    while (worldObject.y > y && !timer.done) {
                        worldObject.controller.up = true;
                        timer.update();
                        yield;
                    }
                }
            },
            endState: () => {
                worldObject.y = y;
            }
        }
    }

    export function playAnimation(sprite: Sprite, animationName: string, startFrame: number = 0, force: boolean = true, waitForCompletion: boolean = true): Script.Function {
        return {
            generator: function*() {
                sprite.playAnimation(animationName, startFrame, force);
                if (waitForCompletion) {
                    while (sprite.getCurrentAnimationName() === animationName) {
                        yield;
                    }
                }
            }
        }
    }

    export function shake(intensity: number, time: number) {
        return {
            generator: function*() {
                global.world.camera.shakeIntensity = intensity;
                let timer = new Timer(time);
                while (!timer.done) {
                    timer.update();
                    yield;
                }
            },
            endState: () => {
                global.world.camera.shakeIntensity = 0;
            }
        }
    }

    export function showSlide(config: Slide.Config, waitForCompletion: boolean = true): Script.Function {
        let slide: Slide;
        return {
            generator: function*() {
                slide = global.theater.addSlideByConfig(config);
                if (waitForCompletion) {
                    while (!slide.fullyLoaded) {
                        yield;
                    }
                }
            },
            endState: () => {
                if (!slide) {
                    slide = global.theater.addSlideByConfig(config);
                }
                slide.finishLoading();
            }
        }
    }
}