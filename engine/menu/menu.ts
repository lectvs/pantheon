class Menu extends World {
    constructor(config: World.Config<Menu> = {}) {
        super({
            allowPause: false,
            ...config,
        });
    }
}