namespace Physics {
    export type CollisionCallback = (collision: Collision) => any;

    export type Collision = {
        self: CollisionObject;
        other: CollisionObject;
    }

    export type MomentumTransferMode = 'zero_velocity_global' | 'zero_velocity_local' | 'elastic';

    type CollisionData = {
        move: PhysicsWorldObject;
        from: PhysicsWorldObject;
    }

    type RaycastCollisionData = CollisionData & {
        collision: Bounds.RaycastCollision;
        callback?: CollisionCallback;
        momentumTransfer?: MomentumTransferMode;
    }

    type DisplacementCollisionData = CollisionData & {
        collision: Bounds.DisplacementCollision;
    }

    type CollisionObject = {
        obj: PhysicsWorldObject;
        pre_vx: number;
        pre_vy: number;
        post_vx: number;
        post_vy: number;
    }

    type PhysicsObjectDataCache = {
        dpos: Dict<Vector2>;
    }

    export function resolveCollisions(world: World) {
        let collidingPhysicsWorldObjects = getCollidingPhysicsObjects(world);
        let physicsObjectDataCache = cachePhysicsObjectData(collidingPhysicsWorldObjects);

        let iters = 1;
        for (let worldObject of collidingPhysicsWorldObjects) {
            let d = physicsObjectDataCache.dpos[worldObject.uid];
            worldObject.x -= d.x;
            worldObject.y -= d.y;

            if (d.magnitude < world.minDistanceIgnoreCollisionStepCalculation) {
                iters = Math.max(iters, Math.ceil(d.magnitude / world.maxDistancePerCollisionStep));
            }

            worldObject.bounds.freeze();
        }

        let resultCollisions: RaycastCollisionData[] = [];

        for (let iter = 0; iter < iters; iter++) {
            for (let worldObject of collidingPhysicsWorldObjects) {
                let d = physicsObjectDataCache.dpos[worldObject.uid];
                worldObject.x += d.x / iters;
                worldObject.y += d.y / iters;
                worldObject.bounds.move(d.x / iters, d.y / iters);
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

        for (let worldObject of collidingPhysicsWorldObjects) {
            worldObject.bounds.unfreeze();
        }
    }

    function performNormalIteration(world: World, resultCollisions: RaycastCollisionData[]) {
        let collisions = getRaycastCollisions(world)
                .sort((a,b) => a.collision.t - b.collision.t);

        for (let collision of collisions) {
            let success = resolveCollision(world, collision);
            if (success) resultCollisions.push(collision);
        }
    }

    function performFinalIteration(world: World, resultCollisions: RaycastCollisionData[]) {
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
    function resolveCollision(world: World, collision: RaycastCollisionData, forceImmovable?: PhysicsWorldObject) {
        let raycastCollision: RaycastCollisionData = {
            move: collision.move,
            from: collision.from,
            collision: collision.move.bounds.getRaycastCollision(collision.move.x-collision.move.physicslastx, collision.move.y-collision.move.physicslasty, collision.from.bounds, collision.from.x-collision.from.physicslastx, collision.from.y-collision.from.physicslasty),
        };
        
        if (!raycastCollision.collision) return false;

        let displacementCollision: DisplacementCollisionData = {
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

    function getRaycastCollisions(world: World): RaycastCollisionData[] {
        let raycastCollisions: RaycastCollisionData[] = [];

        for (let collision of world.collisions) {
            for (let imove = 0; imove < world.physicsGroups[collision.move].worldObjects.length; imove++) {
                let fromStart = collision.move === collision.from ? imove + 1 : 0;  // Don't double-count collisions between members of the same physics group.
                for (let ifrom = fromStart; ifrom < world.physicsGroups[collision.from].worldObjects.length; ifrom++) {
                    let move = world.physicsGroups[collision.move].worldObjects[imove];
                    let from = world.physicsGroups[collision.from].worldObjects[ifrom];

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

    function applyDisplacementForCollision(collision: DisplacementCollisionData, forceImmovable?: PhysicsWorldObject) {
        let moveImmovable = collision.move.isImmovable() || collision.move === forceImmovable;
        let fromImmovable = collision.from.isImmovable() || collision.from === forceImmovable;

        if (moveImmovable && fromImmovable) return;

        if (moveImmovable) {
            collision.from.x -= collision.collision.displacementX;
            collision.from.y -= collision.collision.displacementY;
            collision.from.bounds.move(-collision.collision.displacementX, -collision.collision.displacementY);
            return;
        }

        if (fromImmovable) {
            collision.move.x += collision.collision.displacementX;
            collision.move.y += collision.collision.displacementY;
            collision.move.bounds.move(collision.collision.displacementX, collision.collision.displacementY);
            return;
        }


        let massFactor = (collision.move.mass + collision.from.mass === 0) ? 0.5 :
                            collision.from.mass / (collision.move.mass + collision.from.mass);

        collision.move.x += massFactor * collision.collision.displacementX;
        collision.move.y += massFactor * collision.collision.displacementY;
        collision.move.bounds.move(massFactor * collision.collision.displacementX, massFactor * collision.collision.displacementY);
        collision.from.x -= (1-massFactor) * collision.collision.displacementX;
        collision.from.y -= (1-massFactor) * collision.collision.displacementY;
        collision.from.bounds.move(-(1-massFactor) * collision.collision.displacementX, -(1-massFactor) * collision.collision.displacementY);
    }

    function collectCollisions(collisions: RaycastCollisionData[]) {
        let collisionGroups: RaycastCollisionData[][] = [];

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
            return <RaycastCollisionData>{
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

    function applyCollisionEffects(collisions: RaycastCollisionData[], delta: number) {
        for (let collision of collisions) {
            let moveCollisionInfo: Physics.Collision = {
                self: {
                    obj: collision.move,
                    pre_vx: collision.move.v.x,
                    pre_vy: collision.move.v.y,
                    post_vx: collision.move.v.x,  // Will be modified after momentum transfer
                    post_vy: collision.move.v.y,  // Will be modified after momentum transfer
                },
                other: {
                    obj: collision.from,
                    pre_vx: collision.from.v.x,
                    pre_vy: collision.from.v.y,
                    post_vx: collision.from.v.x,  // Will be modified after momentum transfer
                    post_vy: collision.from.v.y,  // Will be modified after momentum transfer
                }
            };

            let fromCollisionInfo: Physics.Collision = {
                self: moveCollisionInfo.other,
                other: moveCollisionInfo.self
            };

            applyMomentumTransferForCollision(collision, collision.momentumTransfer, delta);

            moveCollisionInfo.self.post_vx = collision.move.v.x;
            moveCollisionInfo.self.post_vy = collision.move.v.y;
            moveCollisionInfo.other.post_vx = collision.from.v.x;
            moveCollisionInfo.other.post_vy = collision.from.v.y;

            if (collision.callback) collision.callback(moveCollisionInfo);
            collision.move.onCollide(moveCollisionInfo);
            collision.from.onCollide(fromCollisionInfo);
        }
    }

    function applyMomentumTransferForCollision(collision: DisplacementCollisionData, momentumTransferMode: MomentumTransferMode, delta: number,) {

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

    function getCollidingPhysicsObjects(world: World): PhysicsWorldObject[] {
        return <PhysicsWorldObject[]>world.worldObjects.filter(worldObject => {
            if (!(worldObject instanceof PhysicsWorldObject)) return false;
            if (!worldObject.physicsGroup) return false;
            if (!worldObject.isActive()) return false;
            if (!worldObject.colliding) return false;
            return true;
        });
    }

    function cachePhysicsObjectData(physicsWorldObjects: PhysicsWorldObject[]): PhysicsObjectDataCache {
        let dpos: Dict<Vector2> = {};

        for (let worldObject of physicsWorldObjects) {
            dpos[worldObject.uid] = vec2(worldObject.x - worldObject.physicslastx, worldObject.y - worldObject.physicslasty);
        }

        return { dpos };
    }
}