class MenuSystem {
    game: Game;
    menuStack: Menu[];

    get currentMenu() { return this.menuStack.last(); }
    get inMenu() { return !!this.currentMenu; }

    constructor(game: Game) {
        this.game = game;
        this.menuStack = [];
    }

    update() {
        if (this.inMenu) {
            this.currentMenu!.update();
        }
    }

    render() {
        if (this.inMenu) {
            return this.currentMenu!.render();
        }
        return FrameCache.array();
    }

    takeScreenshot(): World.Screenshot {
        if (!this.inMenu) {
            console.error('Not in menu');
            return {
                texture: Textures.NOOP,
                upscale: 1,
            };
        }
        return this.currentMenu!.takeScreenshot();
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
        instance.onTransitioned();
    }
}