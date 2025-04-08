namespace WorldSelecter {
    export type RaycastResult = {
        obj: PhysicsWorldObject;
        t: number;
    }
}

class WorldSelecter {
    private world: World;
    private nameCache: Dict<WorldObject[]>;
    private typeCache: { typeName: string, type: new (...args: any[]) => WorldObject, worldObjects: WorldObject[] }[];
    
    constructor(world: World) {
        this.world = world;
        this.nameCache = {};
        this.typeCache = [];
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

    name<T extends WorldObject>(name: string, checked: 'checked' | 'unchecked' | boolean = true): T | undefined {
        let results = this.nameAll$<T>(name);
        let isUnchecked = !checked || checked === 'unchecked';
        if (A.isEmpty(results)) {
            if (!isUnchecked) console.error(`No object with name ${name} exists in world:`, this.world);
            return undefined;
        }
        if (results.length > 1) {
            console.error(`Multiple objects with name ${name} exist in world. Returning one of them. World:`, this.world);
        }
        return results[0];
    }

    nameAll$<T extends WorldObject>(name: string): T[] {
        if (this.nameCache[name]) {
            // TODO: after a while of natural testing, start returning cached values.
            //return FrameCache.copyOfArray(this.nameCache[name]) as T[];
        }
        let result: T[] = FrameCache.array();
        for (let worldObject of this.world.worldObjects) {
            if (worldObject.name === name) {
                result.push(worldObject as T);
            }
        }
        // TODO: after a while of natural testing, remove this validation.
        if (this.nameCache[name]) {
            this.validateNameCache(name, result);
        } else {
            if (result.length > 0) this.nameCache[name] = A.clone(result);
        }
        this.checkNameCacheLimit();
        return result;
    }

    names$<T extends WorldObject, K extends string, O extends {[key in K]?: T}>(type: new (...params: any[]) => T, ...names: K[]): O {
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

    type<T extends WorldObject>(type: new (...args: any[]) => T, checked: 'checked' | 'unchecked' | boolean = true) {
        let results = this.typeAll$(type);
        let isUnchecked = !checked || checked === 'unchecked';
        if (A.isEmpty(results)) {
            if (!isUnchecked) console.error(`No object of type ${type.name} exists in world:`, this.world);
            return undefined;
        }
        if (results.length > 1) {
            console.error(`Multiple objects of type ${type.name} exist in world. Returning one of them. World:`, this.world);
        }
        return results[0];
    }

    typeAll$<T extends WorldObject>(type: new (...args: any[]) => T) {
        let existingCacheEntry = this.typeCache.find(entry => entry.type === type);
        if (existingCacheEntry) {
            // TODO: after a while of natural testing, start returning cached values.
            //return FrameCache.copyOfArray(existingCacheEntry.worldObjects) as T[];
        }
        let result: T[] = FrameCache.array();
        for (let worldObject of this.world.worldObjects) {
            if (worldObject instanceof type) {
                result.push(worldObject);
            }
        }
        // TODO: after a while of natural testing, remove this validation.
        if (existingCacheEntry) {
            this.validateTypeCache(type, result);
        } else {
            if (result.length > 0) this.typeCache.push({ typeName: type.name, type, worldObjects: A.clone(result) });
        }
        this.checkTypeCacheLimit();
        return result;
    }

    // For use with World.Actions.addWorldObjectToWorld
    zinternal_addWorldObject(worldObject: WorldObject) {
        if (worldObject.name) this.addToNameCache(worldObject, worldObject.name);
        this.addToTypeCache(worldObject);
    }

    // For use with World.Actions.removeWorldObjectFromWorld
    zinternal_removeWorldObject(worldObject: WorldObject) {
        if (worldObject.name) this.removeFromNameCache(worldObject, worldObject.name);
        this.removeFromTypeCache(worldObject);
    }

    // For use with World.Actions.setName
    zinternal_setName(worldObject: WorldObject, oldName: string | undefined, newName: string | undefined) {
        if (oldName) this.removeFromNameCache(worldObject, oldName);
        if (newName) this.addToNameCache(worldObject, newName);
    }

    private addToNameCache(worldObject: WorldObject, name: string) {
        if (!this.nameCache[name]) return;
        if (this.nameCache[name].includes(worldObject)) return;
        this.nameCache[name].push(worldObject);
        this.checkNameCacheLimit();
    }

    private removeFromNameCache(worldObject: WorldObject, name: string) {
        if (!this.nameCache[name]) return;
        A.removeAll(this.nameCache[name], worldObject);
    }

    private addToTypeCache(worldObject: WorldObject) {
        for (let entry of this.typeCache) {
            if (worldObject instanceof entry.type && !entry.worldObjects.includes(worldObject)) {
                entry.worldObjects.push(worldObject);
            }
        }
        this.checkTypeCacheLimit();
    }

    private removeFromTypeCache(worldObject: WorldObject) {
        this.typeCache.forEach(entry => {
            if (worldObject instanceof entry.type) {
                A.removeAll(entry.worldObjects, worldObject);
            }
        });
    }

    private checkNameCacheLimit() {
        if (O.size(this.nameCache) > WorldSelecter.CACHE_SIZE_WARN_LIMIT) {
            console.warn('Too many entries in World.Selecter.nameCache! The limit is arbitrary and may need to be lifted:', O.size(this.nameCache), O.clone(this.nameCache), this.world);
        }
    }

    private checkTypeCacheLimit() {
        if (this.typeCache.length > WorldSelecter.CACHE_SIZE_WARN_LIMIT) {
            console.warn('Too many entries in World.Selecter.typeCache! The limit is arbitrary and may need to be lifted:', this.typeCache.length, A.clone(this.typeCache), this.world);
        }
    }

    private validateNameCache(name: string, expected: WorldObject[]) {
        if (!this.nameCache[name]) return;
        let actual = this.nameCache[name];
        if (actual.length !== expected.length) {
            console.error('World.Selecter.nameCache is not correct! Name:', name, 'Expected:', A.clone(expected), 'Actual:', A.clone(actual));
            return;
        }
        for (let obj of expected) {
            if (!actual.includes(obj)) {
                console.error('World.Selecter.nameCache is not correct! Object is missing from cache:', obj, 'Name:', name, 'Expected:', A.clone(expected), 'Actual:', A.clone(actual));
                return;
            }
        }
    }

    private validateTypeCache(type: new (...params: any[]) => WorldObject, expected: WorldObject[]) {
        let cacheEntry = this.typeCache.find(entry => entry.type === type);
        if (!cacheEntry) return;
        let actual = cacheEntry?.worldObjects;
        if (actual.length !== expected.length) {
            console.error('World.Selecter.typeCache is not correct! Type:', type.name, 'Expected:', A.clone(expected), 'Actual:', A.clone(actual));
            return;
        }
        for (let obj of expected) {
            if (!actual.includes(obj)) {
                console.error('World.Selecter.typeCache is not correct! Object is missing from cache:', obj, 'Type:', type.name, 'Expected:', A.clone(expected), 'Actual:', A.clone(actual));
                return;
            }
        }
    }

    static CACHE_SIZE_WARN_LIMIT = 25;
}