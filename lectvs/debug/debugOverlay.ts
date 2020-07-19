/// <reference path="../world/world.ts" />

class DebugOverlay extends World {
    private currentWorldToDebug: World;

    constructor() {
        super({
            backgroundAlpha: 0,
        });

        this.addWorldObject<SpriteText>(<SpriteText.Config>{
            name: 'debuginfo',
            constructor: SpriteText,
            x: 0, y: 0,
            font: Debug.FONT,
            style: Debug.FONT_STYLE,
            updateCallback: (obj: SpriteText, delta) => {
                obj.setText(this.getDebugInfo());
            }
        });
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
        return `${mousePositionText}\n${fpsText}\n${recordingText}`;
    }
}