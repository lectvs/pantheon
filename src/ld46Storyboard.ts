
namespace S { export const storyboard: Storyboard = {
    'start': {
        type: 'start',
        transitions: [{ type: 'instant', toNode: 'intro' }]
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
        transitions: []
    }
}} const storyboard = S.storyboard;