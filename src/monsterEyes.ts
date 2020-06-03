class MonsterEyes extends Sprite {
    static eyesFilter = new TextureFilter({
        code: `if (outp.rgb != vec3(1.0, 0.0, 0.0)) outp.a = 0.0;`
    });

    constructor(config: Sprite.Config) {
        super(config);
    }

    get parentMonster() {
        if (!this.parent) return undefined;
        return <Monster>this.parent;
    }

    render(screen: Texture) {
        if (this.parentMonster) {
            this.parentMonster.effects.post.filters.push(MonsterEyes.eyesFilter);
            this.parentMonster.fullRender(screen);
            this.parentMonster.effects.post.filters.pop();
        }
        super.render(screen);
    }
}