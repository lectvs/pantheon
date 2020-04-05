/// <reference path="./menu.ts" />

class MainMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
        }, [
            new MenuTextButton({
                x: 20, y: 20, text: "start game",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: () => menuSystem.game.startGame(),
            }),
            new MenuTextButton({
                x: 20, y: 35, text: "options",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: () => menuSystem.loadMenu(OptionsMenu),
            }),
        ]);
    }
}

class OptionsMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
        }, [
            new MenuTextButton({
                x: 20, y: 20, text: "back",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: () => menuSystem.back(),
            }),
        ]);
    }
}

class PauseMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
        }, [
            new MenuTextButton({
                x: 20, y: 20, text: "resume",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: () => menuSystem.game.unpauseGame(),
            }),
        ]);
    }
}