namespace WorldSelecter {
    export type RaycastResult = {
        obj: PhysicsWorldObject;
        t: number;
    }
}

class WorldSelecter {
    private world: World;
    
    constructor(world: World) {
        this.world = world;
    }

    overlap(bounds: Bounds, physicsGroups: string[]): PhysicsWorldObject[] {
        let result = [];
        for (let physicsGroup in this.world.physicsGroups) {
            if (!_.contains(physicsGroups, physicsGroup)) continue;
            for (let obj of this.world.physicsGroups[physicsGroup].worldObjects) {
                if (!obj.isOverlapping(bounds)) continue;
                result.push(obj);
            }
        }
        return result;
    }

    raycast(x: number, y: number, dx: number, dy: number, physicsGroups: string[]): WorldSelecter.RaycastResult[] {
        let result: WorldSelecter.RaycastResult[] = [];
        for (let physicsGroup in this.world.physicsGroups) {
            if (!_.contains(physicsGroups, physicsGroup)) continue;
            for (let obj of this.world.physicsGroups[physicsGroup].worldObjects) {
                let t = obj.bounds.raycast(x, y, dx, dy);
                if (!isFinite(t)) continue;
                result.push({ obj, t });
            }
        }
        return result.sort((r1, r2) => r1.t - r2.t);
    }
}