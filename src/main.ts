/// <reference path="./menus.ts"/>
/// <reference path="./stages.ts"/>
/// <reference path="./storyboard.ts"/>

Main.loadConfig({
    gameCodeName: "mirigram",
    gameWidth: 400,
    gameHeight: 320,
    canvasScale: 2,
    backgroundColor: 0x000000,
    fpsLimit: 30,

    preloadBackgroundColor: 0x000000,
    preloadProgressBarColor: 0xFFFFFF,

    textures: Assets.textures,
    sounds: Assets.sounds,
    tilesets: Assets.tilesets,
    pyxelTilemaps: Assets.pyxelTilemaps,
    fonts: Assets.fonts,
    spriteTextTags: Assets.spriteTextTags,

    defaultZBehavior: 'noop',
    defaultSpriteTextFont: 'andrfw',

    defaultOptions: {
        volume: 0.5,
        controls: {
            // General
            'fullscreen':                ['f'],

            // Game
            'left':                      ['ArrowLeft'],
            'right':                     ['ArrowRight'],
            'up':                        ['ArrowUp'],
            'down':                      ['ArrowDown'],
            'jump':                      ['z'],
            'interact':                  ['x'],

            // Presets
            'game_advanceCutscene':      ['x', 'z'],
            'game_pause':                [],
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
        entryPointMenuClass: MainMenu,
        pauseMenuClass: PauseMenu,
        theaterConfig: {
            stages: stages,
            stageToLoad: 'game',
            dialogBox: () => new DialogBox({
                x: 200, y: 280,
                texture: 'dialogbox',
                dialogFont: 'andrfw',
                textAreaFull: { x: -186, y: -30, width: 372, height: 64 },
                textAreaPortrait: { x: -70, y: -42, width: 140, height: 84 },
                portraitPosition: { x: 78, y: 0 },
                //startSound: 'click',
                speakSound: 'dialogspeak',
                nameProps: {
                    texture: 'dialogbox_name',
                    position: { x: -150, y: -40 },
                    textOffset: { x: 0, y: -2 },
                }
            }),
        },
    },

    debug: {
        debug: false,
        font: 'andrfw',
        fontStyle: { color: 0xFFFFFF },
        allPhysicsBounds: false,
        moveCameraWithArrows: true,
        showOverlay: true,
        overlayFeeds: [
            world => {
                let cc = world.select.type(CameraController, false);
                if (!cc) return '';
                return `sec: ${cc.sector.x} ${cc.sector.y}`;
            },
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
