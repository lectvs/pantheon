namespace S {
    export function dialog(text: string): Script.Function {
        return {
            generator: function*() {
                global.theater.dialogBox.showDialog(text);
                while (!global.theater.dialogBox.done) {
                    yield;
                }
            },
            endState: () => {
                global.theater.dialogBox.done = true;
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
        let graphics = new PIXI.Graphics();
        graphics.beginFill(tint, 1);
        graphics.drawRect(0, 0, Main.width, Main.height);
        graphics.endFill();
        return showSlide({ x: 0, y: 0, graphics: graphics, timeToLoad: duration, fadeIn: true });
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