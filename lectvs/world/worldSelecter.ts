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

    collidesWith(physicsGroup: string) {
        let groups = this.world.getPhysicsGroupsThatCollideWith(physicsGroup);
        return <PhysicsWorldObject[]>_.flatten(groups.map(group => this.world.physicsGroups[group].worldObjects));
    }

    name<T extends WorldObject>(name: string, checked: boolean = true) {
        let results = <T[]>this.world.worldObjectsByName[name] || [];
        if (_.isEmpty(results)) {
            if (checked) error(`No object with name ${name} exists in world:`, this.world);
            return undefined;
        }
        if (results.length > 1) {
            debug(`Multiple objects with name ${name} exist in world. Returning one of them. World:`, this.world);
        }
        return results[0];
    }

    nameAll<T extends WorldObject>(name: string) {
        return A.clone(<T[]>this.world.worldObjectsByName[name] || []);
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

    type<T extends WorldObject>(type: new (...args) => T, checked: boolean = true) {
        let results = this.typeAll(type);
        if (_.isEmpty(results)) {
            if (checked) error(`No object of type ${type.name} exists in world:`, this.world);
            return undefined;
        }
        if (results.length > 1) {
            debug(`Multiple objects of type ${type.name} exist in world. Returning one of them. World:`, this.world);
        }
        return results[0];
    }

    typeAll<T extends WorldObject>(type: new (...args) => T) {
        return <T[]>this.world.worldObjects.filter(obj => obj instanceof type);
    }
}