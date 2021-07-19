const stages: Dict<Factory<World>> = {

    'game': () => {
        let world = new World({
            backgroundColor: 0x62ADBB,
            camera: {
                movement: Camera.Movement.SNAP()
            },
            layers: [
                { name: 'bg' },
                { name: 'doors' },
                { name: 'walls', effects: { post: { filters : [new WallFilter(), new JaggyRemoverFilter()] }}},
                { name: 'main' },
                { name: 'items' },
                { name: 'pressx' },
                { name: 'player' },
                { name: 'fg' },
            ],
            physicsGroups: {
                'player': {},
                'npcs': {},
                'walls': {},
            },
            collisions: [
                { move: 'player', from: 'walls' },
                { move: 'npcs', from: 'walls' },
            ],
            collisionIterations: 4,
            // TODO: rethink this? does it actually help?
            useRaycastDisplacementThreshold: Infinity,
            maxDistancePerCollisionStep: 8,
            globalSoundHumanizePercent: 0.1,
        });

        world.addWorldObject(new Tilemap({
            tileset: 'tiles',
            tilemap: 'world',
            layer: 'walls',
            physicsGroup: 'walls',
        }));

        world.addWorldObject(new Sprite({ texture: 'world_bg', layer: 'bg' }));

        // Tutorials
        world.addWorldObject(new Tutorial(600, 292, 0, 0, "Press the arrow keys to move"));
        world.addWorldObject(new Tutorial(1000, 292, 1, 0, "Press Z to jump, hold it to jump higher"));

        // NPCs
        let diggur = world.addWorldObject(new Diggur(2127, 255));
        diggur.addChild(new CutsceneInteractable(0, 0, 'i_diggur_surface')).setBoundsSize(32, 32);
        let scammir = world.addWorldObject(new Scammir(2330, 255));
        scammir.flipX = true;
        scammir.addChild(new CutsceneInteractable(0, 0, 'i_scammir_surface')).setBoundsSize(32, 32);
        let gobbor = world.addWorldObject(new Gobbor(120, 224));
        gobbor.addChild(new CutsceneInteractable(0, 0, 'i_gobbor_surface')).setBoundsSize(32, 32);
        let scammir_tele = world.addWorldObject(new Scammir(3664, 1471));
        scammir_tele.name = "scammir_tele";
        scammir_tele.flipX = true;
        scammir_tele.addChild(new CutsceneInteractable(0, 0, 'i_scammir_tele')).setBoundsSize(32, 32);

        // Doors
        world.addWorldObject(new Door(570, 240, 266, 224));
        world.addWorldObject(new Door(278, 207, 579, 256));

        // Locked Doors
        world.addWorldObject(new LockedDoor(1800, 880, 'reddoor', false));
        world.addWorldObject(new LockedDoor(2538, 1184, 'blackdoor', false));
        world.addWorldObject(new Sprite({ x: 3144, y: 1520, name: 'pitdoor1', texture: 'wooddoor', layer: 'doors', physicsGroup: 'walls', bounds: new RectBounds(-8, -16, 16, 32), immovable: true }));
        world.addWorldObject(new Sprite({ x: 3000, y: 1512, name: 'pitdoor2', texture: 'wooddoor_side', layer: 'doors', physicsGroup: 'walls', bounds: new RectBounds(-24, -8, 48, 16), immovable: true }));
        let movableDoor = world.addWorldObject(new LockedDoor(1800, 880, 'movabledoor', true));
        movableDoor.visible = false;
        movableDoor.physicsGroup = undefined;

        // Levers
        world.addWorldObject(new Lever(3000, 1504, 'lever_pit'));

        // Items
        world.addWorldObject(new Item(2600, 728, 'redkey'));
        world.addWorldObject(new Item(4180, 728, 'redkey'));
        world.addWorldObject(new Item(3412, 1456, 'blackkey'));
        world.addWorldObject(new Item(2183, 1475, 'string'));

        // Signs
        world.addWorldObject(new CutsceneInteractable(644, 244, 'i_mgsign'));
        world.addWorldObject(new CutsceneInteractable(1774, 244, 'i_jdsign'));
        world.addWorldObject(new CutsceneInteractable(1832, 182, 'i_ssign'));
        world.addWorldObject(new CutsceneInteractable(2177, 211, 'i_umsign'));
        world.addWorldObject(new CutsceneInteractable(2460, 243, 'i_hsign'));
        world.addWorldObject(new CutsceneInteractable(2890, 1555, 'i_leversign'));

        // Door Cutscenes
        world.addWorldObject(new CutsceneInteractable(1680, 240, 'i_jdhouse'));
        world.addWorldObject(new CutsceneInteractable(1910, 178, 'i_shouse'));
        world.addWorldObject(new CutsceneInteractable(2550, 240, 'i_hhouse'));
        world.addWorldObject(new CutsceneInteractable(2172, 1215, 'i_loominggate')).setBoundsSize(64, 64);

        // Etc.
        world.addWorldObject(new Sprite({ x: 3744, y: 1408, texture: 'glass', physicsGroup: 'walls', bounds: new RectBounds(0, 0, 16, 64), immovable: true }));
        world.addWorldObject(new CutsceneInteractable(3696, 1456, 'i_telescope')).setBoundsSize(64, 64);
        world.addWorldObject(new CutsceneInteractable(3400, 1172, 'i_grass')).setBoundsSize(64, 64);
        world.addWorldObject(new CrackedWall(3568, 1120));
        world.addWorldObject(new Chest(200, 512));
        world.addWorldObject(new Note(1900, 888)).visible = false;

        // Orbs
        world.addWorldObject(new Orb(2119, 1157, 'orb1_final', 0.45, 'bg'));
        world.addWorldObject(new Orb(2172, 1144, 'orb2_final', 0.45, 'bg'));
        world.addWorldObject(new Orb(2225, 1156, 'orb3_final', 0.45, 'fg')).visible = false;
        world.addWorldObject(new Orb(3808, 1056, 'orb3', 0.5, 'fg'));

        let player = world.addWorldObject(new Player(692, 255));   // Start
        //let player = world.addWorldObject(new Player(2094, 255));  // Pit
        //let player = world.addWorldObject(new Player(2273, 920));  // Start of UM
        //let player = world.addWorldObject(new Player(2374, 1135)); // Orbs
        //let player = world.addWorldObject(new Player(2848, 1567)); // Lever
        //let player = world.addWorldObject(new Player(2480, 1567)); // String
        //let player = world.addWorldObject(new Player(3296, 1183)); GIVE_ITEM('string'); // Grass
        //let player = world.addWorldObject(new Player(290, 524));   // Chest
        
        world.addWorldObject(new PressX(player));
        world.addWorldObject(new CameraController(player));

        return world;
    },
}
