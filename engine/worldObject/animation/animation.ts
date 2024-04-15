abstract class AnimationInstance {
    private priority: number;
    private nextRef: string | undefined;
    private variantOf: string[];

    constructor(config: AnimationInstance.Config) {
        this.priority = config.priority ?? 0;
        this.nextRef = config.nextRef;
        this.variantOf = config.variantOf ?? [];
    }

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

    getVariantOf() {
        return this.variantOf;
    }
}

namespace AnimationInstance {
    export type Config = {
        priority?: number;
        nextRef?: string;
        variantOf?: string[]
    }

    export class EmptyAnimation extends AnimationInstance {
        override onAdd(worldObject: WorldObject): void {}
        override onStart(): void {}
        override update(delta: number): void {}
        override isDone(): boolean { return true; }
        override skipToRefPoint(refPoint: number): void {}
        override reset(): void {}
    }

    export type CompositeAnimationConfig = Config & {
        animations: AnimationInstance[];
    }

    export class CompositeAnimation extends AnimationInstance {
        private animations: AnimationInstance[];

        constructor(config: CompositeAnimationConfig) {
            super(config);
            this.animations = config.animations;
        }

        override onAdd(worldObject: WorldObject): void {
            for (let animation of this.animations) {
                animation.onAdd(worldObject);
            }
        }

        override onStart(): void {
            for (let animation of this.animations) {
                animation.onStart();
            }
        }
    
        override update(delta: number): void {
            for (let animation of this.animations) {
                animation.update(delta);
            }
        }

        override isDone(): boolean {
            return this.animations.every(animation => animation.isDone());
        }

        override skipToRefPoint(refPoint: number): void {
            for (let animation of this.animations) {
                animation.skipToRefPoint(refPoint);
            }
        }

        override reset(): void {
            for (let animation of this.animations) {
                animation.reset();
            }
        }
    }

    export type TextureAnimationConfig = Config & {
        frames: TextureAnimationFrame[];
        count: number;
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
            super(config);
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
            this.applyCurrentFrame();
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

    export type ScriptAnimationConfig = Config & {
        script: () => Script.Function;
        count: number;
        onReset?: () => any;
    }

    export class ScriptAnimation extends AnimationInstance {
        private scriptFactory: () => Script.Function;
        private count: number;
        private onReset: (() => any) | undefined;

        private script: Script | undefined;
        private currentIteration: number;
    
        constructor(config: ScriptAnimationConfig) {
            super(config);
            this.scriptFactory = config.script;
            this.count = config.count;
            this.onReset = config.onReset;

            this.currentIteration = 0;
        }

        override onAdd(worldObject: WorldObject): void {}
        override onStart(): void {
            this.script = new Script(this.scriptFactory());
        }
    
        override update(delta: number): void {
            if (this.script) {
                this.script.update(delta);
                if (this.script.done) {
                    this.currentIteration++;
                    if (this.currentIteration < this.count) {
                        this.script = new Script(this.scriptFactory());
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
            this.script = undefined;
            this.currentIteration = 0;
            this.onReset?.();
        }
    }
}