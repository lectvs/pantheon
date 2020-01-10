type Cutscene = Storyboard.Component.Cutscene;

namespace Cutscene {
    export type Generator = () => IterableIterator<Script.Function | (() => IterableIterator<Script.Function>)[]>;
    export function toScript(generator: Generator): Script.Function {
        return function*() {
            let iterator = generator();

            while (true) {
                let result = iterator.next();
                if (result.value) {
                    if (_.isArray(result.value)) {
                        result.value = S.simul(...result.value.map(scr => Cutscene.toScript(scr)));
                    }
                    let script = new Script(result.value);
                    while (!script.done) {
                        global.pushWorld(global.theater.currentWorld);
                        script.update();
                        global.popWorld();
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
}