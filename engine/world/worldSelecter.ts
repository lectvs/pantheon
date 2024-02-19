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

    collidesWith$(physicsGroup: string) {
        let groups = this.world.getPhysicsGroupsThatCollideWith$(physicsGroup);
        let result: PhysicsWorldObject[] = FrameCache.array();
        for (let group of groups) {
            result.pushAll(this.world.physicsGroups[group].worldObjects);
        }
        return result;
    }

    modules$<T extends WorldObject, S extends Module<T>>(moduleType: new (...args: any[]) => S): S[] {
        if (!moduleType) return [];
        let result: S[] = FrameCache.array();
        for (let worldObject of this.world.worldObjects) {
            let module = worldObject.getModule(moduleType);
            if (module) {
                result.push(module);
            }
        }
        return result;
    }

    name<T extends WorldObject>(name: string, checked: 'checked' | 'unchecked' = 'checked'): T | undefined {
        let results = this.nameAll$<T>(name);
        if (A.isEmpty(results)) {
            if (checked === 'checked') console.error(`No object with name ${name} exists in world:`, this.world);
            return undefined;
        }
        if (results.length > 1) {
            console.error(`Multiple objects with name ${name} exist in world. Returning one of them. World:`, this.world);
        }
        return results[0];
    }

    nameAll$<T extends WorldObject>(name: string) {
        let result: T[] = FrameCache.array();
        for (let worldObject of this.world.worldObjects) {
            if (worldObject.name === name) {
                result.push(worldObject as T);
            }
        }
        return result;
    }

    names$<T extends WorldObject, K extends string, O extends {[key in K]: T}>(type: new () => T, ...names: K[]): O {
        let result: Dict<T | undefined> = FrameCache.object();

        for (let name of names) {
            result[name] = this.name(name as string);
        }

        return result as O;
    }

    overlap$(bounds: Bounds, physicsGroups?: string[]): PhysicsWorldObject[] {
        let objs: PhysicsWorldObject[];

        if (physicsGroups) {
            objs = FrameCache.array();
            for (let pg in this.world.physicsGroups) {
                if (!physicsGroups.includes(pg)) continue;
                objs.pushAll(this.world.physicsGroups[pg].worldObjects);
            }
        } else {
            objs = this.world.select.typeAll$(PhysicsWorldObject);
        }

        if (A.isEmpty(objs)) return [];
        return objs.filterInPlace(obj => obj.isOverlapping(bounds));
    }

    raycast$(x: number, y: number, dx: number, dy: number, physicsGroups: string[]): WorldSelecter.RaycastResult[] {
        let result: WorldSelecter.RaycastResult[] = FrameCache.array();
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

    tag$<T extends WorldObject>(tag: string) {
        let result: T[] = FrameCache.array();
        for (let worldObject of this.world.worldObjects) {
            if (worldObject.tags.includes(tag)) {
                result.push(worldObject as T);
            }
        }
        return result;
    }

    type<T extends WorldObject>(type: new (...args: any[]) => T, checked: 'checked' | 'unchecked' = 'checked') {
        let results = this.typeAll$(type);
        if (A.isEmpty(results)) {
            if (checked === 'checked') console.error(`No object of type ${type.name} exists in world:`, this.world);
            return undefined;
        }
        if (results.length > 1) {
            console.error(`Multiple objects of type ${type.name} exist in world. Returning one of them. World:`, this.world);
        }
        return results[0];
    }

    typeAll$<T extends WorldObject>(type: new (...args: any[]) => T) {
        let result: T[] = FrameCache.array();
        for (let worldObject of this.world.worldObjects) {
            if (worldObject instanceof type) {
                result.push(worldObject);
            }
        }
        return result;
    }
}