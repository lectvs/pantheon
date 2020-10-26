function getStages(): Dict<World.Factory> { return {

    'game': () => {
        let world = BASE_STAGE();

        world.camera.setModeFollow('player');
        world.camera.setMovement(BASE_CAMERA_MOVEMENT());

        world.entryPoints['main'] = { x: global.gameWidth/2, y: global.gameHeight/2 };

        world.addWorldObject(new UI());
        world.addWorldObject(new WaveController());
        world.addWorldObject(WORLD_BOUNDS(0, 192, 768, 768));

        let floor = world.addWorldObject(new Sprite());
        floor.setTexture(AssetCache.getTexture('floor').clone());
        World.Actions.setName(floor, 'floor');
        World.Actions.setLayer(floor, 'bg');

        let lights = world.addWorldObject(new Sprite());
        lights.setTexture('lights');
        World.Actions.setName(lights, 'lights');
        World.Actions.setLayer(lights, 'fg');

        let stairs = world.addWorldObject(new Sprite());
        stairs.x = 384;
        stairs.y = 340;
        stairs.setTexture('stairs');
        stairs.bounds = new RectBounds(-78, -112, 156, 112, stairs);
        World.Actions.setName(stairs, 'stairs');
        World.Actions.setLayer(stairs, 'main');
        World.Actions.setPhysicsGroup(stairs, 'walls');

        let throne = world.addWorldObject(new Throne());
        throne.x = 384;
        throne.y = 268;
        throne.colliding = false;
        World.Actions.setName(throne, 'throne');
        World.Actions.setLayer(throne, 'king_start');
        World.Actions.setPhysicsGroup(throne, 'enemies');

        let guard1 = world.addWorldObject(new Sprite());
        guard1.x = 342;
        guard1.y = 352;
        guard1.setTexture('enemyknight_0');
        guard1.tint = 0xFFFF00;
        guard1.effects.updateFromConfig({
            outline: { color: 0x000000 }
        });
        guard1.addAnimation(Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight_', textures: [0, 1, 2], frameRate: 8, count: -1 }));
        guard1.playAnimation('idle');
        World.Actions.setName(guard1, 'guard');

        let guard2 = world.addWorldObject(new Sprite());
        guard2.x = 428;
        guard2.y = 352;
        guard2.setTexture('enemyknight_0');
        guard2.flipX = true;
        guard2.tint = 0xFF00FF;
        guard2.effects.updateFromConfig({
            outline: { color: 0x000000 }
        });
        guard2.addAnimation(Animations.fromTextureList({ name: 'idle', texturePrefix: 'enemyknight_', textures: [0, 1, 2], frameRate: 8, count: -1 }));
        guard2.playAnimation('idle');
        World.Actions.setName(guard2, 'guard');

        let player = world.addWorldObject(new Player());
        player.x = 384;
        player.y = 750;
        player.controllable = true;
        World.Actions.setName(player, 'player');
        World.Actions.setLayer(player, 'main');
        World.Actions.setPhysicsGroup(player, 'player');

        return world;
    },
}}