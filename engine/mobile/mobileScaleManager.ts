namespace MobileScaleManager {
    export type PrimaryDirection = 'horizontal' | 'vertical' | 'none';
    export type ScaleMode = 'canvas' | 'upscale';
}

class MobileScaleManager {
    private static primaryDirection: MobileScaleManager.PrimaryDirection;
    private static scaleMode: MobileScaleManager.ScaleMode;

    private static currentWindowInnerWidth: number;
    private static currentWindowInnerHeight: number;

    static init(primaryDirection: MobileScaleManager.PrimaryDirection, scaleMode: MobileScaleManager.ScaleMode) {
        this.primaryDirection = primaryDirection;
        this.scaleMode = scaleMode;
        this.scale();
    }

    static update() {
        if (window.innerWidth !== this.currentWindowInnerWidth || window.innerHeight !== this.currentWindowInnerHeight) {
            this.scale();
        }
    }

    private static scale() {
        let newScale = this.getScale();
        let upscale: number;

        if (this.scaleMode === 'upscale') {
            Main.rendererView.style.transform = '';
            upscale = newScale;
        } else {
            Main.rendererView.style.transform = `scale(${newScale / Main.config.upscale})`;
            upscale = Main.config.upscale;
        }

        this.resize(upscale);

        this.currentWindowInnerWidth = window.innerWidth;
        this.currentWindowInnerHeight = window.innerHeight;
    }

    private static resize(upscale: number) {
        let ratio = window.innerWidth / window.innerHeight;

        let width: number, height: number;
        if (this.primaryDirection === 'horizontal') {
            height = Main.config.gameHeight;
            width = Math.ceil(height * ratio);
        } else if (this.primaryDirection === 'vertical') {
            width = Main.config.gameWidth;
            height = Math.ceil(width / ratio);
        } else {
            width = Main.config.gameWidth;
            height = Main.config.gameHeight;
        }

        Main.forceResize(width, height, upscale);
    }

    private static getScale() {
        let hscale = window.innerWidth/Main.getScaledWidth();
        let vscale = window.innerHeight/Main.getScaledHeight();

        if (this.primaryDirection === 'horizontal') {
            return vscale;
        }

        if (this.primaryDirection === 'vertical') {
            return hscale;
        }

        return Math.min(hscale, vscale);
    }
}