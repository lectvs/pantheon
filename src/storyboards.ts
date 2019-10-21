
namespace S { export const storyboard: Storyboard = {

    'room_intro': {
        type: 'cutscene',
        script: function*() {
            DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS = true;
            finishImmediately(fadeOut(1));

            let angie = global.getSprite('angie');
            angie.x = 98; angie.y = 160;
            angie.offset.y = -19;
            angie.flipX = true;
            angie.angle = -90;

            yield fadeSlides(2);
            yield wait(3);
            yield shake(1, 2);
            yield wait(3);
            yield dialog('angie/happy', "I felt that one.");
            yield wait(1);
            yield shake(1, 2);
            yield wait(2);
            
            yield dialog('angie/happy', "What's that boy up to?");
            yield dialog('angie/happy', "I'd better check outside.");
            yield wait(0.2);

            angie.angle = 0;
            angie.x -= 12;
            yield jump(angie, 8, 0.5, true);
        },
        after: 'angie_start_gameplay'
    },

    'angie_start_gameplay': {
        type: 'gameplay',
        start: () => {}
    },

    'interact_window': {
        type: 'cutscene',
        playOnlyOnce: true,
        playOnInteractWith: ['window'],
        script: function* () {
            let angie = global.getSprite<HumanCharacter>('angie');
            let door = global.getSprite('door');
            let milo: HumanCharacter;

            yield dialog('angie/happy', "...");
            yield dialog('angie/happy', "Oh no...");
            yield [
                function*() {
                    door.playAnimation('open');
                    yield shake(1, 0.1);
                },
                function*() {
                    global.theater.party.addMemberToWorld('milo', global.world);
                    global.theater.party.setMemberActive('milo');
                    milo = global.getSprite<HumanCharacter>('milo');
                    milo.colliding = false;
                    global.world.setLayer(milo, 'room');
                    milo.x = 98;
                    milo.y = 80;
                    milo.playAnimation('flop_lay');
                    yield tween(milo, 'y', milo.y, milo.y + 52, 0.2, Tween.Easing.InvSquare);
                },
                function*() {
                    angie.setDirection(Direction2D.DOWN);
                    angie.flipX = false;
                    yield jump(angie, 16, 0.2, true);
                }
            ];

            yield dialog('angie/happy', "Milo?");
            yield moveTo(angie, 110, 116);
            angie.setDirection(Direction2D.LEFT);

            yield dialog('angie/happy', "Hey, Milo! Come on, get up!");
            yield shake(1, 1);
            DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS = false;
            yield dialog('angie/happy', "Milo!!");
            yield shake(1, 0.1);
            yield dialog('milo/sigh', 'Ow!');
            yield dialog('angie/happy', "Good!");

            yield moveTo(angie, 98, 91);
            door.playAnimation('closed');

            yield moveTo(angie, 129, 143);
            angie.setDirection(Direction2D.UP);
            angie.flipX = false;
            angie.playAnimation('throw_start');

            let board1 = global.world.addWorldObject(new Sprite({ texture: 'board1', x: 129, y: 108 }), { layer: 'fg' });
            let board2 = global.world.addWorldObject(new Sprite({ texture: 'board2', x: 126, y: 108 }), { layer: 'fg' });

            yield moveToY(angie, angie.y + 2);
            yield wait(0.5);
            yield moveToY(angie, angie.y + 2);
            yield wait(1);
            yield [
                function* () {
                    yield tween(board1, 'y', board1.y, 56, 0.3, Tween.Easing.Linear);
                    yield tween(board2, 'y', board2.y, 56, 0.3, Tween.Easing.Linear);
                    global.getWorldObject('backwall_covered').visible = true;
                    global.world.removeWorldObject(global.getWorldObject('backwall'));
                    global.world.removeWorldObject(global.getWorldObject('door'));
                    global.world.removeWorldObject(global.getWorldObject('window'));
                    global.world.removeWorldObject(board1);
                    global.world.removeWorldObject(board2);
                },
                function* () {
                    angie.playAnimation('throw_end', 0, true);
                    yield moveToY(angie, angie.y - 8);
                }
            ];
            yield wait(1);
            angie.playAnimation('idle_up', 0, true);
        },
        after: 'angie_start_gameplay'
    }

}} const storyboard = S.storyboard;