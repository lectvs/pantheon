function isOnSector(x: number, y: number) {
    let cc = global.world.select.type(CameraController);
    if (!cc) return false;
    return cc.sector.x === x && cc.sector.y === y;
}

var isResult: ISResult = {};
var scammirDoorInteractions = 0;
var hasFallen = false;

const storyboard: Storyboard = {
    'start': {
        type: 'start',
        transitions: [{ onStage: 'game', toNode: 'gameplay' }]
    },
    'gameplay': {
        type: 'gameplay',
        transitions: []
    },
    'intro_undermine': {
        type: 'cutscene',
        script: function*() {
            let player = global.world.select.type(Player);
            yield S.waitUntil(() => player.isGrounded(['walls']));
            global.world.playSound('crush');
            global.theater.runScript(S.shake(4, 0.5));

            let waitTime = hasFallen ? 3 : 2;
            yield S.wait(waitTime);

            let THE = global.theater.addWorldObject(new Sprite({
                x: global.gameWidth/2,
                y: global.gameHeight/2 - 40,
                texture: 'THE',
                alpha: 0,
            }));

            let UNDERMINE = global.theater.addWorldObject(new Sprite({
                x: global.gameWidth/2,
                y: global.gameHeight/2,
                texture: 'UNDERMINE',
                alpha: 0,
                scaleX: 2,
                scaleY: 4,
            }));

            global.world.playSound('theundermine', { humanized: false });
            yield S.simul(
                S.doOverTime(1, t => {
                    THE.alpha = t;
                    UNDERMINE.alpha = t;
                }),
                S.doOverTime(4, t => {
                    UNDERMINE.scaleX = 2 + 2*Tween.Easing.OutCubic(t);
                }),
            );
            //yield S.wait(2);
            yield S.doOverTime(1, t => {
                THE.alpha = 1-t;
                UNDERMINE.alpha = 1-t;
            });

            THE.removeFromWorld();
            UNDERMINE.removeFromWorld();

            global.theater.playMusic('caverns');
        },
        transitions: [{ toNode: 'gameplay' }]
    },

    /* Items */
    'item_redkey': {
        type: 'cutscene',
        script: function*() {
            GIVE_ITEM('redkey');
            global.world.select.nameAll('redkey').forEach(key => key.removeFromWorld());
            global.world.playSound('item_get');
            yield S.dialog("Feeling moderately bamboozled, you pick up the Red Key.");
            yield S.dialog("It can be used to open the Red Door.");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'item_blackkey': {
        type: 'cutscene',
        script: function*() {
            GIVE_ITEM('blackkey');
            global.world.select.nameAll('blackkey').forEach(key => key.removeFromWorld());
            global.world.playSound('item_get');
            yield S.dialog("After a long trek back through the Undermine, there's nothing more refreshing than an ice-cold Black Key.");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'item_string': {
        type: 'cutscene',
        script: function*() {
            GIVE_ITEM('string');
            global.world.select.nameAll('string').forEach(key => key.removeFromWorld());
            global.world.playSound('item_get');
            yield S.dialog("String!! Ha ha. This used to make you laugh so hard back in the day.");
            yield S.dialog("Pocketed the string for later use.");
        },
        transitions: [{ toNode: 'gameplay' }]
    },

    /* Locked Doors */
    'i_reddoor': {
        type: 'cutscene',
        script: function*() {
            yield S.chooseItem("Which item?", isResult);

            if (isResult.item === 'redkey') {
                yield S.dialog("The Red Key slides snugly into the keyhole.");
                global.world.select.name('reddoor')?.removeFromWorld();
                global.world.playSound('crush');
                global.theater.runScript(S.shake(2, 0.3));
                yield S.dialog("This sure was a hassle to unlock. You can't believe you have to do this every time you come down here.");
            } else if (isResult.item === 'cane') {
                yield S.dialog("Let's not resort to this just yet.");
            } else {
                yield S.dialog("That doesn't really strike you as a \"door opening item\".");
            }
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_blackdoor': {
        type: 'cutscene',
        script: function*() {
            yield S.chooseItem("Which item?", isResult);

            if (isResult.item === 'blackkey') {
                yield S.dialog("You insert the Black Key, but it doesn't turn.");
                yield S.dialog("Upon closer inspection, it appears the keyhole on this door is upside down.");
                yield S.dialog("Try using the key upside down.");
                REPLACE_ITEM('blackkey', 'blackkey_upsidedown');
            } else if (isResult.item === 'blackkey_upsidedown') {
                yield S.dialog("You insert the Black Key upside down");
                yield S.dialog("but it still doesn't turn.");
                yield S.dialog("this is peculiar.");
                yield S.dialog("Hold on, try inserting the key rightside up again...");
                REPLACE_ITEM('blackkey_upsidedown', 'blackkey_rightsideup');
            } else if (isResult.item === 'blackkey_rightsideup') {
                global.world.select.name('blackdoor')?.removeFromWorld();
                global.world.playSound('crush');
                global.theater.runScript(S.shake(2, 0.3));
                yield S.dialog("That's the ticket! The door unlocks.");
                yield S.dialog("Unfortunately, so much reorientation in such a small amount of time has caused the key to disintegrate.");
                CONSUME_ITEM('blackkey_rightsideup');
            } else if (isResult.item === 'redkey') {
                yield S.dialog("The Red Key slides snugly into the keyhole.");
                yield S.dialog(".................................");
                yield S.dialog("... just kidding.");
            } else if (isResult.item === 'cane') {
                yield S.dialog("Let's not resort to this just yet.");
            } else {
                yield S.dialog("That doesn't really strike you as a \"door opening item\".");
            }
        },
        transitions: [{ toNode: 'gameplay' }]
    },

    /* Levers */
    'lever_pit': {
        type: 'cutscene',
        script: function*() {
            global.world.select.name('pitdoor1', false)?.removeFromWorld();
            global.world.select.name('pitdoor2', false)?.removeFromWorld();
        },
        transitions: [{ toNode: 'gameplay' }]
    },

    /* Interactions */
    'i_mgsign': {
        type: 'cutscene',
        script: function*() {
            yield S.dialog("Mirigram and Gobbor's House");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_jdsign': {
        type: 'cutscene',
        script: function*() {
            yield S.dialog("Jergol and Diggur's Cool Science House");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_jdhouse': {
        type: 'cutscene',
        script: function*() {
            yield S.dialog("It's locked.");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_ssign': {
        type: 'cutscene',
        script: function*() {
            yield S.dialog("Scammir's House");
            yield S.dialog("A note scrawled on the sign in nearly illegible handwriting reads: \"Come on in! Door's unlocked :)\".");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_shouse': {
        type: 'cutscene',
        script: function*() {
            scammirDoorInteractions++;

            if (scammirDoorInteractions <= 1) {
                global.theater.runScript(S.shake(2, 0.3));
                global.world.playSound('crush');
                global.theater.dialogBox.setSpeakSound(undefined);
                yield S.dialog("YEOWCH!!");
                global.theater.dialogBox.setSpeakSound('dialogspeak');
                yield S.dialog("... the handle shocked you. Kids these days and their electronic devices...");
            } else if (scammirDoorInteractions === 2) {
                global.theater.runScript(S.shake(2, 0.3));
                global.world.playSound('crush');
                global.theater.dialogBox.setSpeakSound(undefined);
                yield S.dialog("YEOWCH!!");
                global.theater.dialogBox.setSpeakSound('dialogspeak');
                yield S.dialog("The electric shock resonating through your body makes you inexplicably feel 20 years younger.");
            } else {
                yield S.dialog("...........................");
                yield S.dialog("... the handle has run out of battery.");
            }
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_umsign': {
        type: 'cutscene',
        script: function*() {
            yield S.dialog("The Undermine: Adventurers only beyond this point!");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_hsign': {
        type: 'cutscene',
        script: function*() {
            yield S.dialog("Huntar's House");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_hhouse': {
        type: 'cutscene',
        script: function*() {
            yield S.dialog("It's locked.");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_diggur_surface': {
        type: 'cutscene',
        script: function*() {
            global.theater.dialogBox.showName('Diggur');
            global.theater.dialogBox.setSpeakSound('dialogspeak_diggur');
            yield S.dialog("Another day, another quest... I wonder, what adventures await us today?");
            yield S.dialog("Are you coming down too, Mrs M? What a pleasant surprise.");
            yield S.dialog("Perhaps our paths may cross down below.");
            global.theater.dialogBox.showName(undefined);
            global.theater.dialogBox.setSpeakSound('dialogspeak');


        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_scammir_surface': {
        type: 'cutscene',
        script: function*() {
            global.theater.dialogBox.showName('Scammir');
            global.theater.dialogBox.setSpeakSound('dialogspeak_scammir');
            yield S.dialog("pssst");
            yield S.dialog("fancy a lil scam~?");
            yield S.dialog("first ones on the house");
            yield S.dialogAdd(" ... not!! psyche!");
            global.theater.dialogBox.showName(undefined);
            global.theater.dialogBox.setSpeakSound('dialogspeak');
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_gobbor_surface': {
        type: 'cutscene',
        script: function*() {
            global.theater.dialogBox.showName('Gobbor');
            global.theater.dialogBox.setSpeakSound(undefined);
            yield S.dialog(".....................");
            global.theater.dialogBox.showName(undefined);
            global.theater.dialogBox.setSpeakSound('dialogspeak');
            yield S.dialog("Gobbor doesn't say anything, being the silent protagonist he is.");
            yield S.dialog("Such a polite young man.");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_leversign': {
        type: 'cutscene',
        script: function*() {
            yield S.dialog("The sign reads: \"the door ahead is locked!! quick, pull the lever to unlock it!!\"");
            if (hasFallen) {
                yield S.dialog("...........................");
                yield S.dialog("... you can't believe you actually pulled that lever.");
                yield S.dialog("But you can't be too mad about it, as your attention shifts toward the lever, now floating inexplicably in mid air.");
                yield S.dialog("Truly, we are living in the future.");
            } else {
                yield S.dialog("... the prank is so obvious. no one would ever pull that lever.");
            }
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_note': {
        type: 'cutscene',
        script: function*() {
            yield S.dialog("get scammed ~");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_scammir_tele': {
        type: 'cutscene',
        script: function*() {
            global.theater.dialogBox.showName('Scammir');
            global.theater.dialogBox.setSpeakSound('dialogspeak_scammir');
            yield S.dialog("teehee");
            yield S.dialog("free telescope viewings, just $5 per view ~");
            global.theater.dialogBox.showName('Scammir');
            global.theater.dialogBox.setSpeakSound('dialogspeak');
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_telescope': {
        type: 'cutscene',
        script: function*() {
            yield S.chooseItem("Which item?", isResult);

            if (isResult.item === 'nickel') {
                yield S.dialog("Using the nickel, you peer into the telescope, and are offered the sight of new areas far and wide...");
                yield S.dialog("... a glimpse of jokes that have not been and would never be...");
                yield S.dialog("... you can even see part of the subworld sticking out.");
                CONSUME_ITEM('nickel');
            } else {
                global.theater.dialogBox.showName('Scammir');
                global.theater.dialogBox.setSpeakSound('dialogspeak_scammir');
                yield S.dialog("i dont know what that is");
                yield S.dialog("sounds like a scam to me");
                global.theater.dialogBox.showName(undefined);
                global.theater.dialogBox.setSpeakSound('dialogspeak');
            }
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_grass': {
        type: 'cutscene',
        script: function*() {
            yield S.dialog("A discreet patch of grass, rife with humorous potential.");
            yield S.dialog("If only you had some String...");

            yield S.chooseItem("Which item?", isResult);

            if (isResult.item === 'string') {
                global.world.addWorldObject(new Sprite({
                    x: 3383, y: 1175,
                    texture: Texture.filledRect(35, 1, 0xFFFFFF, 1),
                    layer: 'bg',
                }));
                global.world.select.name('ci_i_grass')?.removeFromWorld();
                CONSUME_ITEM('string');
                yield S.dialog("You tie the string to each post. The grass does a bad job of hiding it, but you'd be surprised what people fall for these days.");

                let player = global.world.select.type(Player);
                global.theater.runScript(S.chain(
                    S.waitUntil(() => player.x < 3272),
                    S.call(() => global.theater.storyManager.cutsceneManager.playCutscene('diggur_trip')),
                ));
            } else {
                yield S.dialog("That is not string. How foolish of you to even consider it.");
            }
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_crackedwall': {
        type: 'cutscene',
        script: function*() {
            yield S.dialog("This section of wall appears cracked. You wonder what could be on the other side?");
            yield S.dialog("Unfortunately, it would take a considerable amount of force to destroy it.");
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_diggur_fall': {
        type: 'cutscene',
        script: function*() {
            global.theater.dialogBox.showName('Diggur');
            global.theater.dialogBox.setSpeakSound('dialogspeak_diggur');
            yield S.dialog("Oof... Mrs M... help...");
            global.theater.dialogBox.showName(undefined);
            global.theater.dialogBox.setSpeakSound('dialogspeak');
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_loominggate': {
        type: 'cutscene',
        script: function*() {
            let loomingGateOpen = global.world.select.name('orb3_final').isVisible();
            if (loomingGateOpen) {
                let player = global.world.select.type(Player);
                player.teleport(248, 1567);
            } else {
                yield S.dialog("The looming Gate is closed.");
                yield S.dialog("Luckily, two of the orbs happen to be inserted already.");
            }
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'i_chest': {
        type: 'cutscene',
        script: function*() {
            let player = global.world.select.type(Player);
            let chest = global.world.select.type(Chest);
            chest.open();

            yield S.wait(2);

            while (player.x > 166) {
                player.controller.left = true;
                yield;
            }

            yield S.wait(1);
            player.flipX = false;
            yield S.wait(0.5);
            player.flipX = true;
            yield S.wait(0.5);
            player.flipX = false;
            yield S.wait(1);

            yield S.playAnimation(player, 'grab', true, true);

            let prank = global.world.addWorldObject(new Sprite({
                x: player.x,
                y: player.y - 5,
                texture: 'prank',
                layer: 'fg',
                scaleX: 0,
                scaleY: 0,
            }));

            global.world.playSound('hjonk');
            player.playAnimation('hold', true);
            yield S.simul(
                S.tweenPt(0.5, prank, vec2(prank.x, prank.y), vec2(player.x, player.y - 32), Tween.Easing.OutCubic),
                S.tween(0.5, prank, 'scaleX', 0, 1),
                S.tween(0.5, prank, 'scaleY', 0, 1),
            );

            yield S.wait(1);

            player.playAnimation('slam', true);
            yield S.simul(
                S.tweenPt(0.3, prank, vec2(prank.x, prank.y), vec2(chest.x, chest.y - 20), Tween.Easing.OutCubic),
                S.tween(0.3, prank, 'scaleX', 1, 0),
                S.tween(0.3, prank, 'scaleY', 1, 0),
                S.wait(0.5),
            );

            player.playAnimation('idle', true);
            yield S.wait(1);

            player.playAnimation('slam', true);
            chest.close();
            yield S.wait(0.5);
            player.playAnimation('idle', true);
            yield S.wait(1);

            global.theater.addWorldObject(new Sprite({ texture: Texture.filledRect(global.gameWidth, global.gameHeight, 0x000000), layer: Theater.LAYER_SLIDES }));
            
            global.theater.runScript(function*() {
                yield;
                global.theater.storyManager.cutsceneManager.playCutscene('credits');
            });
        },
        transitions: [{ toNode: 'credits' }]
    },

    'diggur_trip': {
        type: 'cutscene',
        script: function*() {
            global.theater.musicManager.stopMusic(0.5);
            global.world.select.typeAll(Diggur).forEach(diggur => diggur.removeFromWorld());
            let player = global.world.select.type(Player);
            let diggur = global.world.addWorldObject(new Diggur(3120, 1150));
            yield S.loopUntil(() => diggur.x > 3392, function*() {
                diggur.controller.right = true;
                if (diggur.x > player.x) {
                    player.flipX = false;
                }
                yield;
            });

            diggur.y -= 5;
            diggur.v.y = -300;
            diggur.spinning = true;
            let startx = diggur.x;
            let endx = 3576;
            let basey = diggur.y;
            global.world.playSound('trip');
            yield S.doOverTime(1, t => {
                diggur.x = M.lerp(startx, endx, t);
                diggur.y = basey + M.jumpParabola(0, -80, 0, t);
            });

            diggur.addChild(new CutsceneInteractable(-16, 0, 'i_diggur_fall')).setBoundsSize(32, 32);

            yield S.wait(2.5);

            yield S.dialog("Ha ha");
            yield S.dialog("Always good for a laugh.");

            global.theater.musicManager.playMusic('caverns', 0.5);
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'collect_orb': {
        type: 'cutscene',
        script: function*() {
            let orb = global.world.select.name<Orb>('orb3');
            let player = global.world.select.type(Player);

            global.world.playSound('theundermine', { humanized: false });

            orb.shaking = true;
            yield S.doOverTime(2, t => {
                orb.scaleX = 0.5 - 0.25*Tween.Easing.OutCubic(t);
                orb.scaleY = 0.5 - 0.25*Tween.Easing.OutCubic(t);
            });
            yield S.wait(1);
            yield S.doOverTime(2, t => {
                orb.scaleX = 0.25 + 40*t;
                orb.scaleY = 0.25 + 40*t;
            });
            player.x = 2166;
            player.y = 1247;
            orb.removeFromWorld();
            global.theater.playMusic('caverns');

            let orbfinal = global.world.select.name<Orb>('orb3_final');
            orbfinal.setVisible(true);
            orbfinal.scaleX = 50;
            orbfinal.scaleY = 50;

            yield S.doOverTime(2, t => {
                orbfinal.scaleX = 0.45 + 50 * (1-t);
                orbfinal.scaleY = 0.45 + 50 * (1-t);
            });

            orbfinal.layer = 'bg';

            yield S.wait(1);
            yield S.dialog("You obtained the Orb of Craftsmanship.");

            global.world.addWorldObject(new Sprite({
                x: 2134,
                y: 1179,
                texture: 'lgdoor_open',
                layer: 'bg',
            }));
            global.world.playSound('crush');
            global.theater.runScript(S.shake(2, 0.3));
        },
        transitions: [{ toNode: 'gameplay' }]
    },
    'credits': {
        type: 'cutscene',
        script: function*() {
            global.theater.playMusic('credits');
            yield S.fadeOut(0, 0x000000);
            
            global.theater.addWorldObject(new SpriteText({ x: global.gameWidth/2, y: 24, text: 'On Undermining.', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
            yield S.wait(2);
            global.theater.addWorldObject(new SpriteText({ x: global.gameWidth/2, y: 56, text: 'A Game by Hayden "lectvs" McCraw', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
            yield S.wait(2);
            global.theater.addWorldObject(new SpriteText({ x: global.gameWidth/2, y: 88, text: 'Based on the "On Being Undermined."\ncinematic universe created by Andrfw', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
            yield S.wait(2);
            global.theater.addWorldObject(new SpriteText({ x: global.gameWidth/2, y: 152, text: 'Special Thanks:', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
            yield S.wait(2);
            global.theater.addWorldObject(new SpriteText({ x: global.gameWidth/2, y: 184, text: 'Andrew Murray           Original Game\n                             + Assets', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
            yield S.wait(2);
            global.theater.addWorldObject(new SpriteText({ x: global.gameWidth/2, y: 232, text: 'Andrew Murray             Playtesting', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));
            yield S.wait(2);
            global.theater.addWorldObject(new SpriteText({ x: global.gameWidth/2, y: 272, text: 'Thanks for Playing!', anchor: Vector2.TOP_CENTER, layer: Theater.LAYER_SLIDES }));

            // Loop indefinitely.
            while (true) yield;
        },
        transitions: []
    }
}