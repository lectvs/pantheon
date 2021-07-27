/// <reference path="./interactable.ts" />

class CutsceneInteractable extends Interactable {
    private cutscene: string;

    constructor(x: number, y: number, cutscene: string) {
        super({
            name: `ci_${cutscene}`,
            x, y,
            bounds: new RectBounds(-8, -8, 16, 16),
        });

        this.cutscene = cutscene;
    }

    interact() {
        if (this.pressTexture === 'pressx') {
            global.theater.cutsceneManager.playCutscene(storyboard[this.cutscene]);
        }
    }

    setBoundsSize(w: number, h: number) {
        this.bounds = new RectBounds(-w/2, -h/2, w, h);
    }
}