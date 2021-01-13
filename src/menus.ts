/// <reference path="../lectvs/menu/menu.ts" />

class IntroMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem);
        
        this.backgroundColor = 0x000000;

        let introtext = this.addWorldObject(new SpriteText({
            x: global.gameWidth/2, y: global.gameHeight/2,
            text: "- a game by hayden mccraw -",
            anchor: Anchor.CENTER
        }));

        this.runScript(S.chain(
            S.wait(1.5),
            S.call(() => introtext.setText("- made in 48 hours\n  for ludum dare 47 -")),
            S.wait(1.5),
            S.call(() => menuSystem.loadMenu(MainMenu)),
        ));
    }
}

class MainMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem);

        this.backgroundColor = 0x000000;
        this.volume = 0;

        this.addWorldObject(new SpriteText({
            x: 20, y: 20,
            text: "- HOOP KNIGHT -"
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 50,
            text: "play normal mode",
            onClick: () => {
                HARD_DIFFICULTY = false;
                menuSystem.game.playSound('click');
                menuSystem.game.startGame();
            }
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 68,
            text: "play hard mode (no health regen)",
            onClick: () => {
                HARD_DIFFICULTY = true;
                menuSystem.game.playSound('click');
                menuSystem.game.startGame();
            }
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 100,
            text: "controls",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.loadMenu(ControlsMenu);
            }
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 132,
            text: "options",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.loadMenu(OptionsMenu);
            }
        }));

        this.addWorldObject(new SpriteText({
            x: 100, y: 100,
            text: "<-- read me!",
            style: { color: 0xFFFF00 }
        }));
    }
}

class PauseMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem);

        this.backgroundColor = 0x000000;
        this.volume = 0;

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
            x: 20, y: 80,
            text: "skip current cutscene",
            onClick: () => {
                this.menuSystem.game.playSound('click');
                menuSystem.game.unpauseGame();
                global.theater.skipCurrentCutscene();
            }
        }));

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
        super(menuSystem);

        this.backgroundColor = 0x000000;
        this.volume = 0;

        this.addWorldObject(new SpriteText({
            x: 20, y: 20,
            text: "- options -"
        }));

        this.addWorldObject(new SpriteText({
            x: 20, y: 50,
            text: "volume:"
        }));

        this.addWorldObject(new MenuNumericSelector({
            x: 84, y: 50,
            barLength: 10,
            minValue: 0,
            maxValue: 1,
            getValue: () => Options.getOption('volume'),
            setValue: v => Options.updateOption('volume', v)
        }));

        this.addWorldObject(new SpriteText({
            x: 20, y: 74,
            text: "toggle fullscreen - F"
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 114,
            text: "debug",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.loadMenu(DebugOptionsMenu);
            }
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 144,
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
        super(menuSystem);

        this.backgroundColor = 0x000000;
        this.volume = 0;

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
            layers: [
                { name: 'bg' }
            ]
        });

        this.backgroundColor = 0x000000;
        this.volume = 0;

        this.addWorldObject(new SpriteText({
            x: 20, y: 15,
            text: "- controls -"
        }));

        this.addWorldObject(new SpriteText({
            x: 20, y: 42,
            text: "WASD or ARROW KEYS - move"
        }));

        this.addWorldObject(new SpriteText({
            x: 20, y: 66,
            text: "F - toggle fullscreen"
        }));

        this.addWorldObject(new SpriteText({
            x: 20, y: 90,
            text: "swing the hoop faster\nto deal more damage!"
        }));

        let player = this.addWorldObject(new Player({
            x: 250, y: 180,
            effects: { outline: { color: 0xFFFFFF } }
        }));
        player.behavior = new NullBehavior();

        this.addWorldObject(new Hoop({
            x: 240, y: 180
        }));

        this.addWorldObject(new MenuTextButton({
            x: 20, y: 240,
            text: "back",
            onClick: () => {
                menuSystem.game.playSound('click');
                menuSystem.back();
            }
        }));

        this.runScript(S.chain(
            S.loopFor(2, S.chain(
                S.doOverTime(0.4, t => { player.controller.right = true; }),
                S.doOverTime(0.4, t => { player.controller.down = true; }),
                S.doOverTime(0.4, t => { player.controller.left = true; }),
                S.doOverTime(0.4, t => { player.controller.up = true; }),
            )),
            S.loopFor(Infinity, S.chain(
                S.doOverTime(0.2, t => { player.controller.right = true; }),
                S.doOverTime(0.2, t => { player.controller.down = true; }),
                S.doOverTime(0.2, t => { player.controller.left = true; }),
                S.doOverTime(0.2, t => { player.controller.up = true; }),
            )),
        ))
    }
}

