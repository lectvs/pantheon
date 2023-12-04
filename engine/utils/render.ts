type RenderResult = PIXI.DisplayObject[];

function diffRender(stage: PIXI.Container, match: RenderResult) {
    for (let i = stage.children.length-1; i >= 0; i--) {
        if (!match.includes(stage.getChildAt(i))) {
            stage.removeChildAt(i);
        }
    }

    let sortNeeded = false;
    for (let i = 0; i < match.length; i++) {
        let obj = match[i];
        if (!stage.children.includes(obj)) {
            stage.addChild(obj);
        }
        match[i].zIndex = i;
        if (stage.children[i] !== match[i]) {
            sortNeeded = true;
        }
    }

    if (sortNeeded) {
        stage.sortChildren();
    }
}