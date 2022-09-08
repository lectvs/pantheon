class MobileScaleManager {
    private static currentScale: number;

    static init() {
        this.scale(this.getScale());
    }

    static update() {
        let newScale = this.getScale();
        if (newScale !== this.currentScale) {
            this.scale(newScale);
        }
    }

    private static scale(s: number) {
        Main.renderer.view.style.transform = `scale(${s})`;
        this.currentScale = s;
    }

    private static getScale() {
        return Math.min(
            window.innerWidth/Main.getScaledWidth(),
            window.innerHeight/Main.getScaledHeight());
    }
}