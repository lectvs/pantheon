type Cutscene = {
    script: Script.Function;
    unskippable?: boolean;
    seenKey?: string;
}

class CutsceneManager {
    theater: Theater;
    current: { node: Cutscene, script: Script } | undefined;

    private seenCutsceneKeys: Set<string>;

    constructor(theater: Theater) {
        this.theater = theater;
        this.current = undefined;
        this.seenCutsceneKeys = new Set();
    }

    update() {
        this.updateCurrentCutscene();
    }

    private updateCurrentCutscene() {
        if (this.current) {
            this.current.script.update(this.theater.delta);
            // Cutscene could be cancelled during the update
            if (this.current?.script.isDone) {
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

    isCutscenePlaying() {
        return !!this.current;
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
            this.current.script.isDone = true;
        }
        this.current = undefined;
    }

    private finishCurrentCutscene() {
        if (!this.isCutscenePlaying()) return;
        
        this.markCutsceneAsSeen(this.current!.node);
        this.current = undefined;

        this.theater.dialogBox?.complete();
    }
}