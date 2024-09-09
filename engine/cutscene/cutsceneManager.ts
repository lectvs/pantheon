type Cutscene = {
    script: Script.Function;
    unskippable?: boolean;
    seenKey?: string;
}

namespace CutsceneManager {
    export type Config = {
        getSeenCutscenes?: () => string[];
        onSeenCutscene?: (seenKey: string) => void;
    }

    export type PlayOptions = {
        playIfSeen?: boolean;
        queueIfCutscenePlaying?: boolean;
        immediatelyFinish?: boolean;
    }
}

class CutsceneManager {
    theater: Theater;
    current: { node: Cutscene, script: Script } | undefined;

    private queue: { node: Cutscene, options: CutsceneManager.PlayOptions }[];

    private seenCutsceneKeys: Set<string>;
    private onSeenCutscene: (seenKey: string) => void;

    constructor(theater: Theater, config: CutsceneManager.Config) {
        this.theater = theater;
        this.current = undefined;
        this.queue = [];
        this.seenCutsceneKeys = new Set(config.getSeenCutscenes ? config.getSeenCutscenes() : []);
        this.onSeenCutscene = config.onSeenCutscene ?? Utils.NOOP;
    }

    update() {
        this.updateCurrentCutscene();

        if (!this.current && this.queue.length > 0) {
            let next = this.queue.shift()!;
            this.playCutscene(next.node, next.options);
        }
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

    finishCurrentCutscene() {
        if (!this.isCutscenePlaying()) return;
        
        this.markCutsceneAsSeen(this.current!.node);
        this.current = undefined;

        this.theater.dialogBox?.complete();
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
        this.onSeenCutscene(cutscene.seenKey);
    }

    playCutscene(cutscene: Cutscene, optionsParams: CutsceneManager.PlayOptions = {}) {
        let options = O.defaults(optionsParams, {
            playIfSeen: true,
            queueIfCutscenePlaying: false,
            immediatelyFinish: false,
        });

        if (!options.playIfSeen && this.hasSeenCutscene(cutscene)) return;

        if (this.current) {
            if (options.queueIfCutscenePlaying) {
                let queuedOptions = O.deepClone(options);
                queuedOptions.queueIfCutscenePlaying = false;
                this.queue.push({ node: cutscene, options: queuedOptions });
            } else {
                console.error('Cannot play cutscene:', cutscene, 'because a cutscene is already playing:', this.current);
            }
            return;
        }

        this.current = {
            node: cutscene,
            script: new Script(cutscene.script),
        };

        this.updateCurrentCutscene();

        if (options.immediatelyFinish) {
            this.finishCurrentCutscene();
        }
    }

    reset() {
        if (this.current) {
            this.current.script.isDone = true;
        }
        this.current = undefined;
    }
}