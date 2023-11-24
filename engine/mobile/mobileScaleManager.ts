namespace MobileScaleManager {
    export type PrimaryDirection = 'horizontal' | 'vertical' | 'none';
}

class MobileScaleManager {
    private static primaryDirection: MobileScaleManager.PrimaryDirection;
    private static currentWindowInnerWidth: number;
    private static currentWindowInnerHeight: number;

    static init(primaryDirection: MobileScaleManager.PrimaryDirection) {
        this.primaryDirection = primaryDirection;
        this.scale();
    }

    static update() {
        if (window.innerWidth !== this.currentWindowInnerWidth || window.innerHeight !== this.currentWindowInnerHeight) {
            this.scale();
        }
    }

    private static scale() {
        let newScale = this.getScale();
        Main.renderer.view.style.transform = `scale(${newScale})`;

        if (this.primaryDirection !== 'none') {
            this.resize();
        }
    }

    private static resize() {
        let ratio = window.innerWidth / window.innerHeight;

        let width: number, height: number;
        if (this.primaryDirection === 'horizontal') {
            height = Main.config.gameHeight;
            width = Math.ceil(height * ratio);
        } else {
            width = Main.config.gameWidth;
            height = Math.ceil(width / ratio);
        }

        Main.forceResize(width, height);
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