
namespace S { export const storyboard: Storyboard = {

    'main': {
        type: 'code',
        func: () => {
            Party.addMemberToWorld(party.angie, global.world);
            party.angie.active = true;

            Party.addMemberToWorld(party.milo, global.world);
            party.milo.active = true;
        },
        after: 'room_intro'
    },

    'room_intro': {
        type: 'cutscene',
        script: function*() {
            DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS = true;
            finishImmediately(fadeOut(1));

            let angie = global.getSprite('angie')
            angie.x = 98; angie.y = 160;
            angie.offset.y = -19;
            angie.flipX = true;
            angie.angle = -90;

            yield fadeSlides(2);
            yield wait(3);
            yield shake(1, 2);
            yield wait(3);
            yield dialog("I felt that one.");
            yield wait(1);
            yield shake(1, 2);
            yield wait(2);
            yield dialog("What's that boy up to?");
            yield dialog("I'd better check outside.");
            yield wait(0.2);

            angie.angle = 0;
            angie.x -= 12;
            yield jump(angie, 8, 0.5, true);
            DEBUG_SKIP_ALL_CUTSCENE_SCRIPTS = false;
            angie.x = -291;
            angie.y = -413;
        },
        after: 'test'
    },

    'test': {
        type: 'gameplay',
        start: () => {
            global.world.camera.setModeFollow('angie', 0, -18);
            global.getSprite('angie').controllable = true;
            global.getSprite('milo').follow('angie');
        }
    },

}} const storyboard = S.storyboard;