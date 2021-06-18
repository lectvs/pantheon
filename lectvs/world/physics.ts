namespace Physics {
    export type Collision = {
        move: PhysicsWorldObject;
        from: PhysicsWorldObject;
    }

    export type RaycastCollision = Collision & {
        collision: Bounds.RaycastCollision;
        callback?: Physics.CollisionCallback;
        momentumTransfer?: MomentumTransferMode;
    }

    export type DisplacementCollision = Collision & {
        collision: Bounds.DisplacementCollision;
    }

    export type CollisionCallback = (collision: CollisionInfo) => any;

    export type CollisionInfo = {
        self: CollisionObject;
        other: CollisionObject;
    }

    export type CollisionObject = {
        obj: PhysicsWorldObject;
        vx: number;
        vy: number;
    }

    export type MomentumTransferMode = 'zero_velocity_global' | 'zero_velocity_local' | 'elastic';

    export function resolveCollisions(world: World) {
        let dpos: Vector2[] = [];

        for (let worldObject of world.worldObjects) {
            let d = worldObject instanceof PhysicsWorldObject
                        ? vec2(worldObject.x - worldObject.physicslastx, worldObject.y - worldObject.physicslasty)
                        : vec2(worldObject.x - worldObject.lastx, worldObject.y - worldObject.lasty);
            dpos.push(d);

            worldObject.x -= d.x;
            worldObject.y -= d.y;
        }

        let resultCollisions: RaycastCollision[] = [];

        let iters = Math.max(1, M.max(dpos, d => Math.ceil(d.magnitude / world.maxDistancePerCollisionStep)));

        for (let iter = 0; iter < iters; iter++) {
            for (let i = 0; i < world.worldObjects.length; i++) {
                world.worldObjects[i].x += dpos[i].x / iters;
                world.worldObjects[i].y += dpos[i].y / iters;
            }
            performNormalIteration(world, resultCollisions);
        }

        for (let iter = 0; iter < world.collisionIterations - iters; iter++) {
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
                        momentumTransfer: collision.momentumTransfer,
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

        let massFactor = (collision.move.mass + collision.from.mass === 0) ? 0.5 :
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
                momentumTransfer: collisionList[0].momentumTransfer,
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
            let moveCollisionInfo: Physics.CollisionInfo = {
                self: {
                    obj: collision.move,
                    vx: collision.move.v.x,
                    vy: collision.move.v.y,
                },
                other: {
                    obj: collision.from,
                    vx: collision.from.v.x,
                    vy: collision.from.v.y,
                }
            };

            let fromCollisionInfo: Physics.CollisionInfo = {
                self: moveCollisionInfo.other,
                other: moveCollisionInfo.self
            };

            applyMomentumTransferForCollision(collision, collision.momentumTransfer, delta);

            if (collision.callback) collision.callback(moveCollisionInfo);
            collision.move.onCollide(moveCollisionInfo);
            collision.from.onCollide(fromCollisionInfo);
        }
    }

    function applyMomentumTransferForCollision(collision: Physics.DisplacementCollision, momentumTransferMode: MomentumTransferMode, delta: number,) {

        if (momentumTransferMode === 'elastic') {
            if (collision.move.isImmovable() && collision.from.isImmovable()) return;

            let d = new Vector2(collision.collision.displacementX, collision.collision.displacementY).normalized();

            let mm = collision.move.mass;
            let mf = collision.from.mass;
            if (mm + mf === 0) {
                // In case of invald masses, set both to the default 1.
                mm = 1; mf = 1;
            }

            let vmi_proj = G.dot(collision.move.v, d);
            let vfi_proj = G.dot(collision.from.v, d);

            let mass_factor = (collision.move.mass + collision.from.mass === 0) ? 0.5 :
                                collision.from.mass / (collision.move.mass + collision.from.mass);

            let elastic_factor_m = collision.move.isImmovable() ? 0 : collision.from.isImmovable() ? 1 : mass_factor;
            let elastic_factor_f = 1 - elastic_factor_m;

            let dvmf_proj = 2 * (vfi_proj - vmi_proj) * elastic_factor_m;
            let dvff_proj = 2 * (vmi_proj - vfi_proj) * elastic_factor_f;

            collision.move.v.x += dvmf_proj * collision.move.bounce * d.x;
            collision.move.v.y += dvmf_proj * collision.move.bounce * d.y;
            collision.from.v.x += dvff_proj * collision.from.bounce * d.x;
            collision.from.v.y += dvff_proj * collision.from.bounce * d.y;

        } else if (momentumTransferMode === 'zero_velocity_local') {
            if (!collision.move.isImmovable()) {
                let fromvx = delta === 0 ? 0 : (collision.from.x - collision.from.physicslastx) / delta;
                let fromvy = delta === 0 ? 0 : (collision.from.y - collision.from.physicslasty) / delta;
                collision.move.v.x -= fromvx;
                collision.move.v.y -= fromvy;
                zeroVelocityAgainstDisplacement(collision.move, collision.collision.displacementX, collision.collision.displacementY);
                collision.move.v.x += fromvx;
                collision.move.v.y += fromvy;
            }
    
            if (!collision.from.isImmovable()) {
                let movevx = delta === 0 ? 0 : (collision.move.x - collision.move.physicslastx) / delta;
                let movevy = delta === 0 ? 0 : (collision.move.y - collision.move.physicslasty) / delta;
                collision.move.v.x -= movevx;
                collision.move.v.y -= movevy;
                zeroVelocityAgainstDisplacement(collision.from, -collision.collision.displacementX, -collision.collision.displacementY);
                collision.move.v.x += movevx;
                collision.move.v.y += movevy;
            }
        } else { // zero_velocity_global
            if (!collision.move.isImmovable()) {
                zeroVelocityAgainstDisplacement(collision.move, collision.collision.displacementX, collision.collision.displacementY);
            }
            if (!collision.from.isImmovable()) {
                zeroVelocityAgainstDisplacement(collision.from, -collision.collision.displacementX, -collision.collision.displacementY);
            }
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