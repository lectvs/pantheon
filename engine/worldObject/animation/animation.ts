abstract class AnimationInstance {
    constructor(private priority: number, private nextRef?: string) {}

    abstract onAdd(worldObject: WorldObject): void;
    abstract onStart(): void;
    abstract update(delta: number): void;
    abstract isDone(): boolean;
    abstract skipToRefPoint(refPoint: number): void;
    abstract reset(): void;

    getPriority(): number {
        return this.priority;
    }

    getNextRef(): string | undefined {
        return this.nextRef;
    }
}

namespace AnimationInstance {
    export class EmptyAnimation extends AnimationInstance {
        override onAdd(worldObject: WorldObject): void {}
        override onStart(): void {}
        override update(delta: number): void {}
        override isDone(): boolean { return true; }
        override skipToRefPoint(refPoint: number): void {}
        override reset(): void {}
    }
    
    export type TextureAnimationConfig = {
        frames: TextureAnimationFrame[];
        count: number;
        priority: number;
        nextRef?: string;
    }

    export type TextureAnimationFrame = {
        texture?: string | PIXI.Texture;
        duration?: number;
        callback?: () => any;
    }

    export class TextureAnimation extends AnimationInstance {
        private sprite: Sprite | undefined;
        private frames: TextureAnimationFrame[];
        private count: number;

        private get currentFrame() { return this.currentIteration < this.count ? this.frames[this.currentFrameIndex] : undefined; }
        private currentFrameIndex: number;
        private currentFrameTime: number;
        private currentIteration: number;
    
        constructor(config: TextureAnimationConfig) {
            super(config.priority, config.nextRef);
            this.frames = config.frames;
            this.count = config.count;
    
            this.currentFrameIndex = 0;
            this.currentFrameTime = 0;
            this.currentIteration = 0;
        }

        override onAdd(worldObject: WorldObject): void {
            if (!(worldObject instanceof Sprite)) {
                console.error("Tried to add TextureAnimation to a non-Sprite:", worldObject);
                return;
            }
            this.sprite = worldObject;
        }

        override onStart(): void {
            this.applyCurrentFrame();
        }
    
        override update(delta: number): void {
            if (this.currentFrame) {
                this.currentFrameTime += delta;
    
                while (this.currentFrame && this.currentFrame.duration !== undefined && this.currentFrameTime >= this.currentFrame.duration) {
                    this.currentFrameTime -= this.currentFrame.duration;
                    this.currentFrameIndex++;
                    if (this.currentFrameIndex >= this.frames.length) {
                        this.currentFrameIndex = 0;
                        this.currentIteration++;
                    }
                    this.applyCurrentFrame();
                }
            }
        }

        override isDone(): boolean {
            return !this.currentFrame;
        }

        override skipToRefPoint(refPoint: number): void {
            let frame = refPoint % this.frames.length;
            let iteration = Math.floor(refPoint / this.frames.length);
            this.currentFrameIndex = frame;
            this.currentFrameTime = 0;
            this.currentIteration = iteration;
        }

        override reset(): void {
            this.currentFrameIndex = 0;
            this.currentFrameTime = 0;
            this.currentIteration = 0;
        }
    
        private applyCurrentFrame() {
            if (!this.sprite) return;
            if (!this.currentFrame) return;

            // Set sprite properties from the frame.
            if (this.currentFrame.texture) {
                this.sprite.setTexture(this.currentFrame.texture);
            }
    
            // Call the callback
            if (this.currentFrame.callback) {
                this.currentFrame.callback();
            }
        }
    }

    export type ScriptAnimationConfig = {
        script: Script.Function;
        count: number;
        onReset?: () => any;
        priority: number;
        nextRef?: string;
    }

    export class ScriptAnimation extends AnimationInstance {
        private scriptFuncion: Script.Function;
        private count: number;
        private onReset: (() => any) | undefined;

        private script: Script | undefined;
        private currentIteration: number;
    
        constructor(config: ScriptAnimationConfig) {
            super(config.priority, config.nextRef);
            this.scriptFuncion = config.script;
            this.count = config.count;
            this.onReset = config.onReset;

            this.script = new Script(this.scriptFuncion);
            this.currentIteration = 0;
        }

        override onAdd(worldObject: WorldObject): void {}
        override onStart(): void {}
    
        override update(delta: number): void {
            if (this.script) {
                this.script.update(delta);
                if (this.script.done) {
                    this.currentIteration++;
                    if (this.currentIteration < this.count) {
                        this.script = new Script(this.scriptFuncion);
                    } else {
                        this.script = undefined;
                    }
                }
            }
        }

        override isDone(): boolean {
            return !this.script;
        }

        override skipToRefPoint(refPoint: number): void {}

        override reset(): void {
            this.script = new Script(this.scriptFuncion);
            this.currentIteration = 0;
            this.onReset?.();
        }
    }
}