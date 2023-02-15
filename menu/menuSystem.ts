class MenuSystem {
    game: Game;
    menuStack: Menu[];

    get currentMenu() { return _.last(this.menuStack); }
    get inMenu() { return !!this.currentMenu; }

    constructor(game: Game) {
        this.game = game;
        this.menuStack = [];
    }

    update() {
        if (this.inMenu) {
            this.currentMenu.update();
        }
    }

    render(screen: Texture) {
        if (this.inMenu) {
            this.currentMenu.render(screen, 0, 0);
        }
    }

    back() {
        if (this.inMenu) this.menuStack.pop();
    }

    clear() {
        this.menuStack = [];
    }

    loadMenu(menuFactory: Factory<Menu>) {
        let instance = menuFactory();
        this.menuStack.push(instance);
    }
}