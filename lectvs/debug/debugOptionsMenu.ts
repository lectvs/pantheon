/// <reference path="../menu/menu.ts" />

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