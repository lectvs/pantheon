class ScriptManager {
    activeScripts: Script[];

    constructor() {
        this.activeScripts = [];
    }

    update(world: World, worldObject: WorldObject, delta: number) {
        for (let i = this.activeScripts.length-1; i >= 0; i--) {
            this.activeScripts[i].update(world, worldObject, delta);
            if (this.activeScripts[i].done) {
                this.activeScripts.splice(i, 1);
            }
        }
    }
    
    reset() {
        this.activeScripts = [];
    }

    runScript(script: Script | Script.Function) {
        if (script instanceof Script) {
            if (script.done) return;
        } else {
            script = new Script(script);
        }
        this.activeScripts.push(script);
        return script;
    }

}