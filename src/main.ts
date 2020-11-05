/// <reference path="./menus.ts"/>

Main.loadConfig({
    gameCodeName: "HoopKnight",
    gameWidth: 400,
    gameHeight: 300,
    canvasScale: 2,
    backgroundColor: 0x000000,

    preloadBackgroundColor: 0x000000,
    preloadProgressBarColor: 0xFFFFFF,

    textures: Assets.textures,
    sounds: Assets.sounds,
    pyxelTilemaps: Assets.pyxelTilemaps,
    spriteTextTags: Assets.spriteTextTags,

    defaultZBehavior: 'threequarters',
    defaultSpriteTextFont: Assets.fonts.DELUXE16,

    defaultOptions: {
        volume: 1,
        controls: {
            // Game
            'left':                      ['ArrowLeft', 'a'],
            'right':                     ['ArrowRight', 'd'],
            'up':                        ['ArrowUp', 'w'],
            'down':                      ['ArrowDown', 's'],
            'interact':                  ['e'],

            // Presets
            'game_advanceDialog':        ['MouseLeft', 'e', ' '],
            'game_pause':                ['Escape', 'Backspace'],
            'game_closeMenu':            ['Escape', 'Backspace'],
            'game_select':               ['MouseLeft'],

            'debug_moveCameraUp':        ['i'],
            'debug_moveCameraDown':      ['k'],
            'debug_moveCameraLeft':      ['j'],
            'debug_moveCameraRight':     ['l'],
            'debug_recordMetrics':       ['0'],
            'debug_showMetricsMenu':     ['9'],
            'debug_toggleOverlay':       ['o'],

            // Debug
            '1':                         ['1'],
            '2':                         ['2'],
            '3':                         ['3'],
            '4':                         ['4'],
            '5':                         ['5'],
            '6':                         ['6'],
            '7':                         ['7'],
            '8':                         ['8'],
            '9':                         ['9'],
            '0':                         ['0'],
            'lmb':                       ['MouseLeft'],
            'rmb':                       ['MouseRight'],
        }
    },

    game: {
        entryPointMenuClass: IntroMenu,
        pauseMenuClass: PauseMenu,
        theaterConfig: {
            getStages: getStages,
            stageToLoad: 'game',
            stageEntryPoint: 'main',
            story: {
                getStoryboard: getStoryboard,
                storyboardPath: ['start'],
                getStoryEvents: getStoryEvents,
                getStoryConfig: getStoryConfig,
            },
            getParty: getParty,
            dialogBox: () => {
                let dialogBox = new DialogBox({
                    dialogFont: Assets.fonts.DELUXE16,
                    textAreaFull: { x: -192, y: -42, width: 384, height: 84 },
                    textAreaPortrait: { x: -200, y: -50, width: 400, height: 100 },
                    portraitPosition: { x: 78, y: 0 },
                    startSound: 'click',
                });
                dialogBox.x = 200;
                dialogBox.y = 250;
                dialogBox.setTexture('dialogbox');
                dialogBox.ignoreCamera = true;
                return dialogBox;
            },
        },
    },

    debug: {
        debug: true,
        font: Assets.fonts.DELUXE16,
        fontStyle: { color: 0xFFFFFF },
        cheatsEnabled: true,
        allPhysicsBounds: false,
        moveCameraWithArrows: true,
        showOverlay: true,
        overlayFeeds: [],
        skipRate: 10,
        programmaticInput: false,
        autoplay: true,
        skipMainMenu: true,
        frameStepEnabled: false,
        frameStepStepKey: '1',
        frameStepRunKey: '2',
        resetOptionsAtStart: true,
        experiments: {},
    },
});

function get(name: string) {
    let worldObject = global.game.theater.currentWorld.select.name(name);
    if (worldObject) return worldObject;
    return undefined;
}

var HARD_DIFFICULTY: boolean = false;