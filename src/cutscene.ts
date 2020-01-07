type Cutscene = Storyboard.Component.Cutscene;

namespace Cutscene {
    export type Generator = () => IterableIterator<Script.Function | (() => IterableIterator<Script.Function>)[]>;
    export function toScript(generator: Generator, skipCutsceneScriptKey: string): Script.Function {
        return {
            generator: function*() {
                let iterator = generator();

                while (true) {
                    let result = iterator.next();
                    if (result.value) {
                        if (_.isArray(result.value)) {
                            result.value = S.simul(...result.value.map(scr => Cutscene.toScript(scr, skipCutsceneScriptKey)));
                        }
                        let script = new Script(result.value);
                        if (DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS) {
                            global.pushWorld(global.theater.currentWorld);
                            script.finishImmediately();
                            global.popWorld();
                        }
                        while (!script.done) {
                            global.pushWorld(global.theater.currentWorld);
                            if (DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS || Input.justDown(skipCutsceneScriptKey)) {
                                script.finishImmediately();
                            } else {
                                script.update();
                            }
                            global.popWorld();
                            yield;
                        }
                    } else if (!result.done) {  // Normal yield statement.
                        yield;
                    }
                    if (result.done) break;
                }
            }
        }
    }
}