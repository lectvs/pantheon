type Cutscene = {
    script?: string;
    condition?: () => boolean;
}

namespace Cutscene {
    export function toScript(script: string): Script.Function {
        let lines = script.split('\n');
        return {
            generator: function*() {
                for (let line of lines) {
                    eval(line);
                }
            }
        };
    }
}