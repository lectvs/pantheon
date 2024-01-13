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
        name: string;
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
            let constructor: new (x: number, y: number) => WorldObject = (window as any)[entity.name];  // Get the class from global scope
            if (!constructor || !constructor.prototype || !constructor.prototype.constructor.name) {
                console.error(`Ldtk entity '${entity.name}' does not exist.`);
                continue;
            }
            try {
                worldObjects.push(new constructor(entity.x, entity.y));
            } catch (err) {
                console.error(`Cannot instantiate Ldtk entity '${entity.name}':`, err);
                continue;
            }
        }

        return worldObjects;
    }
}