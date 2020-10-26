/// <reference path="../lectvs/menu/menu.ts" />

class IntroMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem);
        
        this.backgroundColor = 0x000000;

        let introtext = this.addWorldObject(new SpriteText(Assets.fonts.DELUXE16));
        introtext.setText("- a game by hayden mccraw -");

        introtext.x = global.gameWidth/2 - introtext.getTextWidth()/2;
        introtext.y = global.gameHeight/2 - introtext.getTextHeight()/2;

        this.runScript(S.chain(
            S.wait(1.5),
            S.call(() => {
                introtext.setText("- made in 48 hours\n  for ludum dare 47 -");
                introtext.x = global.gameWidth/2 - introtext.getTextWidth()/2;
                introtext.y = global.gameHeight/2 - introtext.getTextHeight()/2;
            }),
            S.wait(1.5),
            S.call(() => { menuSystem.loadMenu(MainMenu); }),
        ));
    }
}

class MainMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem);

        this.backgroundColor = 0x000000;
        this.volume = 0;

        let titleText = this.addWorldObject(new SpriteText(Assets.fonts.DELUXE16));
        titleText.x = 20;
        titleText.y = 20;
        titleText.setText("- HOOP KNIGHT -");

        let normalModeButton = this.addWorldObject(new MenuTextButton({
            font: Assets.fonts.DELUXE16,
            onClick: () => {
                HARD_DIFFICULTY = false;
                this.menuSystem.game.playSound('click');
                menuSystem.game.startGame();
            }
        }));
        normalModeButton.x = 20;
        normalModeButton.y = 50;
        normalModeButton.setText("play normal mode");

        let hardModeButton = this.addWorldObject(new MenuTextButton({
            font: Assets.fonts.DELUXE16,
            onClick: () => {
                HARD_DIFFICULTY = true;
                this.menuSystem.game.playSound('click');
                menuSystem.game.startGame();
            }
        }));
        hardModeButton.x = 20;
        hardModeButton.y = 68;
        hardModeButton.setText("play hard mode (no health regen)");

        let controlsButton = this.addWorldObject(new MenuTextButton({
            font: Assets.fonts.DELUXE16,
            onClick: () => {
                this.menuSystem.game.playSound('click');
                menuSystem.loadMenu(ControlsMenu);
            }
        }));
        controlsButton.x = 20;
        controlsButton.y = 100;
        controlsButton.setText("controls");

        let readMeText = this.addWorldObject(new SpriteText(Assets.fonts.DELUXE16));
        readMeText.x = 100;
        readMeText.y = 100;
        readMeText.style.color = 0xFFFF00;
        readMeText.setText("<-- read me!");
    }
}

class PauseMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem);

        this.backgroundColor = 0x000000;
        this.volume = 0;

        let pausedText = this.addWorldObject(new SpriteText(Assets.fonts.DELUXE16));
        pausedText.x = 20;
        pausedText.y = 20;
        pausedText.setText("- paused -");

        let resumeButton = this.addWorldObject(new MenuTextButton({
            font: Assets.fonts.DELUXE16,
            onClick: () => {
                this.menuSystem.game.playSound('click');
                menuSystem.game.unpauseGame();
            }
        }));
        resumeButton.x = 20;
        resumeButton.y = 50;
        resumeButton.setText("resume");

        let optionsButton = this.addWorldObject(new MenuTextButton({
            font: Assets.fonts.DELUXE16,
            onClick: () => {
                this.menuSystem.game.playSound('click');
                menuSystem.loadMenu(OptionsMenu);
            }
        }));
        optionsButton.x = 20;
        optionsButton.y = 80;
        optionsButton.setText("options");
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

        let optionsText = this.addWorldObject(new SpriteText(Assets.fonts.DELUXE16));
        optionsText.x = 20;
        optionsText.y = 20;
        optionsText.setText("- options -");

        let volumeText = this.addWorldObject(new SpriteText(Assets.fonts.DELUXE16));
        volumeText.x = 20;
        volumeText.y = 50;
        volumeText.setText("volume:");

        let volumeSelector = this.addWorldObject(new MenuNumericSelector({
            font: Assets.fonts.DELUXE16,
            barLength: 10,
            minValue: 0,
            maxValue: 1,
            getValue: () => Options.getOption('volume'),
            setValue: v => Options.updateOption('volume', v)
        }));
        volumeSelector.x = 84;
        volumeSelector.y = 50;

        let backButton = this.addWorldObject(new MenuTextButton({
            font: Assets.fonts.DELUXE16,
            onClick: () => {
                this.menuSystem.game.playSound('click');
                menuSystem.back();
            }
        }));
        backButton.x = 20;
        backButton.y = 110;
        backButton.setText("back");
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
        super(menuSystem);

        this.backgroundColor = 0x000000;
        this.volume = 0;

        let controlsText = this.addWorldObject(new SpriteText(Assets.fonts.DELUXE16));
        controlsText.x = 20;
        controlsText.y = 15;
        controlsText.setText("- controls -");

        let wasdText = this.addWorldObject(new SpriteText(Assets.fonts.DELUXE16));
        wasdText.x = 20;
        wasdText.y = 42;
        wasdText.setText("WASD or ARROW KEYS - move\n\nswing the hoop faster to deal more damage!");

        let player = this.addWorldObject(new Player());
        player.x = 250;
        player.y = 180;
        player.effects.updateFromConfig({
            outline: { color: 0xFFFFFF }
        });

        let hoop = this.addWorldObject(new Hoop());
        hoop.x = 240;
        hoop.y = 180;

        let backButton = this.addWorldObject(new MenuTextButton({
            font: Assets.fonts.DELUXE16,
            onClick: () => {
                this.menuSystem.game.playSound('click');
                menuSystem.back();
            }
        }));
        backButton.x = 20;
        backButton.y = 240;
        backButton.setText("back");


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
