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
        return groups.map(group => this.world.physicsGroups[group].worldObjects).flat();
    }

    modules<T extends WorldObject, S extends Module<T>>(moduleType: new (...args: any[]) => S): S[] {
        if (!moduleType) return [];
        return this.world.worldObjects.map(obj => obj.getModule(moduleType)).filter(m => m) as S[];
    }

    name<T extends WorldObject>(name: string, checked: boolean = true): T | undefined {
        let results = this.nameAll<T>(name);
        if (A.isEmpty(results)) {
            if (checked) console.error(`No object with name ${name} exists in world:`, this.world);
            return undefined;
        }
        if (results.length > 1) {
            console.error(`Multiple objects with name ${name} exist in world. Returning one of them. World:`, this.world);
        }
        return results[0];
    }

    nameAll<T extends WorldObject>(name: string) {
        if (!name) return [];
        return <T[]>this.world.worldObjects.filter(obj => obj.name === name);
    }

    names<T extends WorldObject, K extends string, O extends {[key in K]: T}>(type: new () => T, ...names: K[]): O {
        let result: Dict<T | undefined> = {};

        for (let name of names) {
            result[name] = this.name(name as string);
        }

        return result as O;
    }

    overlap(bounds: Bounds, physicsGroups?: string[]): PhysicsWorldObject[] {
        let objs = physicsGroups
                    ? Object.keys(this.world.physicsGroups)
                        .filter(pg => physicsGroups.includes(pg))
                        .map(pg => this.world.physicsGroups[pg].worldObjects)
                        .flat()
                    : this.world.select.typeAll(PhysicsWorldObject);

        if (A.isEmpty(objs)) return [];
        return objs.filter(obj => obj.isOverlapping(bounds));
    }

    raycast(x: number, y: number, dx: number, dy: number, physicsGroups: string[]): WorldSelecter.RaycastResult[] {
        let result: WorldSelecter.RaycastResult[] = [];
        for (let physicsGroup in this.world.physicsGroups) {
            if (!physicsGroups.includes(physicsGroup)) continue;
            for (let obj of this.world.physicsGroups[physicsGroup].worldObjects) {
                let t = obj.bounds.raycast(x, y, dx, dy);
                if (!isFinite(t)) continue;
                result.push({ obj, t });
            }
        }
        return result.sort((r1, r2) => r1.t - r2.t);
    }

    tag<T extends WorldObject>(tag: string) {
        return <T[]>this.world.worldObjects.filter(obj => obj.tags.includes(tag));
    }

    type<T extends WorldObject>(type: new (...args) => T, checked: boolean = true) {
        let results = this.typeAll(type);
        if (A.isEmpty(results)) {
            if (checked) console.error(`No object of type ${type.name} exists in world:`, this.world);
            return undefined;
        }
        if (results.length > 1) {
            console.error(`Multiple objects of type ${type.name} exist in world. Returning one of them. World:`, this.world);
        }
        return results[0];
    }

    typeAll<T extends WorldObject>(type: new (...args) => T) {
        return <T[]>this.world.worldObjects.filter(obj => obj instanceof type);
    }
}