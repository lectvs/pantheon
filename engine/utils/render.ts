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

    export function roundToNearestUpscale(result: Render.Result) {
        for (let r of result) {
            let dx = M.roundToNearest(r.x, 1/global.upscale) - r.x;
            let dy = M.roundToNearest(r.y, 1/global.upscale) - r.y;
            r.x += dx;
            r.y += dy;

            if (r instanceof PIXI.Sprite && r.filterArea) {
                r.filterArea.x += dx;
                r.filterArea.y += dy;
            }

            // if (r instanceof PIXI.Sprite && r.mask) {
            //     r.mask.x += dx;
            //     r.mask.y += dy;
            // }
        }
        return result;
    }

    export function shift(result: Render.Result, dx: number, dy: number) {
        for (let r of result) {
            r.x += dx;
            r.y += dy;

            if (r instanceof PIXI.Sprite && r.filterArea) {
                r.filterArea.x += dx;
                r.filterArea.y += dy;
            }

            // if (r instanceof PIXI.Sprite && r.mask) {
            //     r.mask.x += dx;
            //     r.mask.y += dy;
            // }
        }
        return result;
    }

    export function upscalePixiObjectProperties(object: PIXI.DisplayObject, scale: 'upscale' | 'downscale') {
        let scaleMult = scale === 'upscale' ? global.upscale : 1 / global.upscale;
        object.filters?.forEach(filter => filter.setUpscale(scale === 'upscale' ? global.upscale : 1));
        if (object.filterArea) {
            object.filterArea.x *= scaleMult;
            object.filterArea.y *= scaleMult;
            object.filterArea.width *= scaleMult;
            object.filterArea.height *= scaleMult;
        }
        if (object instanceof PIXI.Container) {
            for (let child of object.children) {
                upscalePixiObjectProperties(child, scale);
            }
        }
    }
}