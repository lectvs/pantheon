/// <reference path="../lectvs/theater.ts"/>

class TestTheater extends Theater {
    constructor(config) {
        super({
            stages: {'s': {
                parent: BASE_STAGE,
                backgroundColor: 0x000066,
                camera: {
                    mode: Camera.Mode.FOLLOW('player', 8, 8)
                },
                worldObjects: [
                    <Tilemap.Config>{
                        name: 'ground',
                        constructor: Tilemap,
                        tilemap: 'cave',
                        tilemapLayer: 1,
                        layer: 'main',
                        physicsGroup: 'walls',
                        debugBounds: true
                    },
                    // <ZOrderedTilemap.Config>{
                    //     name: 'cave',
                    //     constructor: ZOrderedTilemap,
                    //     tilemap: 'cave',
                    //     tilemapLayer: 0,
                    //     layer: 'main',
                    //     zMap: { 2: 3, 3: 3, 5: 1, 7: 3, 8: 3, 9: 3, 10: 3, 11: 3, 12: 3, 13: 3, 17: 3, 18: 3, 19: 3, 20: 3, 21: 3, 22: 3 },
                    // },
                    {
                        name: 'player',
                        constructor: TestPlayer,
                        x: 400, y: 400,
                        layer: 'main',
                        physicsGroup: 'player',
                        children: [
                            {
                                constructor: Sprite,
                                texture: 'debug',
                                x: 0, y: 0,
                                bounds: { x: 0, y: 0, width: 16, height: 16 },
                                physicsGroup: 'player'
                            }
                        ]
                    }
                ]
            }},
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
                x: global.gameWidth/2, y: global.gameHeight - 32,
                texture: 'dialogbox',
                spriteTextFont: Assets.fonts.DELUXE16,
                textAreaFull: { x: -122, y: -27, width: 244, height: 54 },
                textAreaPortrait: { x: -122, y: -27, width: 174, height: 54 },
                portraitPosition: { x: 86, y: 0 },
                advanceKey: 'advanceDialog',
            },
            skipCutsceneScriptKey: 'skipCutsceneScript',
            debugMousePositionFont: Assets.fonts.DELUXE16,
        });
    }

    render(screen: Texture) {
        super.render(screen);
    }
}