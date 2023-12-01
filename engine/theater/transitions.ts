namespace Transitions {
    export class Instant extends Transition {
        constructor() {
            super({});
        }

        override render(): RenderResult {
            return undefined;
        }
    }

    export class Fade extends Transition {
        private time: number;
        private newAlpha: number;
        private container: PIXI.Container;

        constructor(config: Transition.BaseConfig & { time: number }) {
            super(config);
            this.time = config.time;
            this.newAlpha = 0;
            this.container = new PIXI.Container();

            this.script = new Script(S.chain(
                S.wait(this.preTime),
                S.doOverTime(this.time, t => {
                    this.newAlpha = t;
                }),
                S.wait(this.postTime),
            ));
        }

        override render(): RenderResult {
            let result: RenderResult[] = [];
            if (this.oldSnapshot) {
                result.push(this.oldSnapshot.sprite);
            }
            if (this.newSnapshot) {
                this.newSnapshot.sprite.alpha = this.newAlpha;
                result.push(this.newSnapshot.sprite);
            }
            diffRender(this.container, result);
            return this.container;
        }
    }

    export class Curtains extends Transition {
        private inTime: number;
        private midTime: number;
        private outTime: number;

        private slide_t: number;
        private transitioned: boolean;

        private container: PIXI.Container;
        private topCurtain: PIXI.Sprite;
        private bottomCurtain: PIXI.Sprite;

        constructor(config: Transition.BaseConfig & { inTime: number, midTime: number, outTime: number }) {
            super(config);
            this.inTime = config.inTime;
            this.midTime = config.midTime;
            this.outTime = config.outTime;
            this.slide_t = 0;
            this.transitioned = false;

            this.container = new PIXI.Container();

            this.topCurtain = new PIXI.Sprite(Textures.filledRect(W, H/2, 0x000000));
            this.bottomCurtain = new PIXI.Sprite(Textures.filledRect(W, H/2, 0x000000));

            this.script = new Script(S.chain(
                S.wait(this.preTime),
                S.doOverTime(this.inTime, t => this.slide_t = t),
                S.wait(this.midTime),
                S.call(() => this.transitioned = true),
                S.doOverTime(this.outTime, t => this.slide_t = 1-t),
                S.wait(this.postTime),
            ));
        }

        override render(): RenderResult {
            let result: RenderResult[] = [];

            if (this.transitioned) {
                if (this.newSnapshot) {
                    result.push(this.newSnapshot.sprite);
                }
            } else {
                if (this.oldSnapshot) {
                    result.push(this.oldSnapshot.sprite);
                }
            }

            this.topCurtain.y = H/2 * (this.slide_t - 1);
            result.push(this.topCurtain);

            this.bottomCurtain.y = H/2 * (2 - this.slide_t);
            result.push(this.bottomCurtain);

            diffRender(this.container, result);
            return this.container;
        }
    }
}
