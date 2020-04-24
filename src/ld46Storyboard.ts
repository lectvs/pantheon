/// <reference path="player.ts" />

namespace S { export const storyboard: Storyboard = {
    'start': {
        type: 'start',
        transitions: [{ type: 'onStage', stage: 'game', toNode: 'intro' }]
    },
    'intro': {
        type: 'cutscene',
        script: function*() {
            let SKIP = Debug.DEBUG && true;

            let player = global.getWorldObject<Player>('player');
            let campfire = global.getWorldObject<Campfire>('campfire');
            let startLog = global.getWorldObject<ItemGround>('start_log');
            campfire.introEffect = true;
            global.script.theater.currentWorld.camera.setModeFocus(campfire.x, campfire.y);
            
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
            campfire.introEffect = false;
            yield S.wait(1);
            global.script.theater.currentWorld.camera.setModeFollow('player');
            Debug.SKIP_RATE = 1;
        },
        transitions: [{ type: 'instant', toNode: 'gameplay' }]
    },
    'gameplay': {
        type: 'gameplay',
        transitions: [
            { type: 'onCondition', condition: () => global.getWorldObject<Campfire>('campfire').hasConsumedGasoline, toNode: 'win' },
            { type: 'onCondition', condition: () => global.getWorldObject<Campfire>('campfire').isOut, toNode: 'lose' },
        ]
    },
    'win': {
        type: 'cutscene',
        script: function*() {
            let campfire = global.getWorldObject<Campfire>('campfire');
            let currentWorld = <FirelitWorld>global.theater.currentWorld;
            let lightingManager = global.getWorldObject<LightingManager>('lightingManager');

            currentWorld.camera.setModeFocus(campfire.x, campfire.y);
            currentWorld.camera.setMovementSmooth(0, 0, 0);
            if (currentWorld.containsWorldObject('monster')) {
                World.Actions.removeWorldObjectFromWorld(currentWorld.getWorldObjectByName('monster'));
            }
            campfire.winEffect = true;
            if (campfire.winRadius < campfire.visualFireBaseRadius) {
                campfire.visualFireRadiusBuffer = 100;
            }

            yield S.wait(4);
            yield S.doOverTime(3, t => {
                lightingManager.winKeyRadius = 400 * t;
                campfire.timer.time -= 120*global.script.delta;
            });

            World.Actions.addWorldObjectToWorld(WorldObject.fromConfig(<Sprite.Config>{
                constructor: Sprite,
                texture: Texture.filledRect(Main.width, Main.height, 0xFFFFFF),
                layer: 'above',
                ignoreCamera: true,
            }), currentWorld);
            World.Actions.addWorldObjectToWorld(WorldObject.fromConfig(<SpriteText.Config>{
                constructor: SpriteText,
                font: Assets.fonts.DELUXE16,
                x: 61, y: 72,
                text: "your fire lives\nanother day...",
                style: { color: 0x000000, },
                ignoreCamera: true,
            }), currentWorld);

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
            let campfire = global.getWorldObject<Campfire>('campfire');
            let currentWorld = <FirelitWorld>global.theater.currentWorld;

            currentWorld.camera.setModeFocus(campfire.x, campfire.y);
            currentWorld.camera.setMovementSmooth(0, 0, 0);
            if (currentWorld.containsWorldObject('monster')) {
                World.Actions.removeWorldObjectFromWorld(currentWorld.getWorldObjectByName('monster'));
            }

            yield S.wait(2);

            campfire.fireSprite.alpha = 0;
            World.Actions.addWorldObjectToWorld(WorldObject.fromConfig<Sprite>(<Sprite.Config>{
                name: 'fireout',
                constructor: Sprite,
                x: campfire.x, y: campfire.y,
                texture: 'smoke',
                layer: 'above',
                life: 2,
                updateCallback: (delta, smoke: Sprite) => {
                    let t = smoke.life.progress;
                    smoke.offset.x = 4 * Math.exp(-t) * Math.sin(4*Math.PI*t);
                    smoke.offset.y = -32 * t;
                    smoke.alpha = 1-t;
                }
            }), currentWorld);

            yield S.waitUntil(() => !currentWorld.containsWorldObject('fireout'));
            yield S.wait(1);

            World.Actions.addWorldObjectToWorld(WorldObject.fromConfig(<Sprite.Config>{
                constructor: Sprite,
                texture: Texture.filledRect(Main.width, Main.height, 0x000000),
                ignoreCamera: true,
            }), currentWorld);
            World.Actions.addWorldObjectToWorld(WorldObject.fromConfig(<SpriteText.Config>{
                name: 'losstext',
                constructor: SpriteText,
                font: Assets.fonts.DELUXE16,
                x: 30, y: 80,
                text: "you ran out of light...",
                style: { color: 0xFFFFFF, },
                ignoreCamera: true,
            }), currentWorld);

            yield S.wait(2);

            let losshint = World.Actions.addWorldObjectToWorld<SpriteText>(WorldObject.fromConfig(<SpriteText.Config>{
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
            }), currentWorld);

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
}} const storyboard = S.storyboard;