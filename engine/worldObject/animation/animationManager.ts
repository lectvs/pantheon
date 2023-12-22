class AnimationManager {
    speed: number;

    private worldObject: WorldObject;
    private animations: Dict<AnimationInstance>;
    private currentAnimationName: string | undefined;
    private get currentAnimation(): AnimationInstance | undefined { return this.animations[this.currentAnimationName!]; }

    constructor(worldObject: WorldObject, animations: Dict<AnimationInstance> | undefined, defaultAnimation: string | undefined) {
        this.speed = 1;
        this.worldObject = worldObject;
        this.animations = {};
        this.currentAnimationName = undefined;

        if (!O.isEmpty(animations)) {
            for (let animationName in animations) {
                this.addAnimation(animationName, animations[animationName]);
            }
        }

        if (defaultAnimation === 'none') {
            // Noop
        } else if (defaultAnimation) {
            this.playAnimation(defaultAnimation);
        } else if (!O.isEmpty(animations)) {
            if ('default' in animations) this.playAnimation('default');
            else if ('idle' in animations) this.playAnimation('idle');
        }
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

    getCurrentAnimationName() {
        return this.currentAnimationName;
    }

    hasAnimation(name: string) {
        return name in this.animations;
    }

    playAnimation(name: string, force: boolean | 'force' = false, checked: 'checked' | 'unchecked' = 'checked') {
        if (!this.hasAnimation(name)) {
            if (checked) console.error(`Cannot play animation '${name}' because it does not exist`, this);
            this.currentAnimationName = undefined;
            return;
        }

        let priorityForceRequired = this.currentAnimation && this.currentAnimation.getPriority() > this.animations[name].getPriority();
        let sameAnimationForceRequired = this.currentAnimationName?.startsWith(name);

        let forceRequired = priorityForceRequired || sameAnimationForceRequired;

        if (forceRequired && !force) {
            return;
        }

        this.currentAnimation?.reset();
        this.currentAnimationName = name;
        this.currentAnimation?.onStart();
    }

    private skipToRefPoint(refPoint: number) {
        if (!this.currentAnimation) return;
        this.currentAnimation.skipToRefPoint(refPoint);
    }

    private splitRef(ref: string): [string, number] {
        let parts = ref.split('/');
        if (parts.length !== 2) {
            console.error("Ref is malformed:", ref);
            return [ref, 0];
        }
        return [parts[0], parseInt(parts[1])];
    }
}