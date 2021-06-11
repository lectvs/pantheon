/// <reference path="./menus.ts"/>
/// <reference path="./stages.ts"/>
/// <reference path="./storyboard.ts"/>

Main.loadConfig({
    gameCodeName: "LD48",
    gameWidth: 160,
    gameHeight: 240,
    canvasScale: 4,
    backgroundColor: 0x000000,
    fpsLimit: 30,

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
            stages: stages,
            stageToLoad: 'game',
            stageEntryPoint: 'main',
            story: {
                storyboard: storyboard,
                storyboardPath: ['start'],
                storyEvents: {},
            },
            dialogBox: () => new DialogBox({
                x: 80, y: 50,
                texture: 'dialogbox',
                dialogFont: Assets.fonts.DELUXE16,
                textAreaFull: { x: -70, y: -42, width: 140, height: 84 },
                textAreaPortrait: { x: -70, y: -42, width: 140, height: 84 },
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
        overlayFeeds: [
            (world: World) => `t: ${Math.floor(world.getWorldMouseX()/16)}, ${Math.floor(world.getWorldMouseY()/16)}`
        ],
        skipRate: 1,
        programmaticInput: false,
        autoplay: true,
        skipMainMenu: true,
        frameStepEnabled: false,
        resetOptionsAtStart: true,
        experiments: {},
    },
});
