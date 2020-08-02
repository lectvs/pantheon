namespace Physics2 {

    export type Collision = {
        move: PhysicsWorldObject;
        from: PhysicsWorldObject;
    }

    export type RaycastCollision = Collision & {
        collision: Bounds.RaycastCollision;
    }

    export type DisplacementCollision = Collision & {
        collision: Bounds.DisplacementCollision;
    }

    export function resolveCollisions(world: World) {
        let iter = 0;
        while (iter < world.collisionIterations) {
            iter++;
            debug(`begin iter ${iter}`);

            let collisions = getRaycastCollisions(world)
                                .sort((a,b) => a.collision.t - b.collision.t);

            debug('collisions:', collisions);

            for (let collision of collisions) {
                resolveCollision(world, collision);
            }
            debug(`end iter ${iter}`);
        }
    }

    function resolveCollision(world: World, collision: RaycastCollision) {
        let displacementCollision: DisplacementCollision = {
            move: collision.move,
            from: collision.from,
            collision: collision.move.bounds.getDisplacementCollision(collision.from.bounds),
        };

        if (!displacementCollision || !displacementCollision.collision) return;

        let antiDisplacementCollision: DisplacementCollision = {
            move: displacementCollision.from,
            from: displacementCollision.move,
            collision: {
                bounds1: displacementCollision.from.bounds,
                bounds2: displacementCollision.move.bounds,
                displacementX: -displacementCollision.collision.displacementX,
                displacementY: -displacementCollision.collision.displacementY,
            }
        };

        applyDisplacementForCollision(displacementCollision);
        applyDisplacementForCollision(antiDisplacementCollision);
        applyMomentumTransferForCollision(world.delta, displacementCollision);
        applyMomentumTransferForCollision(world.delta, antiDisplacementCollision);
    }

    function getRaycastCollisions(world: World): RaycastCollision[] {
        let raycastCollisions: RaycastCollision[] = [];
        for (let moveGroup in world.collisions) {
            for (let move of world.physicsGroups[moveGroup].worldObjects) {
                raycastCollisions.push(...getRaycastCollisionsForMoveObject(world, move));
            }
        }
        return raycastCollisions;
    }

    function getRaycastCollisionsForMoveObject(world: World, move: PhysicsWorldObject) {
        let raycastCollisions: RaycastCollision[] = [];
        for (let collision of world.collisions[move.physicsGroup]) {
            let fromGroup = collision.collidingPhysicsGroup;
            for (let from of world.physicsGroups[fromGroup].worldObjects) {
                if (move === from) continue;
                if (!G.overlapRectangles(move.bounds.getBoundingBox(), from.bounds.getBoundingBox())) continue;
                raycastCollisions.push({
                    move, from,
                    collision: move.bounds.getRaycastCollision(move.x-move.physicslastx, move.y-move.physicslasty, from.bounds, from.x-from.physicslastx, from.y-from.physicslasty),
                });
            }
        }
        return raycastCollisions.filter(col => col && col.collision);
    }

    // <---------------------------------------------> //

    export function resolveCollisions_old(world: World) {
        //debug('start collisions')
        let iter = 0;
        while (iter < world.collisionIterations) {
            iter++;

            let collisions = getCollisions(world);

            if (_.isEmpty(collisions)) {
                break;
            }

            //debug(collisions);

            for (let collision of collisions) {
                applyDisplacementForCollision(collision);
                applyMomentumTransferForCollision(world.delta, collision);
            }
        }
    }

    function getCollisions(world: World): DisplacementCollision[] {
        return _.flatten(_.values(world.physicsGroups).map(group => group.worldObjects.map(obj => getCollisionsForObject(obj, world))));
    }

    function getCollisionsForObject(obj: PhysicsWorldObject, world: World): DisplacementCollision[] {
        let collidingObjs: PhysicsWorldObject[] = _.flatten(world.collisions[obj.physicsGroup].map(col => world.physicsGroups[col.collidingPhysicsGroup].worldObjects));
        let possibleCollidingObjs = collidingObjs.filter(colObj => G.overlapRectangles(obj.bounds.getBoundingBox(), colObj.bounds.getBoundingBox()));
        let collisions = possibleCollidingObjs
                        .map(other => (<Physics2.RaycastCollision>{
                            move: obj,
                            from: other,
                            collision: obj.bounds.getRaycastCollision(obj.x - obj.physicslastx, obj.y - obj.physicslasty, other.bounds, other.x - other.physicslastx, other.y - other.physicslasty),
                        }))
                        .filter(col => col.collision)
                        .sort((a,b) => a.collision.t - b.collision.t);
        if (_.isEmpty(collisions)) {
            return [];
        }

        let origObjX = obj.x;
        let origObjY = obj.y;

        let newCollisions = collisions.map(collision => {
            let newCollision = (<Physics2.DisplacementCollision>{
                move: collision.move,
                from: collision.from,
                collision: collision.move.bounds.getDisplacementCollision(collision.from.bounds),
            });

            if (newCollision.collision) {
                applyDisplacementForCollision(newCollision);
            }

            return newCollision;
        })
        .filter(col => col.collision);

        obj.x = origObjX;
        obj.y = origObjY;

        return newCollisions;
    }

    function applyDisplacementForCollision(collision: Physics2.DisplacementCollision) {
        if (collision.move.immovable) return;

        if (collision.from.immovable) {
            collision.move.x += collision.collision.displacementX;
            collision.move.y += collision.collision.displacementY;
            return;
        }

        let massFactor = (collision.move.mass + collision.from.mass === 0) ? 1 :
                            collision.from.mass / (collision.move.mass + collision.from.mass);

        collision.move.x += massFactor * collision.collision.displacementX;
        collision.move.y += massFactor * collision.collision.displacementY;
    }

    function applyMomentumTransferForCollision(delta: number, collision: Physics2.DisplacementCollision) {
        if (collision.move.immovable) return;

        let fromvx = (collision.from.x - collision.from.physicslastx)/delta;
        let fromvy = (collision.from.y - collision.from.physicslasty)/delta;
        collision.move.vx -= fromvx;
        collision.move.vy -= fromvy;
        zeroVelocityAgainstDisplacementAxis(collision.move, collision.collision.displacementX, collision.collision.displacementY);
        collision.move.vx += fromvx;
        collision.move.vy += fromvy;
    }

    function zeroVelocityAgainstDisplacementAxis(obj: PhysicsWorldObject, dx: number, dy: number) {
        let dot = obj.vx * dx + obj.vy * dy;
        if (dot >= 0) return;

        let factor = dot / M.magnitudeSq(dx, dy);
        obj.vx -= factor * dx;
        obj.vy -= factor * dy;
    }
}