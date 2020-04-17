class global {
    static clearStacks() {
        this.scriptStack = [];
    }

    static getWorldObject<T extends WorldObject>(name: string): T {
        return <T>global.theater.currentWorld.getWorldObjectByName(name);
    }

    // Update options

    static get script() { return this.scriptStack[this.scriptStack.length-1]; };
    private static scriptStack: Script[] = [];
    static pushScript(script: Script) { this.scriptStack.push(script); }
    static popScript() { return this.scriptStack.pop(); }

    static game: Game;
    static theater: Theater;

    static gameWidth: number;
    static gameHeight: number;
    static backgroundColor: number;
    static renderer: PIXI.Renderer;
}