type Light = {
    x: number;
    y: number;
    radius: number;
    buffer: number;
}

class FirelitWorld extends World {
    torchFireSprite: Sprite;
    torchFuel: number;
    torchRefuelDistance = 16;
    torchFuelEmptyThreshold = 0.1;

    constructor(config: World.Config) {
        super(config);

        this.torchFireSprite = WorldObject.fromConfig({
            parent: fireSpriteConfig(),
            layer: 'main'
        });
        this.torchFuel = 0;

        this.runScript(S.call(() => {
            // Load torch in a script to delay one frame... :(
            let trees = this.getWorldObjectsByType<Tree>(Tree);
            trees[6].spawnsTorch = true;
        }));

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

    update(delta: number) {
        super.update(delta);

        let campfire = this.getWorldObjectByName<Campfire>('campfire');
        let torch = <Sprite>this.worldObjectsByName['torch'];
        let lightingManager = this.getWorldObjectByName<LightingManager>('lightingManager');
        let player = this.getWorldObjectByName<Player>('player');

        if (torch) {
            let oldTorchFuel = this.torchFuel;
            this.torchFuel -= 0.03*delta;
            if (M.distance(campfire.x, campfire.y, torch.x, torch.y) < this.torchRefuelDistance) {
                this.torchFuel += 1*delta;
            }
            this.torchFuel = M.clamp(this.torchFuel, 0, 1);

            

            let torchScale = this.torchFuel;
            this.torchFireSprite.scaleX = 0.7*torchScale;
            this.torchFireSprite.scaleY = 0.7*torchScale;
            this.torchFireSprite.offset.x = torch.offset.x;
            this.torchFireSprite.offset.y = torch.offset.y - 4;

            if (this.torchFuel <= this.torchFuelEmptyThreshold && oldTorchFuel > this.torchFuelEmptyThreshold) {
                this.torchFuel = 0;
                let smoke = WorldObject.fromConfig<Sprite>(<Sprite.Config>{
                    constructor: Sprite,
                    x: 0, y: 0,
                    texture: 'smoke',
                    scaleX: 0.5, scaleY: 0.5,
                    layer: 'above',
                });
                World.Actions.addChildToParent(smoke, this.torchFireSprite);
                this.world.runScript(S.doOverTime(2, t => {
                    smoke.offset.x = this.torchFireSprite.offset.x + 2 * Math.exp(-t) * Math.sin(4*Math.PI*t);
                    smoke.offset.y = this.torchFireSprite.offset.y + -16 * t;
                    smoke.alpha = 1-t;
                }));
            }
        }
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