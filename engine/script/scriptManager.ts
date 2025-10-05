namespace ScriptManager {
    export type SpecialMode = 'stopPrevious' | 'dontRunTwice';
}

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
        if (this.activeScripts[i].isDone) {
            this.activeScripts.splice(i, 1);
        }
    }

    getScriptByName(name: string) {
        return this.activeScripts.find(script => script.name === name);
    }

    hasScriptRunning(name: string) {
        return this.activeScripts.some(script => script.name === name && !script.isDone);
    }
    
    reset() {
        this.activeScripts = [];
    }

    runScript(functionLike: Script.FunctionLike, name?: string, specialMode?: ScriptManager.SpecialMode) {
        let script = new Script(functionLike, name);

        if (specialMode === 'stopPrevious' && name) {
            this.stopScriptByName(name);
        }

        if (specialMode === 'dontRunTwice' && name && this.hasScriptRunning(name)) {
            return script;
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