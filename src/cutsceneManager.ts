class CutsceneManager {
    theater: Theater;

    current: { name: string, cutscene: Cutscene, script: Script };
    playedCutscenes: Set<string>;
    skipCutsceneScriptKey: string;

    get isCutscenePlaying() { return !!this.current; }

    constructor(theater: Theater, skipCutsceneScriptKey: string) {
        this.theater = theater;
        this.current = null;
        this.playedCutscenes = new Set<string>();
        this.skipCutsceneScriptKey = skipCutsceneScriptKey;
    }

    update() {
        if (this.current) {
            this.current.script.update(this.theater);
            if (this.current.script.done) {
                this.finishCurrentCutscene();
            }
        }
    }

    canPlayCutscene(name: string) {
        let cutscene = this.theater.getStoryboardComponentByName(name);
        if (cutscene.type !== 'cutscene') {
            return false;
        }
        if (cutscene.playOnlyOnce && this.playedCutscenes.has(name)) {
            return false;
        }
        return true;
    }

    finishCurrentCutscene() {
        if (!this.current) return;
        let completedCutscene = this.current;
        this.current = null;

        this.playedCutscenes.add(completedCutscene.name);

        if (completedCutscene.cutscene.after) {
            this.theater.startStoryboardComponentByName(completedCutscene.cutscene.after);
        }
    }

    onStageLoad() {
        this.finishCurrentCutscene();
    }

    playCutscene(name: string, cutscene: Cutscene) {
        if (this.current) {
            debug("Cannot play cutscene:", cutscene, "because a cutscene is already playing:", this.current.cutscene);
            return;
        }

        let script = new Script(Cutscene.toScript(cutscene.script));
        this.current = { name, cutscene, script };
    }

    reset() {
        if (this.current) {
            this.current.script.done = true;
        }
        this.current = null;
    }
}