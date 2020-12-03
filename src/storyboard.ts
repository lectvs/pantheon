function addHoop() {
    let player = global.world.select.type(Player);
    return global.world.addWorldObject(new Hoop({
        x: player.x, y: player.y,
        name: 'hoop',
        layer: 'hoop',
        physicsGroup: 'hoop'
    }));
}

function setPlayerMaxHP() {
    if (!HARD_DIFFICULTY) global.world.select.type(Player).health = Player.MAX_HP;
}

function getStoryboard(): Storyboard { return {
    'start': {
        type: 'start',
        transitions: [{ onStage: 'game', toNode: 'walk_to_throne' }]
    },
    'walk_to_throne': {
        type: 'gameplay',
        transitions: [{ toNode: 'intro', condition: () => {
            return global.world.select.type(Player).y < 478;
        } }]
    },
    'intro': {
        type: 'cutscene',
        skippable: true,
        script: function*() {
            yield S.wait(0.5);

            yield S.cameraTransition(2, Camera.Mode.FOLLOW('throne'));

            yield S.dialog("Welcome, Knight. I have been awaiting you.");
            yield S.dialog("You seek to prove thyself worthy of carrying the [y]ultimate weapon[/y]?");
            yield S.dialog("Verily well. Test your strength in mortal combat!");

            yield S.cameraTransition(2, Camera.Mode.FOLLOW('player'));

            let player = global.world.select.type(Player);
            let hoop = addHoop();
            hoop.y -= 32;
            hoop.effects.addSilhouette.color = 0x00FFFF;
            hoop.effects.addSilhouette.alpha = 0;

            let whoosh = global.world.playSound('swing');
            whoosh.speed = 0.1;

            hoop.data.intro = true;
            yield S.tween(1, hoop.effects.silhouette, 'alpha', 0, 1);

            yield S.wait(1);

            yield S.simul(
                S.tween(1, hoop.effects.silhouette, 'amount', 1, 0),
                S.tween(1, hoop, 'y', player.y - 32, player.y - 4),
            );
            hoop.data.intro = false;

            global.world.playSound('walk').volume = 2;

            yield S.wait(2);

            global.world.playSound('jingle');

            yield S.simul(
                S.showSlide(() => new Slide({
                    texture: Texture.filledRect(global.gameWidth, global.gameHeight, 0x000000, 0.8),
                    timeToLoad: 2,
                    fadeIn: true
                })),
                S.showSlide(() => new Slide({
                    texture: 'royalhulatext',
                    timeToLoad: 2,
                    fadeIn: true
                })),
            );

            let text = global.theater.addWorldObject(new SpriteText({
                name: 'hooplahText',
                x: global.gameWidth/2, y: global.gameHeight/2 + 60,
                text: "sounds like a lot of HOOPLAH to me",
                style: { alpha: 0 },
                anchor: Anchor.TOP_CENTER
            }));

            yield S.wait(2);
            yield S.tween(2, text.style, 'alpha', 0, 1);

            while (!Input.justDown(Input.GAME_ADVANCE_CUTSCENE)) yield;

            yield S.simul(
                S.fadeSlides(1),
                S.tween(1, text.style, 'alpha', 1, 0),
            );

            text.removeFromWorld();

            yield S.cameraTransition(1, Camera.Mode.FOLLOW('throne'));
            yield S.wait(1);

            Debug.SKIP_RATE = 1;
        },
        transitions: [{ toNode: 'wave_1' }]
    },
    'gameplay': {
        type: 'gameplay',
        transitions: [
            { condition: () => global.world.select.type(WaveController).isKingWaveDefeated(), toNode: 'win' },
            { condition: () => global.world.select.type(Player).health <= 0, toNode: 'defeat' },
            { condition: () => global.world.select.type(WaveController).isNormalWaveDefeated(), delay: 0.5, toNode: 'post_gameplay' },
        ]
    },
    'post_gameplay': {
        type: 'gameplay',
        transitions: [
            { condition: () => global.world.select.type(Player).health <= 0, toNode: 'defeat' },
            { condition: () => global.world.select.type(WaveController).isNormalWaveDefeated(1), toNode: 'wave_2' },
            { condition: () => global.world.select.type(WaveController).isNormalWaveDefeated(2), toNode: 'wave_3' },
            { condition: () => global.world.select.type(WaveController).isNormalWaveDefeated(3), toNode: 'wave_4' },
            { condition: () => global.world.select.type(WaveController).isNormalWaveDefeated(4), toNode: 'wave_5' },
            { condition: () => global.world.select.type(WaveController).isNormalWaveDefeated(5), toNode: 'wave_king' },
        ]
    },
    'wave_1': {
        type: 'cutscene',
        skippable: true,
        script: function*() {
            yield S.dialog("Duel'st in five rounds against my minions, and you may'st keep the [y]royal hula[/y].");
            yield S.dialog("Round one beginneth now.");

            yield S.wait(0.5);

            yield S.cameraTransition(1, Camera.Mode.FOLLOW('player'), BASE_CAMERA_MOVEMENT);
        },
        transitions: [{ toNode: 'spawn_wave_1' }]
    },
    'spawn_wave_1': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).spawnWave1();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'wave_2': {
        type: 'cutscene',
        skippable: true,
        script: function*() {
            global.world.select.type(WaveController).stopMusic();
            yield S.wait(1);

            setPlayerMaxHP();

            yield S.cameraTransition(1, Camera.Mode.FOLLOW('throne'));
            yield S.wait(1);

            yield S.dialog("Very good. But this is'st only the beginning.");
            yield S.dialog("Round two beginneth now.");

            yield S.wait(0.5);

            yield S.cameraTransition(1, Camera.Mode.FOLLOW('player'), BASE_CAMERA_MOVEMENT);
        },
        transitions: [{ toNode: 'spawn_wave_2' }]
    },
    'spawn_wave_2': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).spawnWave2();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'wave_3': {
        type: 'cutscene',
        skippable: true,
        script: function*() {
            global.world.select.type(WaveController).stopMusic();
            yield S.wait(1);

            setPlayerMaxHP();
            
            yield S.cameraTransition(1, Camera.Mode.FOLLOW('throne'));
            yield S.wait(1);

            yield S.dialog("I see you are'st very skilled with a hoop. But can thou handle these foes?");
            yield S.dialog("Round three beginneth now.");

            yield S.wait(0.5);

            yield S.cameraTransition(1, Camera.Mode.FOLLOW('player'), BASE_CAMERA_MOVEMENT);
        },
        transitions: [{ toNode: 'spawn_wave_3' }]
    },
    'spawn_wave_3': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).spawnWave3();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'wave_4': {
        type: 'cutscene',
        skippable: true,
        script: function*() {
            global.world.select.type(WaveController).stopMusic();
            yield S.wait(1);

            setPlayerMaxHP();
            
            yield S.cameraTransition(1, Camera.Mode.FOLLOW('throne'));
            yield S.wait(1);

            yield S.dialog("Perhaps I'm going too easy on you.");
            yield S.dialog("Prepare thyself for round four.");

            yield S.wait(0.5);

            yield S.cameraTransition(1, Camera.Mode.FOLLOW('player'), BASE_CAMERA_MOVEMENT);
        },
        transitions: [{ toNode: 'spawn_wave_4' }]
    },
    'spawn_wave_4': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).spawnWave4();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'wave_5': {
        type: 'cutscene',
        skippable: true,
        script: function*() {
            global.world.select.type(WaveController).stopMusic();
            yield S.wait(1);

            setPlayerMaxHP();
            
            yield S.cameraTransition(1, Camera.Mode.FOLLOW('throne'));
            yield S.wait(1);

            yield S.dialog("Impressive! One more round to go'eth, but this will be the hardest.");

            yield S.wait(0.5);

            yield S.cameraTransition(1, Camera.Mode.FOLLOW('player'), BASE_CAMERA_MOVEMENT);
        },
        transitions: [{ toNode: 'spawn_wave_5' }]
    },
    'spawn_wave_5': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).spawnWave5();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'wave_king': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).stopMusic();
            yield S.wait(1);

            setPlayerMaxHP();

            yield S.cameraTransition(1, Camera.Mode.FOLLOW('throne'));
            yield S.wait(1);

            yield S.dialog("Splendid!");
            yield S.dialog("Thou hast defeated all of mine challenges. I bet you're happy to finally claim the [y]royal hula[/y] for thyself?");
            yield S.dialog("...");
            yield S.dialog("But I don't think I'll be parting with it so soon.");
            yield S.dialog("If thou want'st it so bad... Heh heh heh...");

            yield S.wait(0.5);
        },
        transitions: [{ toNode: 'spawn_wave_king' }]
    },
    'spawn_wave_king': {
        type: 'cutscene',
        script: function*() {
            let throne = global.world.select.type(Throne);
            let player = global.world.select.type(Player);
            
            let shakeSound = global.world.playSound('shake');
            shakeSound.loop = true;

            yield S.simul(
                S.shake(2, 6),
                S.chain(
                    S.wait(3),
                    S.doOverTime(1.5, t => {
                        if (M.distance(player.x, player.y, 384, 480) > 36) {
                            throne.controller.moveDirection.y = 480 - throne.y;
                        } else {
                            throne.controller.moveDirection.y = 440 - throne.y;
                        }
                        throne.controller.jump = true;
                    }),
                    S.call(() => {
                        throne.layer = 'main';
                        throne.king.layer = 'main';
                        throne.shadow.layer = 'bg';
                    }),
                ),
            );

            shakeSound.paused = true;

            yield S.wait(2);
            yield S.dialog("Prove thyself worthy!");

            yield S.cameraTransition(1, Camera.Mode.FOLLOW('player'));
    
            throne.activate();

            global.world.runScript(S.chain(
                S.wait(0.5),
                S.showSlide(() => new Slide({
                    texture: 'hoopkingtext',
                    timeToLoad: 2,
                    fadeIn: true
                })),
                S.wait(3),
                S.fadeSlides(2),
            ));

            global.world.select.type(WaveController).spawnWaveKing();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'win': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).stopMusic();

            yield S.cameraTransition(1, Camera.Mode.FOLLOW('throne'));
            yield S.wait(1);

            let shakeSound = global.world.playSound('shake');
            shakeSound.loop = true;
            shakeSound.speed = 0.8;

            yield S.wait(3);

            if (global.world.select.type(Player).health > 0) {
                yield S.dialog("Agh... you've done it...");
                yield S.dialog("The hoop... it's yours... take it...");
                yield S.dialog("Don't... bully me... anymore...");
            } else {
                yield S.dialog("But... but how...?");
                yield S.dialog("You're dead too... how...?");
                yield S.dialog("Just... take the hoop then...");
                yield S.dialog("Don't... bully me... anymore...");
            }

            yield S.wait(0.5);

            yield S.simul(
                S.fadeOut(3, 0xFFFFFF),
                S.tween(3, global.world, 'volume', 1, 0),
            );
            yield S.wait(1);

            let text = global.theater.addWorldObject(new SpriteText({
                x: global.gameWidth/2, y: global.gameHeight/2 - 8,
                text: "and thus begins the tale of the...",
                style: { color: 0x000000, alpha: 0 },
                anchor: Anchor.TOP_CENTER
            }));

            yield S.tween(3, text.style, 'alpha', 0, 1);
            yield S.wait(2);

            let text2 = global.theater.addWorldObject(new SpriteText({
                x: global.gameWidth/2, y: global.gameHeight/2 + 8,
                text: "HOOP KNIGHT",
                style: { color: 0x000000, alpha: 0 },
                anchor: Anchor.TOP_CENTER
            }));

            yield S.tween(3, text2.style, 'alpha', 0, 1);
            yield S.wait(5);

            yield S.fadeOut(3);
            yield S.wait(2);

            global.game.loadMainMenu();
        },
        transitions: []
    },
    'defeat': {
        type: 'cutscene',
        script: function*() {
            let throne = global.world.select.type(Throne);
            throne.setState('idle');

            yield S.tween(3, global.world, 'volume', 1, 0);

            yield S.cameraTransition(2, Camera.Mode.FOLLOW('throne'));

            yield S.wait(1);

            yield S.dialog("It seems... thou'st not worthy to bear the [y]ultimate weapon[/y].");
            yield S.dialog("Such a shame...");

            yield S.wait(0.5);
            yield S.fadeOut(3);
            yield S.wait(2);

            global.game.loadMainMenu();
        },
        transitions: []
    },
}}