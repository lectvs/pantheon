namespace Transitions {
    export class Instant extends Transition {
        constructor() {
            super({});
        }

        override render() {
            return FrameCache.array();
        }
    }

    export class Fade extends Transition {
        private inTime: number;
        private midTime: number;
        private outTime: number;

        private fade_t: number;
        private transitioned: boolean;

        private fadeSprite: PIXI.Sprite;

        constructor(config: Transition.BaseConfig & { inTime: number, midTime: number, outTime: number }) {
            super(config);
            this.inTime = config.inTime;
            this.midTime = config.midTime;
            this.outTime = config.outTime;

            this.fade_t = 0;
            this.transitioned = false;

            this.fadeSprite = new PIXI.Sprite(Textures.filledRect(W, H, 0x000000));

            this.script = new Script(S.chain(
                S.wait(this.preTime),
                S.doOverTime(this.inTime, t => this.fade_t = t),
                S.wait(this.midTime),
                S.call(() => this.transitioned = true),
                S.doOverTime(this.outTime, t => this.fade_t = 1-t),
                S.wait(this.postTime),
            ));
        }

        override render() {
            let result: Render.Result = FrameCache.array();

            if (this.transitioned) {
                if (this.newScreenshot) {
                    result.push(this.newScreenshot.sprite);
                }
            } else {
                if (this.oldScreenshot) {
                    result.push(this.oldScreenshot.sprite);
                }
            }

            this.fadeSprite.alpha = this.fade_t;
            result.push(this.fadeSprite);

            return result;
        }
    }

    export class CrossFade extends Transition {
        private time: number;
        private newAlpha: number;

        constructor(config: Transition.BaseConfig & { time: number }) {
            super(config);
            this.time = config.time;
            this.newAlpha = 0;

            this.script = new Script(S.chain(
                S.wait(this.preTime),
                S.doOverTime(this.time, t => {
                    this.newAlpha = t;
                }),
                S.wait(this.postTime),
            ));
        }

        override render() {
            let result: Render.Result = FrameCache.array();
            if (this.oldScreenshot) {
                result.push(this.oldScreenshot.sprite);
            }
            if (this.newScreenshot) {
                this.newScreenshot.sprite.alpha = this.newAlpha;
                result.push(this.newScreenshot.sprite);
            }
            return result;
        }
    }

    export class Curtains extends Transition {
        private inTime: number;
        private midTime: number;
        private outTime: number;

        private slide_t: number;
        private transitioned: boolean;

        private topCurtain: PIXI.Sprite;
        private bottomCurtain: PIXI.Sprite;

        constructor(config: Transition.BaseConfig & { inTime: number, midTime: number, outTime: number }) {
            super(config);
            this.inTime = config.inTime;
            this.midTime = config.midTime;
            this.outTime = config.outTime;
            this.slide_t = 0;
            this.transitioned = false;

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

        override render() {
            let result: Render.Result = FrameCache.array();

            if (this.transitioned) {
                if (this.newScreenshot) {
                    result.push(this.newScreenshot.sprite);
                }
            } else {
                if (this.oldScreenshot) {
                    result.push(this.oldScreenshot.sprite);
                }
            }

            this.topCurtain.y = H/2 * (this.slide_t - 1);
            result.push(this.topCurtain);

            this.bottomCurtain.y = H/2 * (2 - this.slide_t);
            result.push(this.bottomCurtain);

            return result;
        }
    }

    export class Dissolve extends Transition {
        private time: number;
        private dissolveFilter: DissolveFilter;

        constructor(config: Transition.BaseConfig & { time: number, scaleX: number, scaleY: number, timeTransform?: (t: number) => number }) {
            super(config);
            this.time = config.time;

            this.dissolveFilter = new DissolveFilter(config.scaleX, config.scaleY);
            this.dissolveFilter.amount = 1;

            let timeTransform = config.timeTransform ?? Utils.IDENTITY;

            this.script = new Script(S.chain(
                S.wait(this.preTime),
                S.doOverTime(this.time, t => {
                    this.dissolveFilter.amount = M.lerp(timeTransform(t), 1, 0);
                }),
                S.wait(this.postTime),
            ));
        }

        override setData(props: Transition.SetDataProps): void {
            super.setData(props);

            if (this.newScreenshot) {
                this.newScreenshot.sprite.filters = [this.dissolveFilter];
            }
        }

        override render() {
            let result: Render.Result = FrameCache.array();
            if (this.oldScreenshot) {
                result.push(this.oldScreenshot.sprite);
            }
            if (this.newScreenshot) {
                result.push(this.newScreenshot.sprite);
            }
            return result;
        }
    }
}
