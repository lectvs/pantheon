/// <reference path="theater.ts"/>

class TestTheater extends Theater {
    constructor(config) {
        DEBUG_SHOW_MOUSE_POSITION = false;
        super({
            stages: {'s': { backgroundColor: 0x000066 }},
            stageToLoad: 's',
            story: {
                storyboard: {'s': { type: 'gameplay', transitions: [] }},
                storyboardPath: ['s'],
                storyEvents: {},
                storyConfig: {
                    initialConfig: {},
                    executeFn: sc => null,
                }
            },
            party: { leader: undefined, activeMembers: [], members: {} },
            dialogBox: {
                x: Main.width/2, y: Main.height - 32,
                texture: 'dialogbox',
                spriteTextFont: Assets.fonts.DELUXE16,
                textAreaFull: { x: -122, y: -27, width: 244, height: 54 },
                textAreaPortrait: { x: -122, y: -27, width: 174, height: 54 },
                portraitPosition: { x: 86, y: 0 },
                advanceKey: 'advanceDialog',
            },
            skipCutsceneScriptKey: 'skipCutsceneScript',
        });

        let sprite = new Sprite({ x: 20, y: 20, texture: 'door_closed' });
        let child = new Sprite({ x: 60, y: 60, texture: 'debug' });
        World.Actions.addChildToParent(child, sprite);
        World.Actions.addWorldObjectToWorld(sprite, this.currentWorld);
        World.Actions.removeWorldObjectFromWorld(child);
    }

    render(screen: Texture) {
        super.render(screen);
    }
}