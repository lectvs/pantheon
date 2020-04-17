/// <reference path="./world.ts" />

class Menu extends World {
    menuSystem: MenuSystem;

    constructor(menuSystem: MenuSystem, config: World.Config = {}, items?: WorldObject[]) {
        super(config);
        this.menuSystem = menuSystem;
        World.Actions.addWorldObjectsToWorld(items, this);
    }
}