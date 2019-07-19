class CutsceneManager {
    current: { cutscene: Cutscene, script: Script };

    get isCutscenePlaying() { return !!this.current; }

    constructor() {
        this.current = null;
    }

    update() {
        if (this.current) {
            if (this.current.script.done) {
                let completedCutscene = this.current.cutscene;
                this.current = null;

                if (completedCutscene.after) {
                    global.theater.startStoryboardComponentByName(completedCutscene.after);
                }
            }
        }
    }

    playCutscene(cutscene: Cutscene, world: World, skipCutsceneScriptKey: string) {
        if (this.current) {
            debug("Cannot play cutscene:", cutscene, "because a cutscene is already playing:", this.current.cutscene);
            return;
        }

        let script = world.runScript(Cutscene.toScript(cutscene.script, skipCutsceneScriptKey));
        this.current = { cutscene, script };
    }

    reset() {
        if (this.current) {
            this.current.script.done = true;
        }
        this.current = null;
    }
}