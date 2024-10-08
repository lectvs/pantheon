namespace LdtkWorld {
    export type LdtkWorld = {
        levels: Dict<Level>;
    }

    export type Level = {
        tilemap: Tilemap.Tilemap;
        entities: Entity[];
    }

    export type Entity = {
        x: number;
        y: number;
        identifier: string;
        iid: string;
        placeholder: string;
        name?: string;
        texture?: string;
        bounds?: string;
        layer?: string;
        physicsGroup?: string;
        data: any;
    }

    export function getEntities(ldtkWorld: string | LdtkWorld, level: string) {
        if (St.isString(ldtkWorld)) {
            let world = AssetCache.getLdtkWorld(ldtkWorld);
            if (!world) return [];
            ldtkWorld = world;
        }

        if (!(level in ldtkWorld.levels)) {
            console.error(`Level '${level}' is not in Ldtk world:`, ldtkWorld);
            return [];
        }

        let worldObjects: WorldObject[] = [];

        for (let entity of ldtkWorld.levels[level].entities) {
            let worldObject = getInstantiatedWorldObject(entity);
            if (!worldObject) continue;

            // Default name to iid if not present.
            if (entity.iid && !worldObject.name) worldObject.name = entity.iid;

            if (entity.name) worldObject.name = entity.name;
            if (entity.layer) worldObject.layer = entity.layer;
            if (entity.physicsGroup) worldObject.physicsGroup = entity.physicsGroup;
            if (entity.bounds && worldObject instanceof PhysicsWorldObject) {
                worldObject.bounds = Bounds.fromString(entity.bounds);
            }

            for (let field in entity.data) {
                worldObject.data[field] = entity.data[field];
            }

            worldObjects.push(worldObject);
        }

        return worldObjects;
    }

    function getInstantiatedWorldObject(entity: LdtkWorld.Entity) {
        if (entity.placeholder === 'Sprite') {
            return new Sprite({
                x: entity.x,
                y: entity.y,
                texture: entity.texture,
            });
        }

        let constructor = O.getPath(window, entity.placeholder) as new (x: number, y: number) => WorldObject;  // Get the class from global scope
        if (!constructor || !constructor.prototype || !constructor.prototype.constructor.name) {
            console.error(`Placeholder '${entity.placeholder}' for Ldtk entity '${entity.name}' does not exist.`);
            return undefined;
        }
        try {
            return new constructor(entity.x, entity.y);
        } catch (err) {
            console.error(`Cannot instantiate Ldtk entity '${entity.name}':`, err);
            return undefined;
        }
    }
}