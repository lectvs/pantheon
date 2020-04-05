/// <reference path="./world.ts" />

class Menu extends World {
    menuSystem: MenuSystem;

    constructor(menuSystem: MenuSystem, config: World.Config = {}, items?: WorldObject[]) {
        super(config);
        this.menuSystem = menuSystem;
        this.addItemsToWorld(items);
    }

    private addItemsToWorld(items: WorldObject[]) {
        if (_.isEmpty(items)) return;
        for (let item of items) {
            World.Actions.addWorldObjectToWorld(item, this);
        }
    }
}