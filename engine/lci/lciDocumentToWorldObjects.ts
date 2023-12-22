function lciDocumentToWorldObjects(key: string, originX: number = 0, originY: number = 0) {
    let lciDocument = AssetCache.getLciDocument(key);
    if (!lciDocument) return [];

    let worldObjects: WorldObject[] = [];

    for (let layer of lciDocument.layers) {
        let worldLayer = St.isBlank(layer.properties.layer) ? undefined : layer.properties.layer;
        let physicsGroup = St.isBlank(layer.properties.physicsGroup) ? undefined : layer.properties.physicsGroup;
        let bounds = layer.properties.bounds;

        if (!St.isBlank(layer.properties.placeholder)) {
            let constructor: new (x: number, y: number) => WorldObject = (window as any)[layer.properties.placeholder];  // Get the placeholder class from global scope
            if (!constructor || !constructor.prototype || !constructor.prototype.constructor.name) {
                console.error(`LCI placeholder '${layer.properties.placeholder}' does not exist.`);
                continue;
            }
            let worldObject: WorldObject;
            try {
                worldObject = new constructor(layer.position.x, layer.position.y);
                worldObject.name = layer.name;
            } catch (err) {
                console.error(`Cannot instantiate LCI placeholder '${layer.properties.placeholder}':`, err);
                continue;
            }
            worldObjects.push(worldObject);
            continue;
        }

        if (!A.isEmpty(layer.properties.multiBounds)) {
            for (let rect of layer.properties.multiBounds) {
                let bounds = new PhysicsWorldObject({
                    x: rect.x, y: rect.y,
                    physicsGroup: physicsGroup,
                    bounds: new RectBounds(0, 0, rect.width, rect.height),
                    immovable: true,
                });
                worldObjects.push(bounds);
            }
        }

        if (layer.isDataLayer) continue;
        
        let sprite = new Sprite({
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
        });

        worldObjects.push(sprite);
    }

    return G.shiftPts(worldObjects, -originX, -originY);
}