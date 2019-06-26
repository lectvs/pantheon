class CutsceneManager {
    current: { cutscene: Cutscene, script: Script };

    get isCutscenePlaying() { return !!this.current; }

    constructor() {
        this.current = null;
    }

    update(options: UpdateOptions) {
        if (this.current) {
            if (this.current.script.done) {
                this.giveControl();
                this.current = null;
            }
        }
    }

    giveControl() {
        if (this.current.cutscene.afterwardsGiveControlTo) {
            Main.theater.inControl = this.current.cutscene.afterwardsGiveControlTo;
        }
    }

    playCutscene(cutscene: Cutscene, world: World) {
        if (this.current) {
            debug("Cannot play cutscene:", cutscene, "because a cutscene is already playing:", this.current.cutscene);
            return;
        }

        let script = world.runScript(Cutscene.runScriptGenerator(cutscene.script));
        this.current = { cutscene, script };
    }

    reset() {
        if (this.current) {
            this.current.script.done = true;
        }
        this.current = null;
    }
}