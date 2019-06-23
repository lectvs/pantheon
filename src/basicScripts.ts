namespace S {
    export function printNumber(upTo: number): Script.Function {
        return {
            generator: function*() {
                let i = 1;

                eval("x = 5;")
                debug(eval("x"));

                let t = new Timer(1, () => {
                    debug(i);
                    i++;
                }, true);

                while (i <= upTo) {
                    t.update(S.global.delta);
                    yield;
                }
            },
            endState: () => debug("Done!"),
        }
    }
}