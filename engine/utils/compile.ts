type CompileResult = PIXI.DisplayObject | undefined;

function diffCompile(stage: PIXI.Container, match: CompileResult[]) {
    for (let i = stage.children.length-1; i >= 0; i--) {
        if (!match.includes(stage.getChildAt(i))) {
            stage.removeChildAt(i);
        }
    }

    for (let obj of match) {
        if (obj && !stage.children.includes(obj)) {
            stage.addChild(obj);
        }
    }
}