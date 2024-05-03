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

        canApply: boolean;
    
        constructor(config: TextureAnimationConfig) {
            super(config);
            this.frames = config.frames;
            this.count = config.count;
    
            this.currentFrameIndex = 0;
            this.currentFrameTime = 0;
            this.currentIteration = 0;
            this.canApply = true;
        }

        override onAdd(worldObject: WorldObject): void {
            if (!(worldObject instanceof Sprite)) {
                console.error("Tried to add TextureAnimation to a non-Sprite:", worldObject);
                return;
            }
            this.sprite = worldObject;
        }

        override onStart(): void {
            this.applyCurrentFrameVisual();
            this.applyCurrentFrameCallback();
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
                    this.applyCurrentFrameCallback();
                }

                this.applyCurrentFrameVisual();
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
            this.applyCurrentFrameVisual();
            this.applyCurrentFrameCallback();
        }

        override reset(): void {
            this.currentFrameIndex = 0;
            this.currentFrameTime = 0;
            this.currentIteration = 0;
        }
    
        private applyCurrentFrameVisual() {
            if (!this.sprite) return;
            if (!this.currentFrame) return;
            if (!this.canApply) return;

            // Set sprite properties from the frame.
            if (this.currentFrame.texture) {
                this.sprite.setTexture(this.currentFrame.texture);
            }
        }

        private applyCurrentFrameCallback() {
            if (!this.sprite) return;
            if (!this.currentFrame) return;
            if (!this.canApply) return;

            if (this.currentFrame.callback) {
                this.currentFrame.callback();
            }
        }
    }

    export type TextureAnimationDirection = 'front' | 'back' | 'side' | 'frontside' | 'backside';

    export type TextureAnimationDirectionalConfig = Config & {
        getDirection: () => Vector2;
        directions: PartialRecord<TextureAnimationDirection, TextureAnimation>;
    }

    export class TextureAnimationDirectional extends AnimationInstance {
        private getDirection: () => Vector2;
        private directions: PartialRecord<TextureAnimationDirection, TextureAnimation>;
    
        constructor(config: TextureAnimationDirectionalConfig) {
            super(config);

            this.getDirection = config.getDirection;
            this.directions = O.clone(config.directions);

            if (O.isEmpty(this.directions)) {
                console.error('No directions specified:', config.directions, this);
                this.directions = {
                    'front': new TextureAnimation({ frames: [], count: 1 }),
                };
            }
        }

        override onAdd(worldObject: WorldObject): void {
            for (let key in this.directions) {
                this.directions[key as TextureAnimationDirection]!.onAdd(worldObject);
            }
        }

        override onStart(): void {
            this.setCanApply();
            for (let key in this.directions) {
                this.directions[key as TextureAnimationDirection]!.onStart();
            }
        }
    
        override update(delta: number): void {
            this.setCanApply();
            for (let key in this.directions) {
                this.directions[key as TextureAnimationDirection]!.update(delta);
            }
        }

        override isDone(): boolean {
            let currentDirectionName = this.getCurrentDirectionName();
            return this.directions[currentDirectionName]!.isDone();
        }

        override skipToRefPoint(refPoint: number): void {
            this.setCanApply();
            for (let key in this.directions) {
                this.directions[key as TextureAnimationDirection]!.skipToRefPoint(refPoint);
            }
        }

        override reset(): void {
            this.setCanApply();
            for (let key in this.directions) {
                this.directions[key as TextureAnimationDirection]!.reset();
            }
        }

        private setCanApply() {
            let currentDirectionName = this.getCurrentDirectionName();
            for (let key in this.directions) {
                this.directions[key as TextureAnimationDirection]!.canApply = (key === currentDirectionName);
            }
        }
    
        private getCurrentDirectionName(): TextureAnimationDirection {
            let direction = this.getDirection();

            let possibleDirections: Vector2[] = FrameCache.array();
            if ('front' in this.directions) possibleDirections.push(TextureAnimationDirectional.FRONT_DIRECTION);
            if ('back' in this.directions) possibleDirections.push(TextureAnimationDirectional.BACK_DIRECTION);
            if ('side' in this.directions) {
                possibleDirections.push(TextureAnimationDirectional.LEFT_DIRECTION);
                possibleDirections.push(TextureAnimationDirectional.RIGHT_DIRECTION);
            }
            if ('frontside' in this.directions) {
                possibleDirections.push(TextureAnimationDirectional.FRONT_LEFT_DIRECTION);
                possibleDirections.push(TextureAnimationDirectional.FRONT_RIGHT_DIRECTION);
            }
            if ('backside' in this.directions) {
                possibleDirections.push(TextureAnimationDirectional.BACK_LEFT_DIRECTION);
                possibleDirections.push(TextureAnimationDirectional.BACK_RIGHT_DIRECTION);
            }

            let closestDirection = M.argmin(possibleDirections, dir => G.distanceSq(dir, direction))!;

            if (closestDirection.y > 0 && closestDirection.x !== 0) return 'frontside';
            if (closestDirection.y < 0 && closestDirection.x !== 0) return 'backside';
            if (closestDirection.x !== 0) return 'side';
            if (closestDirection.y < 0) return 'back';
            return 'front';
        }

        private static FRONT_DIRECTION = Direction.DOWN;
        private static BACK_DIRECTION = Direction.UP;
        private static LEFT_DIRECTION = Direction.LEFT;
        private static RIGHT_DIRECTION = Direction.RIGHT;
        private static FRONT_LEFT_DIRECTION = Direction.DOWN_LEFT.normalized();
        private static FRONT_RIGHT_DIRECTION = Direction.DOWN_RIGHT.normalized();
        private static BACK_LEFT_DIRECTION = Direction.UP_LEFT.normalized();
        private static BACK_RIGHT_DIRECTION = Direction.UP_RIGHT.normalized();
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
                if (this.script.isDone) {
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