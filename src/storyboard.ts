function getStoryboard(): Storyboard { return {
    'start': {
        type: 'start',
        transitions: [{ type: 'onStage', stage: 'game', toNode: 'walk_to_throne' }]
    },
    'walk_to_throne': {
        type: 'gameplay',
        transitions: [{ type: 'onCondition', condition: () => {
            return global.world.select.type(Player).y < 478;
        }, toNode: 'intro' }]
    },
    'intro': {
        type: 'cutscene',
        script: function*() {
            yield S.wait(0.5);

            global.world.camera.setModeFocus(384, 292);
            global.world.camera.setMovementSmooth(4);

            yield S.wait(2);

            yield S.dialog("Welcome, Knight. I have been awaiting you.");
            yield S.dialog("You seek to prove thyself worthy of carrying the [y]ultimate weapon[/y]?");
            yield S.dialog("Verily well. Test your strength in mortal combat!");

            global.world.camera.setModeFollow('player');

            yield S.wait(2);

            let player = global.world.select.type(Player);
            let hoop = global.world.addWorldObject(new Hoop(), {
                name: 'hoop',
                layer: 'hoop',
                physicsGroup: 'hoop'
            });
            hoop.x = player.x;
            hoop.y = player.y - 32;
            hoop.effects.updateFromConfig({
                silhouette: { color: 0x00FFFF, alpha: 0 }
            });

            let whoosh = global.world.playSound('swing');
            whoosh.speed = 0.1;

            yield S.doOverTime(1, t => hoop.effects.silhouette.alpha = t);

            yield S.wait(1);

            yield S.doOverTime(1, t => {
                hoop.effects.silhouette.amount = 1-t;
                hoop.y = M.lerp(player.y - 32, player.y - 4, t);
            });

            global.world.playSound('walk').volume = 2;

            yield S.wait(2);

            global.world.playSound('jingle');

            yield S.simul(
                S.showSlide(() => {
                    let slide = new Slide({
                        texture: Texture.filledRect(global.gameWidth, global.gameHeight, 0x000000, 0.8),
                        timeToLoad: 2,
                        fadeIn: true
                    });
                    return slide;
                }),
                S.showSlide(() => {
                    let slide = new Slide({
                        texture: 'royalhulatext',
                        timeToLoad: 2,
                        fadeIn: true
                    });
                    return slide;
                }),
            );

            let text = global.theater.addWorldObject(new SpriteText(Assets.fonts.DELUXE16, "sounds like a lot of HOOPLAH to me"));
            text.setStyle({ alpha: 0 });
            text.x = global.gameWidth/2 - text.getTextWidth()/2;
            text.y = global.gameHeight/2 + 60;

            yield S.wait(2);
            yield S.doOverTime(2, t => text.style.alpha = t);

            while (!Input.justDown('game_advanceDialog')) yield;

            yield S.simul(
                S.fadeSlides(1),
                S.doOverTime(1, t => text.style.alpha = 1-t),
            );

            text.removeFromWorld();

            Debug.SKIP_RATE = 1;
        },
        transitions: [{ type: 'instant', toNode: 'spawn_wave_1' }]
    },
    'gameplay': {
        type: 'gameplay',
        transitions: [
            { type: 'onCondition', condition: () => global.world.select.type(WaveController).isWaveDefeated(1), toNode: 'spawn_wave_2' },
            { type: 'onCondition', condition: () => global.world.select.type(WaveController).isWaveDefeated(2), toNode: 'spawn_wave_3' },
            { type: 'onCondition', condition: () => global.world.select.type(WaveController).isWaveDefeated(3), toNode: 'spawn_wave_4' },
            { type: 'onCondition', condition: () => global.world.select.type(WaveController).isWaveDefeated(4), toNode: 'spawn_wave_5' },
            { type: 'onCondition', condition: () => global.world.select.type(WaveController).isWaveDefeated(5), toNode: 'spawn_wave_king' },
            { type: 'onCondition', condition: () => global.world.select.type(WaveController).isWaveDefeated(9001), toNode: 'win' },
            { type: 'onCondition', condition: () => global.world.select.type(Player).health <= 0, toNode: 'defeat' },
        ]
    },
    'spawn_wave_1': {
        type: 'cutscene',
        script: function*() {
            global.world.camera.setModeFocus(384, 292);

            yield S.wait(2);

            yield S.dialog("Duel'st in five rounds against my minions, and you may'st keep the [y]royal hula[/y].");
            yield S.dialog("Round one beginneth now.");

            yield S.wait(0.5);
            global.world.camera.setModeFollow('player');
            yield S.wait(1);

            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());

            global.world.select.type(WaveController).spawnWave1();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ type: 'instant', toNode: 'gameplay' }]
    },
    'spawn_wave_2': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).stopMusic();
            yield S.wait(1);

            if (!HARD_DIFFICULTY) global.world.select.type(Player).health = Player.MAX_HP;
            global.world.camera.setModeFocus(384, 292);

            yield S.wait(2);

            yield S.dialog("Very good. But this is'st only the beginning.");
            yield S.dialog("Round two beginneth now.");

            yield S.wait(0.5);
            global.world.camera.setModeFollow('player');
            yield S.wait(1);

            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());

            global.world.select.type(WaveController).spawnWave2();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ type: 'instant', toNode: 'gameplay' }]
    },
    'spawn_wave_3': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).stopMusic();
            yield S.wait(1);

            if (!HARD_DIFFICULTY) global.world.select.type(Player).health = Player.MAX_HP;
            global.world.camera.setModeFocus(384, 292);

            yield S.wait(2);

            yield S.dialog("I see you are'st very skilled with a hoop. But can thou handle these foes?");
            yield S.dialog("Round three beginneth now.");

            yield S.wait(0.5);
            global.world.camera.setModeFollow('player');
            yield S.wait(1);

            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());

            global.world.select.type(WaveController).spawnWave3();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ type: 'instant', toNode: 'gameplay' }]
    },
    'spawn_wave_4': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).stopMusic();
            yield S.wait(1);

            if (!HARD_DIFFICULTY) global.world.select.type(Player).health = Player.MAX_HP;
            global.world.camera.setModeFocus(384, 292);

            yield S.wait(2);

            yield S.dialog("Perhaps I'm going too easy on you.");
            yield S.dialog("Prepare thyself for round four.");

            yield S.wait(0.5);
            global.world.camera.setModeFollow('player');
            yield S.wait(1);

            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());

            global.world.select.type(WaveController).spawnWave4();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ type: 'instant', toNode: 'gameplay' }]
    },
    'spawn_wave_5': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).stopMusic();
            yield S.wait(1);

            if (!HARD_DIFFICULTY) global.world.select.type(Player).health = Player.MAX_HP;
            global.world.camera.setModeFocus(384, 292);

            yield S.wait(2);

            yield S.dialog("Impressive! One more round to go'eth, but this will be the hardest.");

            yield S.wait(0.5);
            global.world.camera.setModeFollow('player');
            yield S.wait(1);

            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());

            global.world.select.type(WaveController).spawnWave5();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ type: 'instant', toNode: 'gameplay' }]
    },
    'spawn_wave_king': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).stopMusic();
            yield S.wait(1);

            if (!HARD_DIFFICULTY) global.world.select.type(Player).health = Player.MAX_HP;

            let throne = global.world.select.type(Throne);

            global.world.camera.setModeFollow(throne, 0, -20);
            global.world.camera.setMovementSmooth(4);

            yield S.wait(2);

            yield S.dialog("Splendid!");
            yield S.dialog("Thou hast defeated all of mine challenges. I bet you're happy to finally claim the [y]royal hula[/y] for thyself?");
            yield S.dialog("...");
            yield S.dialog("But I don't think I'll be parting with it so soon.");
            yield S.dialog("If thou want'st it so bad... Heh heh heh...");

            yield S.wait(0.5);

            let shakeSound = global.world.playSound('shake');
            shakeSound.loop = true;

            yield S.simul(
                S.shake(2, 7),
                S.chain(
                    S.wait(3),
                    S.call(() => {
                        throne.setState('jump');
                    }),
                ),
            );

            shakeSound.paused = true;

            yield S.wait(2);
            yield S.dialog("Prove thyself worthy!");

            global.world.camera.setModeFollow('player');
            yield S.wait(1);
            global.world.camera.setMovement(BASE_CAMERA_MOVEMENT());
            throne.setState('idle');

            global.world.runScript(S.chain(
                S.wait(0.5),
                S.showSlide(() => {
                    let slide = new Slide({
                        texture: 'hoopkingtext',
                        timeToLoad: 2,
                        fadeIn: true
                    });
                    return slide;
                }),
                S.wait(3),
                S.fadeSlides(2),
            ));

            global.world.select.type(WaveController).spawnWaveKing();
            global.world.select.type(WaveController).startMusic();
        },
        transitions: [{ type: 'instant', toNode: 'gameplay' }]
    },
    'win': {
        type: 'cutscene',
        script: function*() {
            global.world.select.type(WaveController).stopMusic();
            let throne = global.world.select.type(Throne);

            global.world.camera.setModeFollow(throne, 0, -20);
            global.world.camera.setMovementSmooth(4);

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
                S.doOverTime(3, t => global.world.volume = 1-t),
            );
            yield S.wait(1);

            let text = global.theater.addWorldObject(new SpriteText(Assets.fonts.DELUXE16, "and thus begins the tale of the..."));
            text.setStyle({ color: 0x000000, alpha: 0 });
            text.x = global.gameWidth/2 - text.getTextWidth()/2;
            text.y = global.gameHeight/2 - 8;
            text.ignoreCamera = true;

            yield S.doOverTime(3, t => text.style.alpha = t);
            yield S.wait(2);

            let text2 = global.theater.addWorldObject(new SpriteText(Assets.fonts.DELUXE16, "HOOP KNIGHT"));
            text2.setStyle({ color: 0x000000, alpha: 0 });
            text2.x = global.gameWidth/2 - text2.getTextWidth()/2;
            text2.y = global.gameHeight/2 + 8;
            text2.ignoreCamera = true;

            yield S.doOverTime(3, t => text2.style.alpha = t);
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
            throne.setState('passive');

            yield S.doOverTime(3, t => global.world.volume = 1-t);

            global.world.camera.setModeFollow(throne, 0, -20);
            global.world.camera.setMovementSmooth(4);

            yield S.wait(3);

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