class ScriptManager {
    activeScripts: Script[];

    constructor() {
        this.activeScripts = [];
    }

    update(delta: number) {
        for (let i = this.activeScripts.length-1; i >= 0; i--) {
            this.updateScript(delta, i);
        }
    }

    private updateScript(delta: number, i: number) {
        this.activeScripts[i].update(delta);
        if (this.activeScripts[i].done) {
            this.activeScripts.splice(i, 1);
        }
    }

    hasScriptRunning(name: string) {
        return this.activeScripts.some(script => script.name === name);
    }
    
    reset() {
        this.activeScripts = [];
    }

    runScript(script: Script | Script.Function, name?: string, stopPrevious?: 'stopPrevious') {
        if (script instanceof Script) {
            if (script.done) return script;
        } else {
            script = new Script(script, name);
        }

        if (stopPrevious && name) {
            this.stopScriptByName(name);
        }

        this.activeScripts.push(script);
        this.updateScript(0, this.activeScripts.length-1);
        return script;
    }

    stopScriptByName(name: string) {
        for (let script of this.activeScripts) {
            if (script.name === name) script.stop();
        }
    }
}