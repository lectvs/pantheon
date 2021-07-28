/// <reference path="../worldObject/sprite/sprite.ts"/>

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
        super(config);

        let timeToLoad = config.timeToLoad ?? 0;
        this.timer = new Timer(timeToLoad);

        if (config.fadeIn) {
            this.targetAlpha = this.alpha;
            this.alpha = 0;
        }

        this.fullyLoaded = false;

        if (timeToLoad === 0) {
            this.finishLoading();
        }
    }

    update() {
        super.update();
        this.updateLoading();
    }

    private updateLoading() {
        if (this.fullyLoaded) return;
        
        this.timer.update(this.delta);
        if (this.targetAlpha !== undefined) {
            this.alpha = this.targetAlpha * this.timer.progress;
        }

        if (this.timer.done) {
            this.fullyLoaded = true;
        }
    }

    finishLoading() {
        this.timer.finish();
        this.updateLoading();
    }
}