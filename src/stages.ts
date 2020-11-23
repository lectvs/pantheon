
const BASE_CAMERA_MOVEMENT = Camera.Movement.SMOOTH(10, 40, 30);

function getStages(): Dict<World.Factory> { return {

    'game': () => {
        let world = new World({
            backgroundColor: 0x000000,
            entryPoints: { 'main': { x: 0, y: 0 } },
            layers: [
                { name: 'bg' },
                { name: 'hoop' },
                { name: 'main', sortKey: obj => obj.y },
                { name: 'king_shadow_start' },
                { name: 'king_start' },
                { name: 'fg' },
            ],
            physicsGroups: {
                'player': {},
                'hoop': {},
                'enemies': {},
                'bombs': {},
                'bullets': {},
                'deadbodies': {},
                'walls': { immovable: true },
            },
            collisions: [
                { move: 'player', from: 'enemies' },
                { move: 'player', from: 'bullets' },
                { move: 'player', from: 'walls' },
                { move: 'enemies', from: 'walls' },
                { move: 'bullets', from: 'walls' },
                { move: 'bombs', from: 'walls' },
                { move: 'bombs', from: 'enemies' },
                { move: 'hoop', from: 'enemies', momentumTransfer: 'elastic', callback: (hoop: Hoop, enemy: Enemy) => {
                    if (enemy.damagableByHoop && !enemy.immune && hoop.isStrongEnoughToDealDamage()) {
                        enemy.damage(hoop.currentAttackStrength);
                    }
                }},
                { move: 'hoop', from: 'bombs', momentumTransfer: 'elastic', callback: (hoop: Hoop, bomb: Bomb) => {
                    if (hoop.isStrongEnoughToDealDamage()) {
                        global.world.playSound('hitenemy');
                    }
                } },
                { move: 'deadbodies', from:'walls' },
            ],
            collisionIterations: 4,
            useRaycastDisplacementThreshold: 4,
        })

        world.addWorldObject(new UI());
        world.addWorldObject(new WaveController());
        world.addWorldObject(new PhysicsWorldObject({
            bounds: new InvertedRectBounds(0, 192, 768, 576),
            physicsGroup: 'walls'
        }));

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

        world.camera.setModeFollow('player');
        world.camera.setMovement(BASE_CAMERA_MOVEMENT);
        world.camera.initPosition();

        return world;
    },
}}