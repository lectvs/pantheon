class global {
    static clearStacks() {
        this.deltaStack = [];
        this.scriptStack = [];
    }

    static getWorldObject<T extends WorldObject>(name: string): T {
        return <T>global.theater.currentWorld.getWorldObjectByName(name);
    }

    // Update options
    
    static get delta() { return this.deltaStack[this.deltaStack.length-1]; };
    private static deltaStack: number[] = [];
    static pushDelta(delta: number) { this.deltaStack.push(delta); }
    static popDelta() { return this.deltaStack.pop(); }

    static get script() { return this.scriptStack[this.scriptStack.length-1]; };
    private static scriptStack: Script[] = [];
    static pushScript(script: Script) { this.scriptStack.push(script); }
    static popScript() { return this.scriptStack.pop(); }

    static theater: Theater;
}