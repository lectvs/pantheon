/// <reference path="../metrics/fps.ts"/>
/// <reference path="../metrics/metrics.ts"/>

class global {
    static clearStacks() {
        this.scriptStack = [];
    }

    // Update options

    static get script() { return this.scriptStack[this.scriptStack.length-1]; };
    private static scriptStack: Script[] = [];
    static pushScript(script: Script) { this.scriptStack.push(script); }
    static popScript() { return this.scriptStack.pop(); }

    static game: Game;
    static get theater(): Theater { return this.game.theater; }
    static get world(): World { return this.theater ? this.theater.currentWorld : undefined; }

    static metrics: Metrics = new Metrics();
    static fpsCalculator: FPSCalculator = new FPSCalculator(1);

    static gameWidth: number;
    static gameHeight: number;
    static backgroundColor: number;
    static renderer: PIXI.Renderer;
    static soundManager: GlobalSoundManager;
}