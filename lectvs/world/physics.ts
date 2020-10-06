namespace Physics {
    export type Collision = {
        move: PhysicsWorldObject;
        from: PhysicsWorldObject;
    }

    export type RaycastCollision = Collision & {
        collision: Bounds.RaycastCollision;
        callback?: Physics.CollisionCallback;
        transferMomentum?: boolean;
    }

    export type DisplacementCollision = Collision & {
        collision: Bounds.DisplacementCollision;
    }

    export type CollisionCallback = (move: PhysicsWorldObject, from: PhysicsWorldObject) => any;

    export function resolveCollisions(world: World) {
        let iter = 0;
        while (iter < world.collisionIterations) {
            iter++;
            performNormalIteration(world);
        }
        performFinalIteration(world);
    }

    function performNormalIteration(world: World) {
        let collisions = getRaycastCollisions(world)
                .sort((a,b) => a.collision.t - b.collision.t);

        for (let collision of collisions) {
            resolveCollision(world, collision);
        }
    }

    function performFinalIteration(world: World) {
        let collisions = getRaycastCollisions(world);

        let currentSet = new Set<PhysicsWorldObject>();
        for (let collision of collisions) {
            if (collision.move.isImmovable()) currentSet.add(collision.move);
            if (collision.from.isImmovable()) currentSet.add(collision.from);
        }

        let doneWithCollisions = false;
        while (!doneWithCollisions) {
            doneWithCollisions = true;
            for (let collision of collisions) {
                let hasMove = currentSet.has(collision.move);
                let hasFrom = currentSet.has(collision.from);

                if (hasMove && !hasFrom) {
                    resolveCollision(world, collision, collision.move);
                    currentSet.add(collision.from);
                    doneWithCollisions = false;
                }

                if (hasFrom && !hasMove) {
                    resolveCollision(world, collision, collision.from);
                    currentSet.add(collision.move);
                    doneWithCollisions = false;
                }
            }
        }
    }

    function resolveCollision(world: World, collision: RaycastCollision, forceImmovable?: PhysicsWorldObject) {
        let raycastCollision: RaycastCollision = {
            move: collision.move,
            from: collision.from,
            collision: collision.move.bounds.getRaycastCollision(collision.move.x-collision.move.physicslastx, collision.move.y-collision.move.physicslasty, collision.from.bounds, collision.from.x-collision.from.physicslastx, collision.from.y-collision.from.physicslasty),
        };
        
        if (!raycastCollision.collision) return;

        let displacementCollision: DisplacementCollision = {
            move: raycastCollision.move,
            from: raycastCollision.from,
            collision: undefined
        };

        // Use raycast collision displacement if applicable.
        if (M.magnitude(raycastCollision.collision.displacementX, raycastCollision.collision.displacementY) <= world.useRaycastDisplacementThreshold) {
            displacementCollision.collision = {
                bounds1: raycastCollision.move.bounds,
                bounds2: raycastCollision.from.bounds,
                displacementX: raycastCollision.collision.displacementX,
                displacementY: raycastCollision.collision.displacementY,
            };
        } else {
            displacementCollision.collision = raycastCollision.move.bounds.getDisplacementCollision(raycastCollision.from.bounds);
        }

        if (!displacementCollision.collision) return;

        applyDisplacementForCollision(displacementCollision, forceImmovable);
        applyMomentumTransferForCollision(world.delta, displacementCollision, collision.transferMomentum);

        if (collision.callback) collision.callback(collision.move, collision.from);
        collision.move.onCollide(collision.from);
        collision.from.onCollide(collision.move);
    }

    function getRaycastCollisions(world: World): RaycastCollision[] {
        let raycastCollisions: RaycastCollision[] = [];

        for (let collision of world.collisions) {
            for (let move of world.physicsGroups[collision.group1].worldObjects) {
                for (let from of world.physicsGroups[collision.group2].worldObjects) {
                    if (move === from) continue;
                    if (!G.overlapRectangles(move.bounds.getBoundingBox(), from.bounds.getBoundingBox())) continue;
                    if (!move.colliding || !from.colliding) continue;
                    if (!move.isCollidingWith(from) || !from.isCollidingWith(move)) continue;
                    let raycastCollision = move.bounds.getRaycastCollision(move.x-move.physicslastx, move.y-move.physicslasty, from.bounds, from.x-from.physicslastx, from.y-from.physicslasty);
                    if (!raycastCollision) continue;
                    raycastCollisions.push({
                        move, from,
                        collision: raycastCollision,
                        callback: collision.callback,
                        transferMomentum: collision.transferMomentum,
                    });
                }
            }
        }

        return raycastCollisions;
    }

    function applyDisplacementForCollision(collision: Physics.DisplacementCollision, forceImmovable?: PhysicsWorldObject) {
        let moveImmovable = collision.move.isImmovable() || collision.move === forceImmovable;
        let fromImmovable = collision.from.isImmovable() || collision.from === forceImmovable;

        if (moveImmovable && fromImmovable) return;

        if (moveImmovable) {
            collision.from.x -= collision.collision.displacementX;
            collision.from.y -= collision.collision.displacementY;
            return;
        }

        if (fromImmovable) {
            collision.move.x += collision.collision.displacementX;
            collision.move.y += collision.collision.displacementY;
            return;
        }

        let massFactor = (collision.move.mass + collision.from.mass === 0) ? 1 :
                            collision.from.mass / (collision.move.mass + collision.from.mass);

        collision.move.x += massFactor * collision.collision.displacementX;
        collision.move.y += massFactor * collision.collision.displacementY;
        collision.from.x -= (1-massFactor) * collision.collision.displacementX;
        collision.from.y -= (1-massFactor) * collision.collision.displacementY;
    }

    function applyMomentumTransferForCollision(delta: number, collision: Physics.DisplacementCollision, transferMomentum: boolean) {
        if (!collision.move.isImmovable()) {
            let fromvx = transferMomentum ? (collision.from.x - collision.from.physicslastx)/delta : 0;
            let fromvy = transferMomentum ? (collision.from.y - collision.from.physicslasty)/delta : 0;
            collision.move.vx -= fromvx;
            collision.move.vy -= fromvy;
            zeroVelocityAgainstDisplacement(collision.move, collision.collision.displacementX, collision.collision.displacementY);
            collision.move.vx += fromvx;
            collision.move.vy += fromvy;
        }

        if (!collision.from.isImmovable()) {
            let movevx = transferMomentum ? (collision.move.x - collision.move.physicslastx)/delta : 0;
            let movevy = transferMomentum ? (collision.move.y - collision.move.physicslasty)/delta : 0;
            collision.move.vx -= movevx;
            collision.move.vy -= movevy;
            zeroVelocityAgainstDisplacement(collision.from, -collision.collision.displacementX, -collision.collision.displacementY);
            collision.move.vx += movevx;
            collision.move.vy += movevy;
        }
    }

    function zeroVelocityAgainstDisplacement(obj: PhysicsWorldObject, dx: number, dy: number) {
        let dot = obj.vx * dx + obj.vy * dy;
        if (dot >= 0) return;

        let factor = dot / M.magnitudeSq(dx, dy);
        obj.vx -= factor * dx;
        obj.vy -= factor * dy;
    }
}