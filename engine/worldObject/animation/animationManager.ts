class AnimationManager {
    speed: number;

    private worldObject: WorldObject;
    private animations: Dict<AnimationInstance>;
    private currentAnimationName: string | undefined;
    private get currentAnimation(): AnimationInstance | undefined { return this.animations[this.currentAnimationName!]; }
    private defaultAnimation: string | undefined;
    private started: boolean;

    constructor(worldObject: WorldObject, animations: Dict<AnimationInstance> | undefined, defaultAnimation: string | undefined) {
        this.speed = 1;
        this.worldObject = worldObject;
        this.animations = {};
        this.currentAnimationName = undefined;
        this.defaultAnimation = defaultAnimation;
        this.started = false;

        if (!O.isEmpty(animations)) {
            for (let animationName in animations) {
                this.addAnimation(animationName, animations[animationName]);
            }
        }
    }

    start() {
        if (this.started) return;

        if (this.defaultAnimation === 'none') {
            // Noop
        } else if (this.defaultAnimation) {
            this.playAnimation(this.defaultAnimation);
        } else if (!O.isEmpty(this.animations)) {
            if ('default' in this.animations) this.playAnimation('default');
            else if ('idle' in this.animations) this.playAnimation('idle');
        }

        this.started = true;
    }

    update(delta: number) {
        if (this.currentAnimation) {
            this.currentAnimation.update(delta * this.speed);
            if (this.currentAnimation.isDone()) {
                this.currentAnimation.reset();
                let nextRef = this.currentAnimation.getNextRef();
                if (nextRef) {
                    let [name, refPoint] = this.splitRef(nextRef);
                    this.playAnimation(name, 'force');
                    this.skipToRefPoint(refPoint);
                } else {
                    this.currentAnimationName = undefined;
                }
            }
        }
    }

    addAnimation(name: string, animation: AnimationInstance) {
        if (name in this.animations) {
            console.error(`Cannot add animation '${name}' because it already exists`, this);
            return;
        }
        this.animations[name] = animation;
        animation.onAdd(this.worldObject);
    }
    
    addAlias(aliasName: string, animationName: string) {
        if (aliasName in this.animations) {
            console.error(`Cannot add alias '${aliasName}' because it already exists`, this);
            return;
        }
        if (!(animationName in this.animations)) {
            console.error(`Cannot add alias '${aliasName}' because its mapped animation '${animationName}' does not exist`, this);
            return;
        }
        this.animations[aliasName] = this.animations[animationName];
    }

    getCurrentAnimationName() {
        return this.currentAnimationName;
    }

    hasAnimation(name: string) {
        return name in this.animations;
    }

    isAnimationOrVariantPlaying(name: string) {
        if (!this.currentAnimationName) return false;
        if (this.currentAnimationName === name) return true;
        if (this.animations[this.currentAnimationName].getVariantOf().includes(name)) return true;
        if (this.animations[name].getVariantOf().includes(this.currentAnimationName)) return true;
        return false;
    }

    playAnimation(nameOrRef: string, force: boolean | 'force' = false, checked: 'checked' | 'unchecked' = 'checked') {
        let [name, refPoint] = this.splitRef(nameOrRef);
        if (!this.hasAnimation(name)) {
            if (checked) console.error(`Cannot play animation '${name}' because it does not exist`, this);
            this.currentAnimationName = undefined;
            return;
        }

        let priorityForceRequired = this.currentAnimation && this.currentAnimation.getPriority() > this.animations[name].getPriority();
        let sameAnimationForceRequired = this.isAnimationOrVariantPlaying(name);

        let forceRequired = priorityForceRequired || sameAnimationForceRequired;

        if (forceRequired && !force) {
            return;
        }

        this.currentAnimation?.reset();
        this.currentAnimationName = name;
        this.currentAnimation?.onStart();
        if (refPoint > 0) {
            this.skipToRefPoint(refPoint);
        }
    }

    private skipToRefPoint(refPoint: number) {
        if (!this.currentAnimation) return;
        this.currentAnimation.skipToRefPoint(refPoint);
    }

    private splitRef(ref: string): [string, number] {
        let parts = ref.split('/');
        if (parts.length === 0 || parts.length > 3) {
            console.error("Ref is malformed:", ref);
            return [ref, 0];
        }
        if (parts.length === 1) {
            return [parts[0], 0];
        }
        return [parts[0], parseInt(parts[1])];
    }
}