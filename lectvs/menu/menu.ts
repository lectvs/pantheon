/// <reference path="../world/world.ts" />

namespace Menu {
    export type MenuClass = new (menuSystem: MenuSystem) => Menu;
}

class Menu extends World {
    menuSystem: MenuSystem;

    constructor(menuSystem: MenuSystem) {
        super();
        this.menuSystem = menuSystem;
    }
}

class MetricsMenu extends Menu {
    private plot: MetricsPlot.Plot;

    constructor(menuSystem: MenuSystem) {
        super(menuSystem);

        this.backgroundColor = 0x000000;

        this.plot = global.metrics.plotLastRecording();
        
        let plotSprite = this.addWorldObject(new Sprite());
        plotSprite.setTexture(this.plot.texture);

        let graphxy = this.addWorldObject(new SpriteText(Debug.FONT), {
            name: 'graphxy'
        });
        graphxy.style.color = 0x00FF00;
    }

    update() {
        super.update();

        if (Input.justDown(Input.GAME_CLOSE_MENU)) {
            Input.consume(Input.GAME_CLOSE_MENU);
            this.menuSystem.game.unpauseGame();
        }

        this.select.name<SpriteText>('graphxy')
                .setText(`${this.getPlotY().toFixed(2)} ms`);
    }

    private getPlotX() {
        return this.plot.graphBounds.left + Input.mouseX / global.gameWidth * (this.plot.graphBounds.right - this.plot.graphBounds.left);
    }

    private getPlotY() {
        return this.plot.graphBounds.bottom + (1 - Input.mouseY / global.gameHeight) * (this.plot.graphBounds.top - this.plot.graphBounds.bottom);
    }
}