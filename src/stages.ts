
const BASE_CAMERA_MOVEMENT = Camera.Movement.SMOOTH(10, 40, 30);

function getStages(): Dict<World.Factory> { return {

    'game': () => {
        let world = new World({
            backgroundColor: 0xFFFFFF,
            entryPoints: { 'main': { x: 0, y: 0 } },
            layers: [
                { name: 'bg' },
                { name: 'main', sortKey: obj => obj.y },
                { name: 'fg' },
            ],
            physicsGroups: {
                'player': {},
                'walls': { immovable: true },
                'bullets': {},
                'paintdrops': {},
            },
            collisions: [
                { move: 'player', from: 'walls' },
                { move: 'bullets', from: 'walls' },
                { move: 'paintdrops', from: 'walls' },
            ],
            collisionIterations: 4,
            useRaycastDisplacementThreshold: 4,
        });

        world.addWorldObject(new Player({
            name: 'player',
            x: 240, y: 480,
            layer: 'main',
            bounds: new RectBounds(-4, -8, 8, 8),
            physicsGroup: 'player',
        }));

        let tilemap = AssetCache.getTilemap('world');
        let binaryTiles = A.map2D(tilemap.layers[0], tile => tile.index);
        let wallsTilemap = world.addWorldObject(new Tilemap({
            name: 'walls',
            x: 0, y: -16,
            layer: 'main',
            ...ConvertTilemap.convert(binaryTiles, Assets.tilesets.base),
        }));

        let collisionTilemap = world.addWorldObject(new Tilemap({
            name: 'walls_collision',
            x: 0, y: 0,
            physicsGroup: 'walls',
            tilemap: 'world',
            collisionOnly: true
        }));

        let wallMask = new BasicTexture(wallsTilemap.width, wallsTilemap.height);
        let roughTilemap = ConvertTilemap.getRoughTilemap(binaryTiles);
        for (let y = 0; y < roughTilemap.length; y++) {
            for (let x = 0; x < roughTilemap[y].length; x++) {
                if (roughTilemap[y][x] === 1) {
                    Draw.brush.color = 0xFFFFFF;
                    Draw.brush.alpha = 1;
                    Draw.rectangleSolid(wallMask, x*16, y*16 - 2, 16, 18);
                }
            }
        }

        for (let box of collisionTilemap.collisionBoxes) {
            box.addModule(new DecalModule({
                texture: wallMask,
                type: 'world',
                offsetx: 0,
                offsety: -16,
            }));
        }

        world.addWorldObject(new Sprite({
            name: 'floor_decal',
            x: collisionTilemap.x, y: collisionTilemap.y,
            texture: new BasicTexture(collisionTilemap.width, collisionTilemap.height),
            layer: 'bg',
        }));

        world.camera.setModeFollow('player', 0, -4);
        world.camera.setMovement(BASE_CAMERA_MOVEMENT);
        world.camera.snapPosition();

        return world;
    },
}}