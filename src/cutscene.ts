type Cutscene = {
    script?: () => IterableIterator<Script.Function>;
    condition?: () => boolean;
    afterwardsGiveControlTo?: string[];
}

namespace Cutscene {
    export function runScriptGenerator(generator: () => IterableIterator<Script.Function>): Script.Function {
        return {
            generator: function*() {
                let iterator = generator();

                while (true) {
                    let result = iterator.next();
                    if (result.value) {
                        yield* S.runScript(result.value);
                    } else if (!result.done) {  // Normal yield statement.
                        yield;
                    }
                    if (result.done) break;
                }
            }
        }
    }

    export function toScript(scriptText: string): Script.Function {
        let env = {};
        let generator = function*() {
            // Split on newline and semicolon
            let lines = scriptText.split(/[\n;]+/);

            for (let line of lines) {
                try {
                    line = line.trim();
                    line = resolveThis(line).trim();
                    line = resolveRunScript(line).trim();
                    line = resolveActorDefinition(line).trim();

                    if (S.splitOnWhitespace(line)[0] === YIELD_KEYWORD) {
                        yield;
                        continue;
                    }

                    // If it's a script function, run the script.
                    if (line.indexOf('(') >= 0) {
                        let firstPart = line.split('(')[0].trim();
                        if (S[firstPart]) {
                            let scriptFunction = eval(`S.${line}`);
                            if (scriptFunction) {
                                let script = S.global.world.runScript(scriptFunction);
                                while (!script.done) {
                                    yield;
                                }
                                continue;
                            }
                        }
                    }

                    // Else, evaluate it as Javascript.
                    eval(line);

                } catch (error) {
                    debug(`Cannot parse script line '${line}':`, error);
                    return;
                }
            }
        };

        return {
            generator: generator.bind(env)
        };
    }

    function resolveActorDefinition(line: string) {
        if (!line.startsWith(ACTOR_INDICATOR)) {
            return line;
        }
        let name = line.substr(1).trim();
        return `this.${name} = S.global.world.getWorldObjectByName("${name}")`;
    }

    function resolveRunScript(line: string) {
        let parts = line.split(RUN_SCRIPT_INDICATOR);
        if (parts.length < 2) {
            return line;
        }

        let [actor, ...rest] = parts;
        let script = rest.join(RUN_SCRIPT_INDICATOR);
        let scriptParts = script.split('(');
        scriptParts[1] = `${actor.trim()},` + scriptParts[1];
        return scriptParts.join('(');
    }

    function resolveThis(line: string) {
        return S.replaceAll(line, THIS_INDICATOR, 'this.');
    }

    const THIS_INDICATOR = '$';
    const RUN_SCRIPT_INDICATOR = '->';
    const ACTOR_INDICATOR = '@';
    const YIELD_KEYWORD = 'yield';
}