class CutsceneManager {
    current: { name: string, cutscene: Cutscene, script: Script };
    playedCutscenes: Set<string>;

    get isCutscenePlaying() { return !!this.current; }

    constructor() {
        this.current = null;
        this.playedCutscenes = new Set<string>();
    }

    update() {
        if (this.current) {
            this.current.script.update();
            if (this.current.script.done) {
                let completedCutscene = this.current;
                this.current = null;

                this.playedCutscenes.add(completedCutscene.name);

                if (completedCutscene.cutscene.after) {
                    global.theater.startStoryboardComponentByName(completedCutscene.cutscene.after);
                }
            }
        }
    }

    canPlayCutscene(name: string) {
        let cutscene = global.theater.getStoryboardComponentByName(name);
        if (cutscene.type !== 'cutscene') {
            return false;
        }
        if (cutscene.playOnlyOnce && this.playedCutscenes.has(name)) {
            return false;
        }
        return true;
    }

    onStageLoad() {

    }

    playCutscene(name: string, cutscene: Cutscene, skipCutsceneScriptKey: string) {
        if (this.current) {
            debug("Cannot play cutscene:", cutscene, "because a cutscene is already playing:", this.current.cutscene);
            return;
        }

        let script = new Script(Cutscene.toScript(cutscene.script, skipCutsceneScriptKey));
        this.current = { name, cutscene, script };
    }

    reset() {
        if (this.current) {
            this.current.script.done = true;
        }
        this.current = null;
    }
}