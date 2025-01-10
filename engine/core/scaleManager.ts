namespace ScaleManager {
    export type ExpandDirection = 'horizontal' | 'vertical' | 'none';
    export type ScaleMode = 'canvas' | 'upscale' | 'mobilesmallscreen';
}

class ScaleManager {
    private static scaleMode: ScaleManager.ScaleMode;
    private static expandDirection: ScaleManager.ExpandDirection;
    private static windowedScale: number;

    private static currentCanvasWidth: number;
    private static currentCanvasHeight: number;

    static init(config: Main.Config) {
        this.scaleMode = config.scaling.scaleMode;
        this.expandDirection = config.scaling.expandDirection;
        this.windowedScale = config.scaling.windowedScale;
        this.scale();
    }

    static update() {
        if (this.currentCanvasWidth !== this.getTargetWidth() || this.currentCanvasHeight !== this.getTargetHeight()) {
            this.scale();
        }
    }

    private static scale() {
        if (this.isFullscreen()) {
            this.scaleFullscreen();
        } else {
            this.scaleWindowed();
        }
    }

    private static scaleFullscreen() {
        let newScale = this.getScale();
        let upscale: number;

        if (this.scaleMode === 'canvas') {
            Main.rendererView.style.transform = `scale(${newScale})`;
            upscale = 1;
        } else if (this.scaleMode === 'upscale') {
            Main.rendererView.style.transform = '';
            upscale = newScale;
        } else {
            Main.rendererView.style.transform = `scale(${newScale / 5})`;
            upscale = 5;
        }

        this.resize(upscale);

        this.currentCanvasWidth = window.innerWidth;
        this.currentCanvasHeight = window.innerHeight;
    }

    private static scaleWindowed() {
        let canvasScale = this.getWindowedCanvasScaleFor({
            scaleMode: this.scaleMode,
            expandDirection: this.expandDirection,
            windowedScale: this.windowedScale,
        });
        let upscale = this.getWindowedUpscaleFor({
            scaleMode: this.scaleMode,
            expandDirection: this.expandDirection,
            windowedScale: this.windowedScale,
        });

        Main.rendererView.style.transform = `scale(${canvasScale})`;
        
        this.resize(upscale);

        this.currentCanvasWidth = global.gameWidth * this.windowedScale;
        this.currentCanvasHeight = global.gameHeight * this.windowedScale;
    }

    private static resize(upscale: number) {
        let ratio = this.getTargetWidth() / this.getTargetHeight();

        let width: number, height: number;
        if (this.expandDirection === 'horizontal') {
            height = OrFactory.resolve(Main.config.gameHeight);
            width = Math.ceil(height * ratio);
        } else if (this.expandDirection === 'vertical') {
            width = OrFactory.resolve(Main.config.gameWidth);
            height = Math.ceil(width / ratio);
        } else {
            width = OrFactory.resolve(Main.config.gameWidth);
            height = OrFactory.resolve(Main.config.gameHeight);
        }

        Main.forceResize(width, height, upscale);
    }

    private static getScale() {
        let canvasScale = this.getWindowedCanvasScaleFor({
            scaleMode: this.scaleMode,
            expandDirection: this.expandDirection,
            windowedScale: this.windowedScale,
        });
        let scaledGameWidth = global.gameWidth * canvasScale;
        let scaledGameHeight = global.gameHeight * canvasScale;
        let hscale = window.innerWidth / scaledGameWidth;
        let vscale = window.innerHeight / scaledGameHeight;

        if (this.expandDirection === 'horizontal') {
            return vscale;
        }

        if (this.expandDirection === 'vertical') {
            return hscale;
        }

        return Math.min(hscale, vscale);
    }

    private static isFullscreen() {
        return Fullscreen.enabled || MobileUtils.isMobileBrowser();
    }

    private static getTargetWidth() {
        return this.isFullscreen() ? window.innerWidth : OrFactory.resolve(Main.config.gameWidth) * this.windowedScale;
    }

    private static getTargetHeight() {
        return this.isFullscreen() ? window.innerHeight : OrFactory.resolve(Main.config.gameHeight) * this.windowedScale;
    }

    static getWindowedCanvasScaleFor(scaling: Main.Config['scaling']) {
        if (scaling.scaleMode === 'canvas') {
            return scaling.windowedScale;
        }

        if (scaling.scaleMode === 'upscale') {
            return 1;
        }

        if (scaling.scaleMode === 'mobilesmallscreen') {
            return 1;
        }

        assertUnreachable(scaling.scaleMode);
        return 1;
    }

    static getWindowedUpscaleFor(scaling: Main.Config['scaling']) {
        if (scaling.scaleMode === 'canvas') {
            return 1;
        }

        if (scaling.scaleMode === 'upscale') {
            return scaling.windowedScale;
        }

        if (scaling.scaleMode === 'mobilesmallscreen') {
            return 5;
        }

        assertUnreachable(scaling.scaleMode);
        return 1;
    }
}