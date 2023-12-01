type RenderResult = PIXI.DisplayObject | undefined;

function diffRender(stage: PIXI.Container, match: RenderResult[]) {
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

    // Ensure order of passed DisplayObjects.
    for (let i = 0; i < match.length; i++) {
        let m = match[i];
        if (!m) continue;
        m.zIndex = i;
    }

    stage.sortChildren();
}