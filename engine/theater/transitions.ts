namespace Transitions {
    export class Instant extends Transition {
        constructor() {
            super({});
        }

        override compile(): CompileResult {
            return undefined;
        }

        override render(screen: Texture): void {
            // Noop
        }
    }

    export class Fade extends Transition {
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

        override compile(): CompileResult {
            // TODO PIXI
            return undefined;
        }

        override render(screen: Texture) {
            this.oldSnapshot?.renderTo(screen);
            this.newSnapshot?.renderTo(screen, {
                alpha: this.newAlpha
            });
        }
    }

    export class Curtains extends Transition {
        private inTime: number;
        private midTime: number;
        private outTime: number;

        private slide_t: number;
        private transitioned: boolean;

        constructor(config: Transition.BaseConfig & { inTime: number, midTime: number, outTime: number }) {
            super(config);
            this.inTime = config.inTime;
            this.midTime = config.midTime;
            this.outTime = config.outTime;
            this.slide_t = 0;
            this.transitioned = false;

            this.script = new Script(S.chain(
                S.wait(this.preTime),
                S.doOverTime(this.inTime, t => this.slide_t = t),
                S.wait(this.midTime),
                S.call(() => this.transitioned = true),
                S.doOverTime(this.outTime, t => this.slide_t = 1-t),
                S.wait(this.postTime),
            ));
        }

        override compile(): CompileResult {
            // TODO PIXI
            return undefined;
        }

        override render(screen: Texture) {
            if (this.transitioned) {
                if (this.newSnapshot) {
                    this.newSnapshot.renderTo(screen);
                    Draw.rectangle(screen, 0, 0, this.newSnapshot.width, this.newSnapshot.height/2 * this.slide_t, { fill: { color: 0x000000 }});
                    Draw.rectangle(screen, 0, this.newSnapshot.height* (1 - 0.5*this.slide_t), this.newSnapshot.width, this.newSnapshot.height * 0.5*this.slide_t, { fill: { color: 0x000000 }});
                }
            } else {
                if (this.oldSnapshot) {
                    this.oldSnapshot.renderTo(screen);
                    Draw.rectangle(screen, 0, 0, this.oldSnapshot.width, this.oldSnapshot.height/2 * this.slide_t, { fill: { color: 0x000000 }});
                    Draw.rectangle(screen, 0, this.oldSnapshot.height* (1 - 0.5*this.slide_t), this.oldSnapshot.width, this.oldSnapshot.height * 0.5*this.slide_t, { fill: { color: 0x000000 }});
                }
            }
        }
    }
}
