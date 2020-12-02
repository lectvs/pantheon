namespace Cutscene {
    export type Generator = () => IterableIterator<Script.Function | (() => IterableIterator<Script.Function>)[]>;
}

class CutsceneManager {
    theater: Theater;
    storyboard: Storyboard;

    current: { name: string, node: Storyboard.Nodes.Cutscene, script: Script };
    playedCutscenes: Set<string>;

    get isCutscenePlaying() { return !!this.current; }

    constructor(theater: Theater, storyboard: Storyboard) {
        this.theater = theater;
        this.storyboard = storyboard;
        this.current = null;
        this.playedCutscenes = new Set<string>();
    }

    toScript(generator: Cutscene.Generator): Script.Function {
        let cm = this;
        return function*() {
            let iterator = generator();

            while (true) {
                let result = iterator.next();
                if (result.value) {
                    if (_.isArray(result.value)) {
                        result.value = S.simul(...result.value.map(scr => cm.toScript(scr)));
                    }
                    let script = new Script(result.value);
                    while (!script.done) {
                        script.update(global.script.delta);
                        if (script.done) break;
                        yield;
                    }
                } else if (!result.done) {  // Normal yield statement.
                    yield;
                }
                if (result.done) break;
            }
        }
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

    canPlayCutscene(name: string) {
        let cutscene = this.getCutsceneByName(name);
        if (!cutscene) return false;
        if (cutscene.type !== 'cutscene') return false;
        if (cutscene.playOnlyOnce && this.playedCutscenes.has(name)) return false;
        return true;
    }

    canSkipCurrentCutscene() {
        return this.current && this.current.node.skippable;
    }

    fastForwardCutscene(name: string) {
        this.playCutscene(name);
        this.finishCurrentCutscene();
    }

    playCutscene(name: string) {
        let cutscene = this.getCutsceneByName(name);
        if (!cutscene) return;

        if (this.current) {
            error(`Cannot play cutscene ${name} because a cutscene is already playing:`, this.current);
            return;
        }

        this.current = {
            name: name,
            node: cutscene,
            script: new Script(this.toScript(cutscene.script))
        };

        this.updateCurrentCutscene();
    }

    reset() {
        if (this.current) {
            this.current.script.done = true;
        }
        this.current = null;
    }

    skipCurrentCutscene() {
        if (!this.canSkipCurrentCutscene()) {
            error(`Attempted to skip unskippable cutscene`, this.current);
            return;
        }
        this.finishCurrentCutscene();
    }

    onStageLoad() {
        this.finishCurrentCutscene();
    }

    private finishCurrentCutscene() {
        if (!this.isCutscenePlaying) return;
        
        let completed = this.current;
        this.current = null;

        this.playedCutscenes.add(completed.name);
        if (completed.node.onFinish) completed.node.onFinish();

        this.theater.dialogBox.complete();
        this.theater.clearSlides();
    }

    private getCutsceneByName(name: string) {
        let node = this.storyboard[name];
        if (!node) {
            error(`Cannot get cutscene ${name} because it does not exist on storyboard:`, this.storyboard);
            return undefined;
        }
        if (node.type !== 'cutscene') {
            error(`Tried to play node ${name} as a cutscene when it is not one`, node);
            return undefined;
        }
        return node;
    }
}