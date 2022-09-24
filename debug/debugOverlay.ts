/// <reference path="../world/world.ts" />

class DebugOverlay extends World {
    private currentWorldToDebug: World;

    constructor() {
        super();

        this.backgroundAlpha = 0;

        let debugOverlay = this;

        this.addWorldObject(new SpriteText({
            name: 'debuginfo',
            x: 0, y: 0,
            font: Debug.FONT,
            style: Debug.FONT_STYLE,
            effects: { outline: { color: 0x000000 } },
            update: function() {
                this.setText(debugOverlay.getDebugInfo());
            }
        }));
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
        let feedText = "";
        for (let feed of Debug.OVERLAY_FEEDS) {
            feedText += feed(this.currentWorldToDebug) + "\n";
        }
        return `${mousePositionText}\n${fpsText}\n${feedText}`;
    }
}