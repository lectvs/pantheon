/// <reference path="../metrics/fps.ts"/>

class global {
    static clearStacks() {
        this.scriptStack.clear();
    }

    // Update options

    static get script() { return this.scriptStack[this.scriptStack.length-1]; };
    private static scriptStack: Script[] = [];
    static pushScript(script: Script) { this.scriptStack.push(script); }
    static popScript() { return this.scriptStack.pop(); }

    static get game() { return Main.game; }
    static get stageManager() { return this.game.stageManager; }
    static get currentTheater() { return this.game.getCurrentTheater(); }
    static get theater() { return this.game.gameTheater; }
    static get world() { return this.stageManager.getCurrentWorld(); }
    static get gameWorld() { return this.stageManager.getCurrentGameWorld(); }
    static get menuWorld() { return this.stageManager.getCurrentMenuWorld(); }

    static get soundManager() { return Main.soundManager; }
    static fpsCalculator: FPSCalculator = new FPSCalculator(1);

    static gameWidth: number;
    static gameHeight: number;
    static backgroundColor: number;
    static upscale: number;
}

Object.defineProperty(window, 'W', {
    get: () => global.gameWidth,
});

Object.defineProperty(window, 'H', {
    get: () => global.gameHeight,
});

Object.defineProperty(window, 'GAME', {
    get: () => global.game,
});

Object.defineProperty(window, 'WORLD', {
    get: () => {
        let world = global.world;
        if (!world) {
            console.error('Attempted to access WORLD while undefined. Returning dummy world');
            return new World();
        }
        return world;
    },
});

Object.defineProperty(window, 'MUSIC', {
    get: () => global.game.musicManager,
});

Object.defineProperty(window, 'STAGE', {
    get: () => global.game.stageManager,
});