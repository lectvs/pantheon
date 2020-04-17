namespace S {
    export function dialog(p1: string, p2?: string): Script.Function {
        return function*() {
            if (p2) {
                global.script.theater.dialogBox.showPortrait(p1);
                global.script.theater.dialogBox.showDialog(p2);
            } else {
                global.script.theater.dialogBox.showDialog(p1);
            }
            while (!global.script.theater.dialogBox.done) {
                yield;
            }
        }
    }

    export function fadeSlides(duration: number): Script.Function {
        return function*() {
            if (_.isEmpty(global.script.theater.slides)) return;

            let slideAlphas = global.script.theater.slides.map(slide => slide.alpha);

            let timer = new Timer(duration);
            while (!timer.done) {
                for (let i = 0; i < global.script.theater.slides.length; i++) {
                    global.script.theater.slides[i].alpha = slideAlphas[i] * (1 - timer.progress);
                }
                timer.update(global.script.delta);
                yield;
            }

            global.script.theater.clearSlides();
        }
    }

    export function fadeOut(duration: number, tint: number = 0x000000): Script.Function {
        let texture = new Texture(global.gameWidth, global.gameHeight);
        Draw.brush.color = tint;
        Draw.brush.alpha = 1;
        Draw.fill(texture);
        return showSlide({ x: 0, y: 0, texture: texture, timeToLoad: duration, fadeIn: true });
    }

    export function jump(sprite: Sprite, peakDelta: number, time: number, landOnGround: boolean = false): Script.Function {
        return runInCurrentWorld(function*() {
            let start = sprite.offset.y;
            let groundDelta = landOnGround ? -start : 0;

            let timer = new Timer(time);
            while (!timer.done) {
                sprite.offset.y = M.jumpParabola(start, -peakDelta, groundDelta, timer.progress);
                timer.update(global.script.delta);
                yield;
            }
            sprite.offset.y = start + groundDelta;
        })
    }

    export function moveTo(worldObject: WorldObject, x: number, y: number, maxTime: number = 10): Script.Function {
        return simul(
            moveToX(worldObject, x, maxTime),
            moveToY(worldObject, y, maxTime),
        );
    }

    export function moveToX(worldObject: WorldObject, x: number, maxTime: number = 10): Script.Function {
        return runInCurrentWorld(function*() {
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
        })
    }

    export function moveToY(worldObject: WorldObject, y: number, maxTime: number = 10): Script.Function {
        return runInCurrentWorld(function*() {
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
        })
    }

    export function playAnimation(sprite: Sprite, animationName: string, startFrame: number = 0, force: boolean = true, waitForCompletion: boolean = true): Script.Function {
        return runInCurrentWorld(function*() {
            sprite.playAnimation(animationName, startFrame, force);
            if (waitForCompletion) {
                while (sprite.getCurrentAnimationName() === animationName) {
                    yield;
                }
            }
        })
    }

    export function runInCurrentWorld(script: Script.Function): Script.Function {
        return function*() {
            let scr = global.script.theater.currentWorld.runScript(script);
            while (!scr.done) {
                yield;
            }
        }
    }

    export function shake(intensity: number, time: number): Script.Function {
        return runInCurrentWorld(function*() {
            global.script.world.camera.shakeIntensity += intensity;
            let timer = new Timer(time);
            while (!timer.done) {
                timer.update(global.script.delta);
                yield;
            }
            global.script.world.camera.shakeIntensity -= intensity;
        })
    }

    export function showSlide(config: Slide.Config, waitForCompletion: boolean = true): Script.Function {
        let slide: Slide;
        return function*() {
            slide = global.script.theater.addSlideByConfig(config);
            if (waitForCompletion) {
                while (!slide.fullyLoaded) {
                    yield;
                }
            }
        }
    }
}