/// <reference path="../world/world.ts" />

class DebugOverlay extends World {
    private currentWorldToDebug: World | undefined;

    debugInfo: SpriteText;

    constructor() {
        super();

        this.backgroundAlpha = 0;

        let debugOverlay = this;

        this.debugInfo = this.addWorldObject(new SpriteText({
            name: 'debuginfo',
            x: 0, y: 0,
            ignoreCamera: true,
            font: Debug.FONT,
            style: Debug.FONT_STYLE,
            anchor: Anchor.TOP_LEFT,
            justify: 'left',
            effects: { outline: { color: 0x000000 } },
            hooks: {
                onUpdate: function() {
                    this.setText(debugOverlay.getDebugInfo());
                },
            },
        }));
    }

    setCurrentWorldToDebug(world: World | undefined) {
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
        let objsText = "obj: " + this.currentWorldToDebug.worldObjects.length;
        let feedText = "";
        for (let feed of Debug.OVERLAY_FEEDS) {
            feedText += feed(this.currentWorldToDebug) + "\n";
        }
        return `${mousePositionText}\n${fpsText}\n${objsText}\n${feedText}`;
    }
}