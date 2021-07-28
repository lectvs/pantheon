type Cutscene = {
    script: Script.Function;
    skippable?: boolean;
}

class CutsceneManager {
    theater: Theater;

    current: { node: Cutscene, script: Script };

    get isCutscenePlaying() { return !!this.current; }

    constructor(theater: Theater) {
        this.theater = theater;
        this.current = null;
    }

    update() {
        this.updateCurrentCutscene();
    }

    private updateCurrentCutscene() {
        if (this.current) {
            this.current.script.update(this.theater.delta);
            if (this.current.script.done) {
                this.finishCurrentCutscene();
            }
        }
    }

    canPlayCutscene(cutscene: Cutscene) {
        if (!cutscene) return false;
        return true;
    }

    canSkipCurrentCutscene() {
        return this.current && this.current.node.skippable;
    }

    fastForwardCutscene(cutscene: Cutscene) {
        this.playCutscene(cutscene);
        this.finishCurrentCutscene();
    }

    playCutscene(cutscene: Cutscene) {
        if (this.current) {
            error(`Cannot play cutscene ${name} because a cutscene is already playing:`, this.current);
            return;
        }

        this.current = {
            node: cutscene,
            script: new Script(cutscene.script),
        };

        this.updateCurrentCutscene();
    }

    reset() {
        if (this.current) {
            this.current.script.done = true;
        }
        this.current = null;
    }

    onStageLoad() {
        this.finishCurrentCutscene();
    }

    private finishCurrentCutscene() {
        if (!this.isCutscenePlaying) return;
        
        this.current = null;

        this.theater.dialogBox.complete();
        this.theater.clearSlides();
    }
}