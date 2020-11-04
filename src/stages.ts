function getStages(): Dict<World.Factory> { return {

    'game': () => {
        let world = BASE_STAGE();

        world.camera.setModeFollow('player');
        world.camera.setMovement(BASE_CAMERA_MOVEMENT());

        world.entryPoints['main'] = { x: global.gameWidth/2, y: global.gameHeight/2 };

        world.addWorldObject(new UI());
        world.addWorldObject(new WaveController());
        world.addWorldObject(WORLD_BOUNDS(0, 192, 768, 768));

        world.addWorldObject(new Sprite(AssetCache.getTexture('floor').clone()), {
            name: 'floor',
            layer: 'bg'
        });

        world.addWorldObject(new Sprite('lights'), {
            name: 'lights',
            layer: 'fg'
        });

        let stairs = world.addWorldObject(new Sprite('stairs'), {
            x: 384, y: 340,
            name: 'stairs',
            layer: 'main',
            physicsGroup: 'walls'
        });
        stairs.bounds = new RectBounds(-78, -112, 156, 112);

        let throne = world.addWorldObject(new Throne(), {
            x: 384, y: 268,
            name: 'throne',
            layer: 'king_start',
            physicsGroup: 'enemies'
        });
        throne.colliding = false;

        let guard1 = world.addWorldObject(new Sprite('enemyknight_0'), {
            x: 342, y: 352,
            name: 'guard'
        });
        guard1.tint = 0xFFFF00;
        guard1.effects.updateFromConfig({
            outline: { color: 0x000000 }
        });
        guard1.addAnimation(Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight_', textures: [0, 1, 2], frameRate: 8, count: -1 }));
        guard1.playAnimation('idle');

        let guard2 = world.addWorldObject(new Sprite('enemyknight_0'), {
            x: 428, y: 352,
            name: 'guard'
        });
        guard2.flipX = true;
        guard2.tint = 0xFF00FF;
        guard2.effects.updateFromConfig({
            outline: { color: 0x000000 }
        });
        guard2.addAnimation(Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight_', textures: [0, 1, 2], frameRate: 8, count: -1 }));
        guard2.playAnimation('idle');

        let player = world.addWorldObject(new Player(), {
            x: 384, y: 750,
            name: 'player',
            layer: 'main',
            physicsGroup: 'player'
        });
        player.controllable = true;

        return world;
    },
}}