/// <reference path="player.ts" />

function getStoryboard(): Storyboard { return {
    'start': {
        type: 'start',
        transitions: [{ type: 'onStage', stage: 'game', toNode: 'intro' }]
    },
    'intro': {
        type: 'cutscene',
        script: function*() {
            let SKIP = Debug.DEBUG && true;

            let player = global.world.getWorldObjectByType(Player);
            let campfire = global.world.getWorldObjectByType(Campfire);
            let startLog = global.world.getWorldObjectByName<Item>('start_log');
            global.world.camera.setModeFocus(campfire.x, campfire.y);
            
            if (!SKIP) {
                yield S.wait(2);
                yield S.dialog("Don't let the fire burn out...");
                yield S.dialog("It's the only light you have in this world.");
                yield S.wait(0.5);
            }
            if (SKIP) Debug.SKIP_RATE = 100;
            yield S.simul(
                S.fadeSlides(1),
                S.playAnimation(player, 'intro_idle'),
            );
            
            yield S.moveToX(player, startLog.x);
            player.flipX = true;
            yield S.wait(0.5);
            yield S.moveToY(player, startLog.y - 2);
            yield S.wait(0.5);
            player.controller.pickupDropItem = true; yield;
            yield S.wait(0.5);
            yield S.moveToX(player, player.x - 12);
            yield S.wait(0.5);
            player.controller.pickupDropItem = true; yield;
            yield S.wait(1);

            campfire.startBurn();

            Debug.SKIP_RATE = 1;
        },
        transitions: [{ type: 'instant', toNode: 'post_intro_wait' }]
    },
    'post_intro_wait': {
        type: 'cutscene',
        script: function*() {
            yield S.wait(1);
            global.theater.currentWorld.camera.setModeFollow('player', 0, -8);
        },
        transitions: [{ type: 'instant', toNode: 'gameplay' }]
    },
    'gameplay': {
        type: 'gameplay',
        transitions: [
            { type: 'onCondition', condition: () => global.world.getWorldObjectByType(Campfire).hasConsumedGasoline, toNode: 'win' },
            { type: 'onCondition', condition: () => global.world.getWorldObjectByType(Campfire).isOut, toNode: 'lose' },
        ]
    },
    'win': {
        type: 'cutscene',
        script: function*() {
            let campfire = global.world.getWorldObjectByType(Campfire);
            let lightingManager = global.world.getWorldObjectByType(LightingManager);

            global.world.camera.setModeFocus(campfire.x, campfire.y);
            global.world.camera.setMovementSmooth(0, 0, 0);
            if (global.world.hasWorldObject('monster')) {
                global.world.removeWorldObject('monster');
            }

            campfire.stopBurn();
            yield S.wait(4);
            campfire.win();
            yield S.doOverTime(3, t => {
                lightingManager.winRadius += 400*global.script.delta;
            });

            global.world.addWorldObject(<Sprite.Config>{
                constructor: Sprite,
                texture: Texture.filledRect(Main.width, Main.height, 0xFFFFFF),
                layer: 'above',
                ignoreCamera: true,
            });
            global.world.addWorldObject(<SpriteText.Config>{
                constructor: SpriteText,
                font: Assets.fonts.DELUXE16,
                x: 61, y: 72,
                text: "your fire lives\nanother day...",
                style: { color: 0x000000, },
                ignoreCamera: true,
            });

            yield S.wait(2);
            yield S.fadeOut(3, 0xFFFFFF);
            yield S.wait(1);
            yield S.fadeOut(3);
            yield S.wait(1);

            global.game.loadMainMenu();
        },
        transitions: []
    },
    'lose': {
        type: 'cutscene',
        script: function*() {
            let campfire = global.world.getWorldObjectByType(Campfire);

            global.world.camera.setModeFocus(campfire.x, campfire.y);
            global.world.camera.setMovementSmooth(0, 0, 0);
            if (global.world.hasWorldObject('monster')) {
                global.world.removeWorldObject('monster');
            }

            yield S.wait(2);

            campfire.extinguish();
            global.world.addWorldObject(<Sprite.Config>{
                name: 'fireout',
                constructor: Sprite,
                x: campfire.x, y: campfire.y,
                texture: 'smoke',
                layer: 'above',
                life: 2,
                updateCallback: (smoke: Sprite, delta) => {
                    let t = smoke.life.progress;
                    smoke.offset.x = 4 * Math.exp(-t) * Math.sin(4*Math.PI*t);
                    smoke.offset.y = -32 * t;
                    smoke.alpha = 1-t;
                }
            });

            yield S.waitUntil(() => !global.world.hasWorldObject('fireout'));
            yield S.wait(1);

            global.world.addWorldObject(<Sprite.Config>{
                constructor: Sprite,
                texture: Texture.filledRect(Main.width, Main.height, 0x000000),
                ignoreCamera: true,
            });
            global.world.addWorldObject(<SpriteText.Config>{
                name: 'losstext',
                constructor: SpriteText,
                font: Assets.fonts.DELUXE16,
                x: 30, y: 80,
                text: "you ran out of light...",
                style: { color: 0xFFFFFF, },
                ignoreCamera: true,
            });

            yield S.wait(2);

            let losshint = global.world.addWorldObject<SpriteText>(<SpriteText.Config>{
                name: 'losshint',
                constructor: SpriteText,
                font: Assets.fonts.DELUXE16,
                x: 30, y: 160,
                text: Random.element([
                    "chop faster",
                    "[e]throw[/e] logs into the fire",
                    "did you find the [e]door[/e]?",
                    "did you find the [e]key[/e]?",
                    "did you find the [e]torch[/e]?",
                ]),
                style: { color: 0x333333, alpha: 0 },
                ignoreCamera: true,
            });

            yield S.doOverTime(2, t => {
                losshint.x = Main.width/2 - losshint.getTextWidth()/2;
                losshint.style.alpha = t;
            });
            yield S.wait(2);
            yield S.fadeOut(3);
            yield S.wait(1);

            global.game.loadMainMenu();
        },
        transitions: []
    }
}}