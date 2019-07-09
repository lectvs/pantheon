type Cutscene = {
    script : () => IterableIterator<Script.Function>;
    condition?: () => boolean;
    afterwardsGiveControlTo?: string[];
}

namespace Cutscene {
    export function toScript(generator: () => IterableIterator<Script.Function>, skipCutsceneScriptKey: string): Script.Function {
        return {
            generator: function*() {
                let iterator = generator();

                while (true) {
                    let result = iterator.next();
                    if (result.value) {
                        let script = S.global.world.runScript(result.value);
                        if (DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS) {
                            script.finishImmediately();
                        }
                        while (!script.done) {
                            if (DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS || Input.justDown(skipCutsceneScriptKey)) {
                                script.finishImmediately();
                            }
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