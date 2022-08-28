type Cutscene = {
    script: Script.Function;
    unskippable?: boolean;
    seenKey?: string;
}

class CutsceneManager {
    theater: Theater;
    current: { node: Cutscene, script: Script };

    get isCutscenePlaying() { return !!this.current; }

    private seenCutsceneKeys: Set<string>;

    constructor(theater: Theater) {
        this.theater = theater;
        this.current = null;
        this.seenCutsceneKeys = new Set();
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
        return this.current && !this.current.node.unskippable;
    }

    fastForwardCutscene(cutscene: Cutscene) {
        this.playCutscene(cutscene);
        this.finishCurrentCutscene();
    }

    hasSeenCutscene(cutscene: Cutscene) {
        if (!cutscene.seenKey) return false;
        return this.seenCutsceneKeys.has(cutscene.seenKey);
    }

    markCutsceneAsSeen(cutscene: Cutscene) {
        if (!cutscene.seenKey) return;
        this.seenCutsceneKeys.add(cutscene.seenKey);
    }

    playCutscene(cutscene: Cutscene) {
        if (this.current) {
            console.error('Cannot play cutscene:', cutscene, 'because a cutscene is already playing:', this.current);
            return;
        }

        this.current = {
            node: cutscene,
            script: new Script(cutscene.script),
        };

        this.updateCurrentCutscene();
    }

    playCutsceneIfNotSeen(cutscene: Cutscene) {
        if (this.hasSeenCutscene(cutscene)) return;
        this.playCutscene(cutscene);
    }

    reset() {
        if (this.current) {
            this.current.script.done = true;
        }
        this.current = null;
    }

    onStageLoad() {
        
    }

    private finishCurrentCutscene() {
        if (!this.isCutscenePlaying) return;
        
        this.markCutsceneAsSeen(this.current.node);
        this.current = null;

        this.theater.dialogBox.complete();
        this.theater.clearSlides();
    }
}