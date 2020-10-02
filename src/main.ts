/// <reference path="./menus.ts"/>

Main.loadConfig({
    gameCodeName: "PlatformerTest",
    gameWidth: 960,
    gameHeight: 800,
    canvasScale: 1,
    backgroundColor: 0x000000,

    preloadBackgroundColor: 0x000000,
    preloadProgressBarColor: 0xFFFFFF,

    textures: Assets.textures,
    sounds: Assets.sounds,
    pyxelTilemaps: Assets.pyxelTilemaps,
    spriteTextTags: Assets.spriteTextTags,

    defaultOptions: {
        volume: 1,
        controls: {
            // Game
            'left':                      ['ArrowLeft', 'a'],
            'right':                     ['ArrowRight', 'd'],
            'up':                        ['ArrowUp', 'w', ' '],
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
        }
    },

    game: {
        entryPointMenuClass: MainMenu,
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
            dialogBox: {
                constructor: DialogBox,
                x: global.gameWidth/2, y: global.gameHeight - 32,
                texture: 'none',
                spriteTextFont: Assets.fonts.DELUXE16,
                textAreaFull: { x: -114, y: -27, width: 228, height: 54 },
                textAreaPortrait: { x: -114, y: -27, width: 158, height: 54 },
                portraitPosition: { x: 78, y: 0 },
            },
        },
    },

    debug: {
        debug: true,
        font: Assets.fonts.DELUXE16,
        fontStyle: { color: 0x008800 },
        cheatsEnabled: true,
        allPhysicsBounds: false,
        moveCameraWithArrows: true,
        showOverlay: true,
        skipRate: 1,
        programmaticInput: false,
        autoplay: true,
        skipMainMenu: true,
        frameStepEnabled: false,
        frameStepStepKey: '1',
        frameStepRunKey: '2',
        resetOptionsAtStart: true,
    },
});

function get(name: string) {
    let worldObject = global.game.theater.currentWorld.select.name(name);
    if (worldObject) return worldObject;
    return undefined;
}