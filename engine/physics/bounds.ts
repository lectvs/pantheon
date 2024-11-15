namespace Bounds {
    export type Parent = Pt;
    export type RaycastCollision = {
        bounds1: Bounds;
        bounds2: Bounds;

        // "Time" taken from the start of the raycast up to collision.
        // t=1 means the collision occured at the end of the full frame.
        t: number;

        // Amount bounds1 would need to move to fully separate from bounds2.
        displacementX: number;
        displacementY: number;
    }

    export type DisplacementCollision = {
        bounds1: Bounds;
        bounds2: Bounds;

        // Amount bounds1 would need to move to fully separate from bounds2.
        displacementX: number;
        displacementY: number;
    }
}

interface Bounds {
    parent?: Pt;
    x: number;
    y: number;
    clone(): Bounds;
    containsPoint(x: number | Pt, y?: number): boolean;
    debugRender(): Render.Result;
    /** FOR USE WITH PHYSICS RESOLVECOLLISIONS ONLY. */
    freeze(): void;
    getBoundingBox$(): Rectangle;
    getRaycastCollision$(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision | undefined;
    getDisplacementCollision$(other: Bounds): Bounds.DisplacementCollision | undefined;
    overlaps(other: Bounds): boolean;
    /** FOR USE WITH PHYSICS RESOLVECOLLISIONS ONLY. REQUIRES BOUNDS TO BE FROZEN TO BE USEFUL. */
    move(dx: number, dy: number): void;
    raycast(x: number, y: number, dx: number, dy: number): number;
    /** FOR USE WITH PHYSICS RESOLVECOLLISIONS ONLY. */
    unfreeze(): void;
}

namespace Bounds {
    export function fromString(str: string): Bounds {
        // Parse bounds in the form "x,y,w,h"
        let rectBoundsMatch = St.removeWhitespace(str).match(/^([-a-z0-9,\.]+)$/);
        if (rectBoundsMatch) {
            let params = rectBoundsMatch[1].split(',');
            return new RectBounds(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]), parseFloat(params[3]));
        }

        // Parse bounds in the form "type(x,y,...)"
        let match = St.removeWhitespace(str).match(/^([a-z]+)\(([-a-z0-9,\.]+)\)$/);
        if (!match) {
            console.error('Could not parse Bounds:', str);
            return new NullBounds();
        }
        let name = match[1];
        let params = match[2].split(',');

        if (name === 'rect') {
            return new RectBounds(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]), parseFloat(params[3]));
        }

        if (name === 'circle') {
            return new CircleBounds(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]));
        }

        if (name === 'slope') {
            if (!SlopeBounds.ALL_DIRECTIONS.includes(params[4])) {
                console.error('Invalid slope direction from parsed bounds:', str);
                return new NullBounds();
            }
            return new SlopeBounds(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]), parseFloat(params[3]), params[4] as SlopeBounds.Direction);
        }

        if (name === 'invertedrect') {
            return new InvertedRectBounds(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]), parseFloat(params[3]));
        }

        if (name === 'invertedcircle') {
            return new InvertedCircleBounds(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]));
        }

        console.error('Invalid bounds type:', str);
        return new NullBounds();
    }
}
