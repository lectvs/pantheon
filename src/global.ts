class global {
    static clearStacks() {
        this.worldStack = [];
        this.deltaStack = [];
        this.screenStack = [];
        this.scriptStack = [];
    }

    static getSprite<T extends Sprite>(name: string): T {
        let obj = this.world.getWorldObjectByName(name);
        if (!(obj instanceof Sprite)) {
            debug(`Getting sprite '${name}' from world which is not a sprite!`, this.world);
            return undefined;
        }
        return <T>obj;
    }

    static getWorldObject<T extends WorldObject>(name: string): T {
        return <T>this.world.getWorldObjectByName(name);
    }

    static worldObjectExists(name: string) {
        return !!this.world.worldObjectsByName[name];
    }

    // Update options
    static get world() { return this.worldStack[this.worldStack.length-1]; };
    private static worldStack: World[] = [];
    static pushWorld(world: World) { this.worldStack.push(world); }
    static popWorld() { return this.worldStack.pop(); }
    
    static get delta() { return this.deltaStack[this.deltaStack.length-1]; };
    private static deltaStack: number[] = [];
    static pushDelta(delta: number) { this.deltaStack.push(delta); }
    static popDelta() { return this.deltaStack.pop(); }

    // Render options
    static get screen() { return this.screenStack[this.screenStack.length-1]; };
    private static screenStack: Texture[] = [];
    static pushScreen(screen: Texture) { this.screenStack.push(screen); }
    static popScreen() { return this.screenStack.pop(); }

    static get script() { return this.scriptStack[this.scriptStack.length-1]; };
    private static scriptStack: Script[] = [];
    static pushScript(script: Script) { this.scriptStack.push(script); }
    static popScript() { return this.scriptStack.pop(); }

    static theater: Theater;
}