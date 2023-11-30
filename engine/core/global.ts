/// <reference path="../metrics/fps.ts"/>

class global {
    static clearStacks() {
        this.scriptStack = [];
    }

    // Update options

    static get script() { return this.scriptStack[this.scriptStack.length-1]; };
    private static scriptStack: Script[] = [];
    static pushScript(script: Script) { this.scriptStack.push(script); }
    static popScript() { return this.scriptStack.pop(); }

    static get game() { return Main.game; }
    static get theater() { return this.game.theater; }
    static get world() { return this.theater?.currentWorld; }

    static get skippingCutscene() { return this.theater?.isSkippingCutscene; }

    static get soundManager() { return Main.soundManager; }
    static fpsCalculator: FPSCalculator = new FPSCalculator(1);

    static gameWidth: number;
    static gameHeight: number;
    static backgroundColor: number;
}

Object.defineProperty(window, 'W', {
    get: () => global.gameWidth,
});

Object.defineProperty(window, 'H', {
    get: () => global.gameHeight,
});

Object.defineProperty(window, 'HW', {
    get: () => global.gameWidth/2,
});

Object.defineProperty(window, 'HH', {
    get: () => global.gameHeight/2,
});