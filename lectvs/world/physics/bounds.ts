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
    parent: Pt;
    clone(): Bounds;
    getBoundingBox(x?: number, y?: number): Rectangle;
    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision;
    getDisplacementCollision(other: Bounds): Bounds.DisplacementCollision;
    isOverlapping(other: Bounds): boolean;
    raycast(x: number, y: number, dx: number, dy: number): number;
}
