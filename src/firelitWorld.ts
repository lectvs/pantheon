
class FirelitWorld extends World {

    constructor(config: World.Config) {
        super(config);

        // Spawn monster after 60 seconds
        this.runScript(S.chain(
            S.wait(Debug.DEBUG ? 3 : 60),
            S.call(() => {
                let player = this.getWorldObjectByName('player');
                let monster = WorldObject.fromConfig({
                    name: 'monster',
                    constructor: Monster,
                    x: player.x + 200, y: player.y + 200,
                    layer: 'main',
                });
                World.Actions.addWorldObjectToWorld(monster, this);
            })
        ));
    }

    renderLayer(layer: World.Layer, layerTexture: Texture, screen: Texture) {
        let lightingManager = this.getWorldObjectByName<LightingManager>('lightingManager');
        layerTexture.clear();
        layer.sort();
        for (let worldObject of layer.worldObjects) {
            if (worldObject.visible) {
                worldObject.fullRender(layerTexture);
            }
        }

        let filters = [];
        if (layer.name === 'bg' || layer.name === 'main' || layer.name === 'fg') {
            filters.push(lightingManager.firelightFilter);
        }

        screen.render(layerTexture, {
            filters: filters
        });
    }

}