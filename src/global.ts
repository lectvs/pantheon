class global {
    static clearStacks() {
        this.worldStack = [];
        this.deltaStack = [];
        this.rendererStack = [];
        this.renderTextureStack = [];
        this.matrixStack = [];
        this.scriptStack = [];
    }

    static getSprite(name: string) {
        let obj = this.world.getWorldObjectByName(name);
        if (!(obj instanceof Sprite)) {
            debug(`Getting sprite '${name}' from world which is not a sprite!`, this.world);
            return undefined;
        }
        return obj;
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
    static get renderer() { return this.rendererStack[this.rendererStack.length-1]; };
    private static rendererStack: PIXI.Renderer[] = [];
    static pushRenderer(renderer: PIXI.Renderer) { this.rendererStack.push(renderer); }
    static popRenderer() { return this.rendererStack.pop(); }

    static get renderTexture() { return this.renderTextureStack[this.renderTextureStack.length-1]; };
    private static renderTextureStack: PIXI.RenderTexture[] = [];
    static pushRenderTexture(renderTexture: PIXI.RenderTexture) { this.renderTextureStack.push(renderTexture); }
    static popRenderTexture() { return this.renderTextureStack.pop(); }

    static get matrix() { return this.matrixStack[this.matrixStack.length-1]; };
    private static matrixStack: PIXI.Matrix[] = [];
    static pushMatrix(matrix: PIXI.Matrix) { this.matrixStack.push(matrix); }
    static popMatrix() { return this.matrixStack.pop(); }

    static get script() { return this.scriptStack[this.scriptStack.length-1]; };
    private static scriptStack: Script[] = [];
    static pushScript(script: Script) { this.scriptStack.push(script); }
    static popScript() { return this.scriptStack.pop(); }

    static theater: Theater;
}