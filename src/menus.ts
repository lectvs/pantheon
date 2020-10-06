/// <reference path="../lectvs/menu/menu.ts" />

class IntroMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
        }, [
            new SpriteText({
                name: 'introtext',
                x: 20, y: 80, text: "- a game by hayden mccraw -",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
            }),
        ]);

        let introtext = this.select.name<SpriteText>('introtext');
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
        super(menuSystem, {
            parent: MENU_BASE_STAGE(),
            worldObjects: [
                <SpriteText.Config>{
                    constructor: SpriteText,
                    x: 20, y: 20, text: "- HOOP KNIGHT -",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                <MenuTextButton.Config>{
                    constructor: MenuTextButton,
                    x: 20, y: 50, text: "play normal mode",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: () => {
                        HARD_DIFFICULTY = false;
                        this.menuSystem.game.playSound('click');
                        menuSystem.game.startGame();
                    },
                },
                <MenuTextButton.Config>{
                    constructor: MenuTextButton,
                    x: 20, y: 68, text: "play hard mode (no health regen)",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: () => {
                        HARD_DIFFICULTY = true;
                        this.menuSystem.game.playSound('click');
                        menuSystem.game.startGame();
                    },
                },
                <MenuTextButton.Config>{
                    constructor: MenuTextButton,
                    x: 20, y: 100, text: "controls",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: () => {
                        this.menuSystem.game.playSound('click');
                        menuSystem.loadMenu(ControlsMenu);
                    },
                },
                <SpriteText.Config>{
                    constructor: SpriteText,
                    x: 100, y: 100, text: "<-- read me!",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFF00 },
                },
            ]
        });
    }
}

class PauseMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            parent: MENU_BASE_STAGE(),
            worldObjects: [
                <SpriteText.Config>{
                    constructor: SpriteText,
                    x: 20, y: 20, text: "- paused -",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                <MenuTextButton.Config>{
                    constructor: MenuTextButton,
                    x: 20, y: 50, text: "resume",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: () => {
                        this.menuSystem.game.playSound('click');
                        menuSystem.game.unpauseGame();
                    },
                },
                <MenuTextButton.Config>{
                    constructor: MenuTextButton,
                    x: 20, y: 80, text: "options",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: () => {
                        this.menuSystem.game.playSound('click');
                        menuSystem.loadMenu(OptionsMenu);
                    },
                },
            ]
        });
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
            parent: MENU_BASE_STAGE(),
            worldObjects: [
                <SpriteText.Config>{
                    constructor: SpriteText,
                    x: 20, y: 20, text: "- options -",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                <SpriteText.Config>{
                    constructor: SpriteText,
                    x: 20, y: 50, text: "volume:",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                <MenuNumericSelector.Config>{
                    constructor: MenuNumericSelector,
                    x: 84, y: 50,
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    barLength: 10,
                    minValue: 0,
                    maxValue: 1,
                    getValue: () => Options.getOption('volume'),
                    setValue: v => Options.updateOption('volume', v),
                },
                <MenuTextButton.Config>{
                    constructor: MenuTextButton,
                    x: 20, y: 110, text: "back",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: () => {
                        this.menuSystem.game.playSound('click');
                        menuSystem.back();
                    },
                },
            ]
        });
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
            parent: MENU_BASE_STAGE(),
            physicsGroups: { 'items': {} },
            worldObjects: [
                <SpriteText.Config>{
                    constructor: SpriteText,
                    x: 20, y: 15, text: "controls",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                <SpriteText.Config>{
                    constructor: SpriteText,
                    x: 20, y: 42, text: "WASD or ARROW KEYS - move\n\nswing the hoop faster to deal more damage!",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                <Sprite.Config>{
                    constructor: Player,
                    x: 250, y: 180,
                    effects: { outline: { color: 0xFFFFFF } },
                },
                <Sprite.Config>{
                    constructor: Hoop,
                    x: 240, y: 180,
                },
                <MenuTextButton.Config>{
                    constructor: MenuTextButton,
                    x: 20, y: 240, text: "back",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: () => {
                        this.menuSystem.game.playSound('click');
                        menuSystem.back();
                    },
                },
            ]
        });

        let player = this.select.type(Player);

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
