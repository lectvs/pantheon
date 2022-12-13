class ScriptManager {
    activeScripts: Script[];

    constructor() {
        this.activeScripts = [];
    }

    update(delta: number) {
        for (let i = this.activeScripts.length-1; i >= 0; i--) {
            this.activeScripts[i].update(delta);
            if (this.activeScripts[i].done) {
                this.activeScripts.splice(i, 1);
            }
        }
    }
    
    reset() {
        this.activeScripts = [];
    }

    runScript(script: Script | Script.Function, name?: string) {
        if (script instanceof Script) {
            if (script.done) return undefined;
        } else {
            script = new Script(script, name);
        }
        this.activeScripts.push(script);
        return script;
    }

    stopScriptByName(name: string) {
        for (let script of this.activeScripts) {
            if (script.name === name) script.stop();
        }
    }
}