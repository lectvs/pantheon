namespace Slide {
    export type Config = Sprite.Config & {
        timeToLoad?: number;

        fadeIn?: boolean
    }
}

class Slide extends Sprite {
    targetAlpha: number;

    private timer: Timer;
    fullyLoaded: boolean;

    constructor(config: Slide.Config) {
        super(config, {
            x: Main.width / 2,
            y: Main.height / 2,
        });
        this.timer = new Timer(O.getOrDefault(config.timeToLoad, 0));

        if (config.fadeIn) {
            this.targetAlpha = this.alpha;
            this.alpha = 0;
        }

        this.fullyLoaded = false;
    }

    update(options: UpdateOptions) {
        super.update(options);
        if (this.fullyLoaded) return;
        
        this.timer.update(options.delta);
        if (this.targetAlpha !== undefined) {
            this.alpha = this.targetAlpha * this.timer.progress;
        }

        if (this.timer.done) {
            this.fullyLoaded = true;
        }
    }

    finishLoading() {
        this.timer.finish();
    }
}