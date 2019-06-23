class CutsceneManager {
    current: { cutscene: Cutscene, script: Script };

    constructor() {
        this.current = null;
    }

    update(delta: number, world?: World) {
        if (this.current) {
            this.current.script.update(delta, world);
            if (this.current.script.done) {
                this.current = null;
            }
        }
    }

    playCutscene(cutscene: Cutscene) {
        if (this.current) {
            debug("Cannot play cutscene:", cutscene, "because a cutscene is already playing:", this.current.cutscene);
            return;
        }

        let script = new Script(Cutscene.toScript(cutscene.script));

        this.current = { cutscene, script };
    }
}