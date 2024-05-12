class FilterSprite extends Sprite {
    constructor(filters: TextureFilter[], config: Sprite.Config<FilterSprite> = {}) {
        super({
            texture: Textures.filledRect(global.gameWidth, global.gameHeight, 0xFFFFFF, 0),
            ignoreCamera: true,
            effects: { post: filters },
            ...config,
        });
    }

    override update(): void {
        super.update();

        this.effects.post.forEach(filter => filter.setOffset(this.world!.camera.worldOffsetX, this.world!.camera.worldOffsetY));
    }
}