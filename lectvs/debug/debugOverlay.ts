/// <reference path="../world/world.ts" />

class DebugOverlay extends World {
    private currentWorldToDebug: World;

    constructor() {
        super();

        this.backgroundAlpha = 0;

        let debugInfo = this.addWorldObject(new SpriteText(Debug.FONT), {
            name: 'debuginfo',
        });
        debugInfo.x = 0;
        debugInfo.y = 0;
        debugInfo.effects.addOutline.color = 0x000000;
        debugInfo.setStyle(Debug.FONT_STYLE);
        debugInfo.updateCallback = obj => {
            obj.setText(this.getDebugInfo());
        };
    }

    setCurrentWorldToDebug(world: World) {
        this.currentWorldToDebug = world;
    }

    private getDebugInfo() {
        if (!this.currentWorldToDebug) return "";
        let mousePositionText = "mpos: "
            + St.padLeft(this.currentWorldToDebug.getWorldMouseX().toString(), 3) + " "
            + St.padLeft(this.currentWorldToDebug.getWorldMouseY().toString(), 3);
        let fpsText = "fps: "
            + global.fpsCalculator.fpsAvg.toFixed(0) + " "
            + "(-" + (global.fpsCalculator.fpsAvg - global.fpsCalculator.fpsP).toFixed(0) + ")";
        let recordingText = global.metrics.isRecording ? "\nrecording" : "";
        let feedText = "";
        for (let feed of Debug.OVERLAY_FEEDS) {
            feedText += feed(this.currentWorldToDebug) + "\n";
        }
        return `${mousePositionText}\n${fpsText}\n${recordingText}\n${feedText}`;
    }
}