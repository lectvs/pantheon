/// <reference path="../lectvs/menu/menu.ts" />

class MainMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            parent: MENU_BASE_STAGE(),
            worldObjects: [
                <SpriteText.Config>{
                    constructor: SpriteText,
                    x: 20, y: 20, text: "- platformer test -",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                <MenuTextButton.Config>{
                    constructor: MenuTextButton,
                    x: 20, y: 50, text: "start",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    onClick: () => {
                        this.menuSystem.game.playSound('click');
                        menuSystem.game.startGame();
                    },
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
                <SpriteText.Config>{
                    constructor: SpriteText,
                    x: 20, y: 80, text: "JUMP:",
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                },
                <MenuControlMapper.Config>{
                    constructor: MenuControlMapper,
                    x: 68, y: 80,
                    font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                    controlName: 'up',
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
