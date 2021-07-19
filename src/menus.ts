/// <reference path="../lectvs/menu/menu.ts" />

class MainMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
            volume: 0,
        });

        this.addWorldObject(new Sprite({
            texture: 'titlescreen',
        }));

        let title = new BasicTexture(200, 160);
        new SpriteText({
            text: 'On\nUndermining.',
        }).render(title, 15, 40);
        this.addWorldObject(new Sprite({
            texture: title,
            scaleX: 2,
            scaleY: 2,
        }));

        this.addWorldObject(new SpriteText({
            x: 30, y: 160,
            text: 'A Sequel to a Game by Andrfw',
        }));

        this.addWorldObject(new SpriteText({
            x: 30, y: 184,
            text: 'By lectvs',
        }));

        this.addWorldObject(new SpriteText({
            x: 30, y: 240,
            text: 'Click to Start',
        }));
    }

    update() {
        super.update();

        if (Input.justDown('game_select')) {
            Input.consume('game_select');
            this.menuSystem.game.startGame();
        }
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
