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
        Main.renderer.view.requestFullscreen();
    }

    private static stopFullscreen() {
        if (!this.supported || !this.enabled) return;
        document.exitFullscreen();
    }
}