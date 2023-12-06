namespace Render {
    export type Result = PIXI.DisplayObject[];

    export function diff(container: PIXI.Container, match: Render.Result) {
        for (let i = container.children.length-1; i >= 0; i--) {
            if (!match.includes(container.getChildAt(i))) {
                container.removeChildAt(i);
            }
        }
    
        let sortNeeded = false;
        for (let i = 0; i < match.length; i++) {
            let obj = match[i];
            if (!container.children.includes(obj)) {
                container.addChild(obj);
            }
            match[i].zIndex = i;
            if (container.children[i] !== match[i]) {
                sortNeeded = true;
            }
        }
    
        if (sortNeeded) {
            container.sortChildren();
        }
    }

    export function shift(result: Render.Result, dx: number, dy: number) {
        for (let r of result) {
            r.x += dx;
            r.y += dy;

            if (r instanceof PIXI.Sprite && r.filterArea) {
                r.filterArea.x += dx;
                r.filterArea.y += dy;
            }
        }
        return result;
    }
}