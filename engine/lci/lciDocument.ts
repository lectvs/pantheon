namespace Lci {
    export type Document = {
        width: number;
        height: number;
        layers: Layer[];
    }

    export type Layer = {
        name: string;
        image: string;
        opacity: number;
        visible: boolean;
        blendMode: number;
        position: Pt;
        isDataLayer: boolean;
        properties: LayerProperties;
    }

    export type LayerProperties = {
        layer: string;
        anchor: Pt;
        offset: Pt;
        physicsGroup: string;
        bounds: Rect;
        placeholder: string;
        multiBounds: Rect[];
        data: Dict<string>;
    }

    const HEADER = '.LCI';

    export function parseDocument(lciString: string): Document | undefined {
        if (!lciString.startsWith(HEADER)) {
            console.error('Error loading LCI: bad header', lciString);
            return undefined;
        }
        let lciJson = lciString.substr(HEADER.length);
        return JSON.parse(lciJson);
    }

    export function getLayerTextureKey(documentKey: string, layerName: string) {
        return `${documentKey}/${layerName}`;
    }
}

function lciDocumentToWorldObjects(key: string, originX: number = 0, originY: number = 0) {
    let lciDocument = AssetCache.getLciDocument(key);
    if (!lciDocument) return [];

    let worldObjects: WorldObject[] = [];

    for (let layer of lciDocument.layers) {
        let worldLayer = St.isBlank(layer.properties.layer) ? undefined : layer.properties.layer;
        let physicsGroup = St.isBlank(layer.properties.physicsGroup) ? undefined : layer.properties.physicsGroup;
        let bounds = layer.properties.bounds;

        let worldObjectsToAdd: WorldObject[] = [];
        if (!St.isBlank(layer.properties.placeholder)) {
            let constructor = O.getPath(window, layer.properties.placeholder) as new (x: number, y: number) => WorldObject;  // Get the placeholder class from global scope
            if (!constructor || !constructor.prototype || !constructor.prototype.constructor.name) {
                console.error(`LCI placeholder '${layer.properties.placeholder}' does not exist.`);
                continue;
            }
            try {
                let worldObject = new constructor(layer.position.x, layer.position.y);
                worldObject.name = layer.name;
                worldObjectsToAdd.push(worldObject);
            } catch (err) {
                console.error(`Cannot instantiate LCI placeholder '${layer.properties.placeholder}':`, err);
                continue;
            }
        } else if (!A.isEmpty(layer.properties.multiBounds)) {
            for (let rect of layer.properties.multiBounds) {
                let bounds = new PhysicsWorldObject({
                    x: rect.x, y: rect.y,
                    physicsGroup: physicsGroup,
                    bounds: new RectBounds(0, 0, rect.width, rect.height),
                    immovable: true,
                });
                worldObjectsToAdd.push(bounds);
            }
        } else if (layer.isDataLayer) {
            // Data layers include placeholder and multiBounds
            continue;
        } else {
            worldObjectsToAdd.push(new Sprite({
                name: layer.name,
                x: layer.position.x,
                y: layer.position.y,
                texture: Lci.getLayerTextureKey(key, layer.name),
                offsetX: layer.properties.offset?.x ?? 0,
                offsetY: layer.properties.offset?.y ?? 0,
                blendMode: layer.blendMode ?? 0,
                alpha: layer.opacity/255,
                layer: worldLayer,
                physicsGroup: physicsGroup,
                bounds: bounds ? new RectBounds(bounds.x, bounds.y, bounds.width, bounds.height) : undefined,
                immovable: true,
            }));
        }

        for (let worldObject of worldObjectsToAdd) {
            for (let d in layer.properties.data) {
                worldObject.data[d] = layer.properties.data[d];
            }
        }

        worldObjects.pushAll(worldObjectsToAdd);
    }

    return G.shiftPts(worldObjects, -originX, -originY);
}