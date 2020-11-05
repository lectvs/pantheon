function getStages(): Dict<World.Factory> { return {

    'game': () => {
        let world = BASE_STAGE();

        world.camera.setModeFollow('player');
        world.camera.setMovement(BASE_CAMERA_MOVEMENT());

        world.entryPoints['main'] = { x: global.gameWidth/2, y: global.gameHeight/2 };

        world.addWorldObject(new UI());
        world.addWorldObject(new WaveController());
        world.addWorldObject(WORLD_BOUNDS(0, 192, 768, 768, 'walls'));

        world.addWorldObject(new Sprite({
            name: 'floor',
            texture: AssetCache.getTexture('floor').clone(),
            layer: 'bg'
        }));

        world.addWorldObject(new Sprite({
            name: 'lights',
            texture: 'lights',
            layer: 'fg'
        }));

        world.addWorldObject(new Sprite({
            x: 384, y: 340,
            name: 'stairs',
            texture: 'stairs',
            layer: 'main',
            bounds: new RectBounds(-78, -112, 156, 112),
            physicsGroup: 'walls'
        }));

        world.addWorldObject(new Throne({
            x: 384, y: 268,
            name: 'throne',
            layer: 'king_start',
            physicsGroup: 'enemies',
            colliding: false
        }));

        world.addWorldObject(new Sprite({
            x: 342, y: 352,
            name: 'guard',
            texture: 'enemyknight_0',
            tint: 0xFFFF00,
            effects: { outline: { color: 0x000000 } },
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight', textures: [0, 1, 2], frameRate: 8, count: -1 })
            ],
            defaultAnimation: 'idle',
        }));

        world.addWorldObject(new Sprite({
            x: 428, y: 352,
            name: 'guard',
            texture: 'enemyknight_0',
            tint: 0xFF00FF,
            flipX: true,
            effects: { outline: { color: 0x000000 } },
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight', textures: [0, 1, 2], frameRate: 8, count: -1 })
            ],
            defaultAnimation: 'idle',
        }));

        world.addWorldObject(new Player({
            x: 384, y: 750,
            name: 'player',
            layer: 'main',
            physicsGroup: 'player',
            controllable: true
        }));

        return world;
    },
}}