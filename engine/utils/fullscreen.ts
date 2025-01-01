class Fullscreen {
    static get supported() { return document.fullscreenEnabled; }
    static get enabled() { return !!document.fullscreenElement; }

    static toggleFullscreen() {
        if (!this.supported) return;

        if (this.enabled) {
            this.stopFullscreen();
        } else {
            this.startFullscreen();
        }
    }

    private static startFullscreen() {
        if (!this.supported || this.enabled) return;
        Main.rendererView.requestFullscreen();
        if (Main.config.fullscreenPageBackgroundColor !== undefined) {
            document.body.style.backgroundColor = Main.config.fullscreenPageBackgroundColor;
        }
    }

    private static stopFullscreen() {
        if (!this.supported || !this.enabled) return;
        document.exitFullscreen();
        document.body.style.backgroundColor = Main.nonFullscreenPageBackgroundColor;
    }
}