/// <reference path="./animations.ts" />
/// <reference path="./stages.ts" />

let scenes: Dict<Scene> = {
    'main': {
        stage: Stages.MILOS_ROOM,
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
                    let angie = <Sprite>S.global.world.getWorldObjectByName('angie');
                    angie.x = 98; angie.y = 160;
                    angie.offset.y = -19;
                    angie.flipX = true;
                    angie.angle = -90;

                    yield S.wait(1);

                    angie.angle = 0;
                    angie.x -= 12;
                    yield S.jump(angie, 8, 0.5, true);

                    for (let i = 0; i < 1000; i++) {
                        debug(i);
                        yield;
                    }
                }
                // script: ` @angie;
                //     $angie.x = 98; $angie.y = 160;
                //     $angie.offset.y = -19;
                //     $angie.flipX = true;
                //     $angie.angle = -90;

                //     wait(1);
                //     $angie.angle = 0;
                //     $angie.x -= 12;
                //     $angie -> jump(8, 0.5, true);

                //     $i = 0;
                //     while ($i < 1000) { debug($i) || $i++ }
                // `
            }
        },
    }
}