/// <reference path="../theater/theater.ts" />

class MenuTheater extends Theater {
    private menuStack: World[];

    constructor(config: Theater.Config = {}) {
        super(config);

        this.menuStack = [];
    }

    back(transition?: Transition) {
        if (this.menuStack.length <= 1) {
            this.clearMenus();
            return;
        }

        this.menuStack.pop();
        this.loadStage(() => this.getCurrentMenu()!, transition);
    }

    clearMenus() {
        this.menuStack.clear();
        this.loadStage(() => new World());
    }

    getCurrentMenu() {
        return this.menuStack.last();
    }

    loadMenu(menuFactory: Factory<World>, transition?: Transition) {
        let instance = menuFactory();
        this.menuStack.push(instance);
        this.loadStage(() => this.getCurrentMenu()!, transition);
    }
}