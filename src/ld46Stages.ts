/// <reference path="base.ts" />
/// <reference path="main.ts" />

const stages: Dict<Stage> = {

    'game': {
        parent: BASE_STAGE,
        camera: {
            bounds: { left: 0, top: 0, right: Main.width, bottom: Main.height },
            mode: Camera.Mode.FOCUS(Main.width/2, Main.height/2),
        },
        entryPoints: {
            'main': { x: Main.width/2, y: Main.height/2 },
        },
        worldObjects: [
            WORLD_BOUNDS(0, 0, Main.width, Main.height),
        ]
    },
}