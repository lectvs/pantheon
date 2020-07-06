function getStages(): Dict<World.Config> { return {

    'game': {
        parent: BASE_STAGE(),
        camera: {
            movement: { type: 'snap' },
            mode: Camera.Mode.FOCUS(Main.width/2, Main.height/2),
        },
        entryPoints: {
            'main': { x: Main.width/2, y: Main.height/2 },
        },
        worldObjects: [
            
        ]
    },
}}