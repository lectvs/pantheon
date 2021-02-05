/// <reference path="./menus.ts"/>

Main.loadConfig({
    gameCodeName: "SilverBullet",
    gameWidth: 320,
    gameHeight: 240,
    canvasScale: 4,
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
            // General
            'fullscreen':                ['f', 'g'],

            // Game
            'left':                      ['ArrowLeft', 'a'],
            'right':                     ['ArrowRight', 'd'],
            'up':                        ['ArrowUp', 'w'],
            'down':                      ['ArrowDown', 's'],
            'interact':                  ['e'],

            // Presets
            'game_advanceCutscene':      ['MouseLeft', 'e', ' '],
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
            'debug_frameSkipStep':       ['1'],
            'debug_frameSkipRun':        ['2'],

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
                getStoryEvents: () => ({}),
            },
            dialogBox: () => new DialogBox({
                x: 200, y: 250,
                texture: 'dialogbox',
                dialogFont: Assets.fonts.DELUXE16,
                textAreaFull: { x: -192, y: -42, width: 384, height: 84 },
                textAreaPortrait: { x: -192, y: -42, width: 384, height: 84 },
                portraitPosition: { x: 78, y: 0 },
                startSound: 'click',
                speakSound: 'dialogspeak'
            }),
        },
    },

    debug: {
        debug: true,
        font: Assets.fonts.DELUXE16,
        fontStyle: { color: 0xFFFFFF },
        allPhysicsBounds: false,
        moveCameraWithArrows: true,
        showOverlay: true,
        overlayFeeds: [],
        skipRate: 1,
        programmaticInput: false,
        autoplay: true,
        skipMainMenu: true,
        frameStepEnabled: false,
        resetOptionsAtStart: true,
        experiments: {},
    },
});
