/// <reference path="../lectvs/menu/menu.ts" />

class IntroMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
        });
        
        let introtext = this.addWorldObject(new SpriteText({
            x: global.gameWidth/2, y: global.gameHeight/2,
            text: "- a game by\nhayden mccraw -",
            anchor: Vector2.CENTER
        }));

        this.runScript(S.chain(
            S.wait(1.5),
            S.call(() => introtext.setText("- originally made\n   in 48 hours\nfor ludum dare 48 -")),
            S.wait(1.5),
            S.call(() => menuSystem.loadMenu(MainMenu)),
        ));
    }
}

class MainMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
            volume: 0,
        });

        this.addWorldObject(new SpriteText({
            x: 20, y: 20,
            text: "- GRAPPLE THE\nABYSS! -"
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 65,
            text: "play",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.game.startGame();
            }
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 155,
            text: "controls\n  [g]^ read me! :)[/g]",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.loadMenu(ControlsMenu);
            }
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 200,
            text: "options",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.loadMenu(OptionsMenu);
            }
        }));
    }
}

class PauseMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
            volume: 0,
        });

        this.addWorldObject(new SpriteText({
            x: 20, y: 20,
            text: "- paused -"
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 50,
            text: "resume",
            onClick: () => {
                this.menuSystem.game.playSound('click');
                menuSystem.game.unpauseGame();
            }
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 70,
            text: "main menu",
            onClick: () => {
                this.menuSystem.game.playSound('click');
                menuSystem.game.menuSystem.loadMenu(MainMenu);
            }
        }));

        // this.addWorldObject(new MenuTextButton({
        //     x: 20, y: 80,
        //     text: "skip current cutscene",
        //     onClick: () => {
        //         this.menuSystem.game.playSound('click');
        //         menuSystem.game.unpauseGame();
        //         global.theater.skipCurrentCutscene();
        //     }
        // }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 110,
            text: "options",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.loadMenu(OptionsMenu);
            }
        }));
    }

    update() {
        super.update();

        if (Input.justDown(Input.GAME_PAUSE)) {
            Input.consume(Input.GAME_PAUSE);
            this.menuSystem.game.unpauseGame();
        }
    }
}

class OptionsMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
            volume: 0,
        });

        this.addWorldObject(new SpriteText({
            x: 20, y: 20,
            text: "- options -"
        }));

        this.addWorldObject(new SpriteText({
            x: 20, y: 50,
            text: "volume:"
        }));

        this.addWorldObject(new MenuNumericSelector({
            x: 20, y: 66,
            barLength: 10,
            minValue: 0,
            maxValue: 1,
            getValue: () => Options.getOption('volume'),
            setValue: v => Options.updateOption('volume', v)
        }));

        this.addWorldObject(new SpriteText({
            x: 20, y: 90,
            text: "toggle fullscreen\n with F"
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 130,
            text: "debug",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.loadMenu(DebugOptionsMenu);
            }
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 170,
            text: "back",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.back();
            }
        }));
    }

    update() {
        super.update();

        if (Input.justDown(Input.GAME_CLOSE_MENU)) {
            Input.consume(Input.GAME_CLOSE_MENU);
            this.menuSystem.back();
        }
    }
}

class DebugOptionsMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
            volume: 0,
        });

        this.addWorldObject(new SpriteText({
            x: 20, y: 20,
            text: "- debug options -"
        }));

        let getDebugText = () => "debug overlay: " + (Debug.SHOW_OVERLAY ? "ON" : "OFF");
        let debugOverlayButton = this.addWorldObject(new MenuTextButton({
            x: 20, y: 50,
            text: getDebugText(),
            onClick: () => {
                Debug.SHOW_OVERLAY = !Debug.SHOW_OVERLAY;
                debugOverlayButton.setText(getDebugText());
            }
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 110,
            text: "back",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.back();
            }
        }));
    }

    update() {
        super.update();

        if (Input.justDown(Input.GAME_CLOSE_MENU)) {
            Input.consume(Input.GAME_CLOSE_MENU);
            this.menuSystem.back();
        }
    }
}

class ControlsMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
            layers: [
                { name: 'bg' },
                { name: 'entities' },
                { name: 'player' },
                { name: 'walls' },
            ],
            physicsGroups: {
                'player': {},
                'walls': { immovable: true },
            },
            collisions: [
                { move: 'player', from: 'walls' },
            ],
            collisionIterations: 4,
            useRaycastDisplacementThreshold: Infinity,
            maxDistancePerCollisionStep: 16,
        });

        this.addWorldObject(new Sprite({
            x: 0, y: 0,
            texture: Texture.filledRect(16, global.gameHeight, 0x000000),
            layer: 'walls',
            physicsGroup: 'walls',
            bounds: new RectBounds(0, 0, 16, global.gameHeight)
        }));
        this.addWorldObject(new Sprite({
            x: 0, y: 0,
            texture: Texture.filledRect(global.gameWidth, 16, 0x000000),
            layer: 'walls',
            physicsGroup: 'walls',
            bounds: new RectBounds(0, 0, global.gameWidth, 16)
        }));
        this.addWorldObject(new Sprite({
            x: global.gameWidth-16, y: 0,
            texture: Texture.filledRect(16, global.gameHeight, 0x000000),
            layer: 'walls',
            physicsGroup: 'walls',
            bounds: new RectBounds(0, 0, 16, global.gameHeight)
        }));
        this.addWorldObject(new Sprite({
            x: 0, y: global.gameHeight-16,
            texture: Texture.filledRect(global.gameWidth, 16, 0x000000),
            layer: 'walls',
            physicsGroup: 'walls',
            bounds: new RectBounds(0, 0, global.gameWidth, 16)
        }));
        this.addWorldObject(new Sprite({
            x: 15, y: 15,
            texture: Texture.outlineRect(global.gameWidth-30, global.gameHeight-30, 0xFFFFFF),
        }))


        this.addWorldObject(new SpriteText({
            x: 30, y: 24,
            text: "controls:"
        }));

        this.addWorldObject(new SpriteText({
            x: 30, y: 60,
            text: "WASD/ARROWS\n to grapple"
        }));

        this.addWorldObject(new SpriteText({
            x: 36, y: 170,
            text: "try it :)\n|"
        }));
        this.addWorldObject(new SpriteText({
            x: 36, y: 172,
            text: "\nv"
        }));


        this.addWorldObject(new MenuTextButton({
            x: 16, y: 226,
            text: "back",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.back();
            }
        }));
    }

    update() {
        super.update();

        if (Input.justDown(Input.GAME_CLOSE_MENU)) {
            Input.consume(Input.GAME_CLOSE_MENU);
            this.menuSystem.back();
        }
    }
}

