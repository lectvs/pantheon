class Lever extends Sprite {
    private cutscene: string;

    constructor(x: number, y: number, cutscene: string) {
        super({
            x, y,
            texture: 'lever',
        });

        let i = this.addChild(new Interactable({ x: 0, y: -8, bounds: new RectBounds(-1, -8, 2, 16) }));
        i.onInteract = () => {
            this.flip();
        }

        this.cutscene = cutscene;
    }

    flip() {
        this.flipX = true;
        if (this.flipX) {
            global.theater.cutsceneManager.playCutscene(storyboard[this.cutscene]);
        }
        this.world.playSound('crush');
        global.theater.runScript(S.shake(2, 0.3));
    }
}