class ScreenTurnOff extends Sprite {
    private white: Sprite;

    constructor() {
        super({
            texture: Textures.filledRect(W, H, 0x000000),
            layer: World.AFTER_FADE_LAYER,
            ignoreCamera: true,
        });

        this.white = this.addChild(new Sprite({
            x: W/2, y: H/2,
            texture: Textures.filledRect(W, H, 0xFFFFFF),
            textureAnchor: Anchor.CENTER,
            copyFromParent: ['layer'],
            hooks: {
                onUpdate: Hooks.keepInFrontOf(this),
            },
        }));
    }

    override onAdd(): void {
        super.onAdd();

        let white = this.white;
        this.runScript(function*() {
            white.world?.playSound('screenoff', { humanized: false });
            yield S.tween(0.1, white, 'scaleY', 1, 0.01);
            yield [
                S.tween(0.1, white, 'scaleX', 1, 0),
                S.tween(0.1, white, 'scaleY', white.scaleY, 0),
            ];
        });
    }
}