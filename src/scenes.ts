/// <reference path="./animations.ts" />
/// <reference path="./stages.ts" />

namespace S { export const scenes: Dict<Scene> = {



'main': {
    stage: Stages.MILOS_ROOM,
    cameraMode: { type: 'follow', target: 'angie', offset: { x: 0, y: -18 } },
    defaultControl: ['angie'],
    schema: {
        worldObjects: [
            Actors.ANGIE,
        ]
    },
    entry: 'room_intro',
    cutscenes: {
        'room_intro': {
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
            }
        }
    }
},

'empty': {
    stage: {
        layers: [
            { name: 'bg' },
            { name: 'main' },
        ],
        physicsGroups: {
            'player': {},
        },
    },
    defaultControl: ['angie'],
    schema: {
        worldObjects: [
            Actors.ANGIE,
            {
                name: 'room',
                constructor: Sprite,
                x: -256, y: -192,
                texture: 'room_bg',
                layer: 'bg',
            },
            {
                name: 'backwall',
                constructor: BackWall,
                x: 64, y: 0,
                layer: 'bg',
            },
        ]
    },
    cutscenes: {

    }
}



}} const scenes = S.scenes;
