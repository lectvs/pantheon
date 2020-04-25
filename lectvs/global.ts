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
    static theater: Theater;
    static get world(): World { return this.theater ? this.theater.currentWorld : undefined; }

    static gameWidth: number;
    static gameHeight: number;
    static backgroundColor: number;
    static renderer: PIXI.Renderer;
}