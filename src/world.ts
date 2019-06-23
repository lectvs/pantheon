/// <reference path="./worldObject.ts" />

namespace World {
    export type Config = WorldObject.Config & {
        physicsGroups?: Dict<World.PhysicsGroupConfig>;
        collisionOrder?: CollisionConfig[];
        layers?: World.LayerConfig[];

        renderDirectly?: boolean;
        width?: number;
        height?: number;
    }

    export type CollisionConfig = {
        move: string | string[];
        from: string | string[];
        transferMomentum?: boolean;
    }

    export type LayerConfig = {
        name: string;
        sortKey?: string;
        reverseSort?: boolean;
    }

    export type PhysicsGroupConfig = {
    }
}

class World extends WorldObject {
    worldObjects: WorldObject[];

    physicsGroups: Dict<World.PhysicsGroup>;
    collisionOrder: World.CollisionConfig[];

    layers: World.Layer[];

    private renderTexture: PIXIRenderTextureSprite;

    constructor(config: World.Config, defaults: World.Config = {}) {
        config = O.withDefaults(config, defaults);
        super(config);

        this.worldObjects = [];

        this.physicsGroups = this.createPhysicsGroups(config.physicsGroups);
        this.collisionOrder = O.getOrDefault(config.collisionOrder, []);

        this.layers = this.createLayers(config.layers);

        if (!config.renderDirectly) {
            this.renderTexture = new PIXIRenderTextureSprite(O.getOrDefault(config.width, Main.width), O.getOrDefault(config.height, Main.height));
        }
    }

    update(delta: number, world?: World) {
        super.update(delta, world);
        for (let worldObject of this.worldObjects) {
            worldObject.update(delta, this);
        }

        this.handleCollisions();
    }

    render(renderer: PIXI.Renderer, renderTexture?: PIXI.RenderTexture) {
        if (this.renderingDirectly) {
            this.renderWorld(renderer, renderTexture);
        } else {
            this.renderTexture.clear(renderer);
            this.renderWorld(renderer, this.renderTexture.renderTexture);
            renderer.render(this.renderTexture, renderTexture, false);
        }
        super.render(renderer, renderTexture);
    }

    renderWorld(renderer: PIXI.Renderer, renderTexture: PIXI.RenderTexture) {
        for (let layer of this.layers) {
            layer.sort();
            for (let worldObject of layer.worldObjects) {
                if (worldObject.visible) {
                    worldObject.render(renderer, renderTexture);
                }
            }
        }
    }
    
    addWorldObject(obj: WorldObject) {
        this.worldObjects.push(obj);
        this.setLayer(obj, World.DEFAULT_LAYER);
    }

    handleCollisions() {
        for (let collision of this.collisionOrder) {
            let move = _.isArray(collision.move) ? collision.move : [collision.move];
            let from = _.isArray(collision.from) ? collision.from : [collision.from];
            let fromObjects = <PhysicsWorldObject[]>_.flatten(from.map(name => this.physicsGroups[name].worldObjects));
            for (let moveGroup of move) {
                let group = this.physicsGroups[moveGroup].worldObjects;
                for (let obj of group) {
                    Physics.collide(obj, fromObjects, {
                        transferMomentum: collision.transferMomentum,
                    });
                }
            }
        }
    }

    removeFromAllLayers(obj: WorldObject) {
        for (let layer of this.layers) {
            A.removeAll(layer.worldObjects, obj);
        }
    }

    removeFromAllPhysicsGroups(obj: WorldObject) {
        for (let name in this.physicsGroups) {
            A.removeAll(this.physicsGroups[name].worldObjects, obj);
        }
    }

    removeWorldObject(obj: WorldObject) {
        this.removeFromAllLayers(obj);
        this.removeFromAllPhysicsGroups(obj);
        A.removeAll(this.worldObjects, obj);
    }

    get renderingDirectly() {
        return !this.renderTexture;
    }

    setLayer(obj: WorldObject, name: string = World.DEFAULT_LAYER) {
        this.removeFromAllLayers(obj);

        for (let layer of this.layers) {
            if (layer.name === name) {
                layer.worldObjects.push(obj);
                return;
            }
        }

        debug(`Layer '${name}' does not exist in the world.`);
    }

    setPhysicsGroup(obj: PhysicsWorldObject, name: string) {
        this.removeFromAllPhysicsGroups(obj);

        let physicsGroup = this.physicsGroups[name];
        if (!physicsGroup) {
            debug(`PhysicsGroup '${name}' does not exist in the world.`);
            return;
        }

        physicsGroup.worldObjects.push(obj);
    }

    private createLayers(layers: World.LayerConfig[]) {
        if (_.isEmpty(layers)) layers = [];

        layers.push({ name: World.DEFAULT_LAYER });

        let result: World.Layer[] = [];
        for (let layer of layers) {
            _.defaults(layer, {
                reverseSort: false,
            });
            result.push(new World.Layer(layer.name, layer));
        }

        return result;
    }

    private createPhysicsGroups(physicsGroups: Dict<World.PhysicsGroupConfig>) {
        if (_.isEmpty(physicsGroups)) return {};

        let result: Dict<World.PhysicsGroup> = {};
        for (let name in physicsGroups) {
            _.defaults(physicsGroups[name], {
                collidesWith: [],
            });
            result[name] = new World.PhysicsGroup(name, physicsGroups[name]);
        }
        return result;
    }

    static DEFAULT_LAYER: string = 'default';
}

namespace World {
    export class Layer {
        name: string;
        worldObjects: WorldObject[];
        sortKey: string;
        reverseSort: boolean;

        constructor(name: string, config: World.LayerConfig) {
            this.name = name;
            this.worldObjects = [];
            this.sortKey = config.sortKey;
            this.reverseSort = config.reverseSort;
        }

        sort() {
            if (!this.sortKey) return;
            let r = this.reverseSort ? -1 : 1;
            this.worldObjects.sort((a, b) => r*(a[this.sortKey] - b[this.sortKey]));
        }
    }

    export class PhysicsGroup {
        name: string;
        worldObjects: PhysicsWorldObject[];

        constructor(name: string, config: World.PhysicsGroupConfig) {
            this.name = name;
            this.worldObjects = [];
        }
    }
}