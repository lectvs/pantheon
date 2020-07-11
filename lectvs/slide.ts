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
            x: global.gameWidth/2,
            y: global.gameHeight/2,
        });
        this.timer = new Timer(config.timeToLoad ?? 0);

        if (config.fadeIn) {
            this.targetAlpha = this.alpha;
            this.alpha = 0;
        }

        this.fullyLoaded = false;
    }

    update(delta: number) {
        super.update(delta);
        if (this.fullyLoaded) return;
        
        this.timer.update(delta);
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