/// <reference path="./world.ts" />

class Menu extends World {
    menuSystem: MenuSystem;

    constructor(menuSystem: MenuSystem, config: World.Config = {}, items?: WorldObject[]) {
        super(config);
        this.menuSystem = menuSystem;
        World.Actions.addWorldObjectsToWorld(items, this);
    }
}

class MetricsMenu extends Menu {
    private plot: MetricsPlot.Plot;

    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
            worldObjects: [
            ]
        });

        this.plot = global.metrics.plotLastRecording();
        this.addWorldObject(<Sprite.Config>{
            constructor: Sprite,
            texture: this.plot.texture,
        });
        this.addWorldObject(<SpriteText.Config>{
            name: 'graphxy',
            constructor: SpriteText,
            font: Assets.fonts.DELUXE16,
            style: { color: 0x00FF00 },
        });
    }

    update(delta: number) {
        super.update(delta);

        if (Input.justDown('pause')) {
            this.menuSystem.game.unpauseGame();
        }

        this.getWorldObjectByName<SpriteText>('graphxy')
                .setText(`${this.getPlotY().toFixed(2)} ms`);
    }

    private getPlotX() {
        return this.plot.graphBounds.left + Input.mouseX / global.gameWidth * (this.plot.graphBounds.right - this.plot.graphBounds.left);
    }

    private getPlotY() {
        return this.plot.graphBounds.bottom + (1 - Input.mouseY / global.gameHeight) * (this.plot.graphBounds.top - this.plot.graphBounds.bottom);
    }
}