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

    export function fadeSlides(duration: number, removeAllButLast: number = 1): Script.Function {
        return {
            generator: function*() {
                Main.theater.clearSlides(removeAllButLast);
                if (_.isEmpty(Main.theater.slides)) return;

                let slideAlphas = Main.theater.slides.map(slide => slide.alpha);

                let timer = new Timer(duration);
                while (!timer.done) {
                    for (let i = 0; i < Main.theater.slides.length; i++) {
                        Main.theater.slides[i].alpha = slideAlphas[i] * (1 - timer.progress);
                    }
                    timer.update(S.global.delta);
                    yield;
                }
            },
            endState: () => {
                Main.theater.clearSlides();
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
                    timer.update(S.global.delta);
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
                S.global.world.camera.shakeIntensity = intensity;
                let timer = new Timer(time);
                while (!timer.done) {
                    timer.update(S.global.delta);
                    yield;
                }
            },
            endState: () => {
                S.global.world.camera.shakeIntensity = 0;
            }
        }
    }

    export function showSlide(config: Slide.Config, waitForCompletion: boolean = true): Script.Function {
        let slide: Slide;
        return {
            generator: function*() {
                slide = Main.theater.addSlideByConfig(config);
                if (waitForCompletion) {
                    while (!slide.fullyLoaded) {
                        yield;
                    }
                }
            },
            endState: () => {
                if (!slide) {
                    slide = Main.theater.addSlideByConfig(config);
                }
                slide.finishLoading();
            }
        }
    }
}