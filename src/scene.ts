type Scene = {
    stage: Stage;
    schema: Schema;
    cutscenes: Dict<Cutscene>;
    entry?: string;
    defaultControl: string[];
}


let script = function *() {
    let doStuff = 4;
    yield;

    yield* S.runScript(S.dialog("Hi!"));

    yield S.dialog("Hi!");
}