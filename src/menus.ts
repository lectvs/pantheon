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
                }
            ]
        });
    }

    update(delta: number) {
        super.update(delta);

        if (Input.justDown(Input.GAME_PAUSE)) {
            Input.consume(Input.GAME_PAUSE);
            this.menuSystem.game.unpauseGame();
        }
    }
}
