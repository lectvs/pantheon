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
        let resultCollisions: RaycastCollision[] = [];
        for (let iter = 0; iter < world.collisionIterations; iter++) {
            performNormalIteration(world, resultCollisions);
        }
        performFinalIteration(world, resultCollisions);

        // Collect any duplicate collisions for the same entities.
        let collectedCollisions = collectCollisions(resultCollisions);

        // Apply momentum transfer/callbacks
        applyCollisionEffects(collectedCollisions, world.delta);
    }

    function performNormalIteration(world: World, resultCollisions: RaycastCollision[]) {
        let collisions = getRaycastCollisions(world)
                .sort((a,b) => a.collision.t - b.collision.t);

        for (let collision of collisions) {
            let success = resolveCollision(world, collision);
            if (success) resultCollisions.push(collision);
        }
    }

    function performFinalIteration(world: World, resultCollisions: RaycastCollision[]) {
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
                    let success = resolveCollision(world, collision, collision.move);
                    if (success) resultCollisions.push(collision);
                    currentSet.add(collision.from);
                    doneWithCollisions = false;
                }

                if (hasFrom && !hasMove) {
                    let success = resolveCollision(world, collision, collision.from);
                    if (success) resultCollisions.push(collision);
                    currentSet.add(collision.move);
                    doneWithCollisions = false;
                }
            }
        }
    }

    // Return true iff the collision actually happened.
    function resolveCollision(world: World, collision: RaycastCollision, forceImmovable?: PhysicsWorldObject) {
        let raycastCollision: RaycastCollision = {
            move: collision.move,
            from: collision.from,
            collision: collision.move.bounds.getRaycastCollision(collision.move.x-collision.move.physicslastx, collision.move.y-collision.move.physicslasty, collision.from.bounds, collision.from.x-collision.from.physicslastx, collision.from.y-collision.from.physicslasty),
        };
        
        if (!raycastCollision.collision) return false;

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

        if (!displacementCollision.collision) return false;

        applyDisplacementForCollision(displacementCollision, forceImmovable);

        return true;
    }

    function getRaycastCollisions(world: World): RaycastCollision[] {
        let raycastCollisions: RaycastCollision[] = [];

        for (let collision of world.collisions) {
            for (let move of world.physicsGroups[collision.move].worldObjects) {
                for (let from of world.physicsGroups[collision.from].worldObjects) {
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

    function collectCollisions(collisions: RaycastCollision[]) {
        let collisionGroups: RaycastCollision[][] = [];

        for (let collision of collisions) {
            let collisionFoundInList = false;
            for (let collisionList of collisionGroups) {
                if (collisionList[0].move === collision.move && collisionList[0].from === collision.from) {
                    collisionList.push(collision);
                    collisionFoundInList = true;
                    break;
                }
            }
            if (!collisionFoundInList) {
                collisionGroups.push([collision]);
            }
        }

        return collisionGroups.map(collisionList => {
            return <RaycastCollision>{
                move: collisionList[0].move,
                from: collisionList[0].from,
                callback: collisionList[0].callback,
                transferMomentum: collisionList[0].transferMomentum,
                collision: {
                    bounds1: collisionList[0].move.bounds,
                    bounds2: collisionList[0].from.bounds,
                    displacementX: A.sum(collisionList, collision => collision.collision.displacementX),
                    displacementY: A.sum(collisionList, collision => collision.collision.displacementY),
                    t: M.min(collisionList, collision => collision.collision.t),
                }
            };
        });
    }

    function applyCollisionEffects(collisions: RaycastCollision[], delta: number) {
        for (let collision of collisions) {
            applyMomentumTransferForCollision(delta, collision, collision.transferMomentum);

            if (collision.callback) collision.callback(collision.move, collision.from);
            collision.move.onCollide(collision.from);
            collision.from.onCollide(collision.move);
        }
    }

    function applyMomentumTransferForCollision(delta: number, collision: Physics.DisplacementCollision, transferMomentum: boolean) {
        if (!collision.move.isImmovable()) {
            let fromvx = transferMomentum ? (collision.from.x - collision.from.physicslastx)/delta : 0;
            let fromvy = transferMomentum ? (collision.from.y - collision.from.physicslasty)/delta : 0;
            collision.move.v.x -= fromvx;
            collision.move.v.y -= fromvy;
            zeroVelocityAgainstDisplacement(collision.move, collision.collision.displacementX, collision.collision.displacementY);
            collision.move.v.x += fromvx;
            collision.move.v.y += fromvy;
        }

        if (!collision.from.isImmovable()) {
            let movevx = transferMomentum ? (collision.move.x - collision.move.physicslastx)/delta : 0;
            let movevy = transferMomentum ? (collision.move.y - collision.move.physicslasty)/delta : 0;
            collision.move.v.x -= movevx;
            collision.move.v.y -= movevy;
            zeroVelocityAgainstDisplacement(collision.from, -collision.collision.displacementX, -collision.collision.displacementY);
            collision.move.v.x += movevx;
            collision.move.v.y += movevy;
        }
    }

    function zeroVelocityAgainstDisplacement(obj: PhysicsWorldObject, dx: number, dy: number) {
        let dot = obj.v.x * dx + obj.v.y * dy;
        if (dot >= 0) return;

        let factor = dot / M.magnitudeSq(dx, dy);
        obj.v.x -= factor * dx;
        obj.v.y -= factor * dy;
    }
}