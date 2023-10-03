class AnimationManager {
    sprite: Sprite;
    animations: Dict<Animation.Frame[]>;
    speed: number;

    private currentFrame: Animation.Frame | undefined;
    private currentFrameTime: number;

    constructor(sprite: Sprite) {
        this.sprite = sprite;
        this.animations = {};
        this.speed = 1;

        this.currentFrame = undefined;
        this.currentFrameTime = 0;
    }

    update(delta: number) {
        if (this.currentFrame) {
            this.currentFrameTime += delta * this.speed;

            let duration = this.currentFrame?.duration ?? Infinity;
            while (this.currentFrameTime >= duration) {
                this.currentFrameTime -= duration;
                this.setCurrentFrame(this.currentFrame?.nextFrameRef, false, true);
            }
        }
    }

    addAnimation(name: string, frames: Animation.Frame[]) {
        if (this.animations[name]) {
            console.error(`Cannot add animation '${name}' to sprite`, this.sprite, "since it already exists");
            return;
        }

        frames.forEach(frame => O.defaults(frame, {
            duration: 0,
            forceRequired: false,
        }));

        this.animations[name] = frames;
    }

    get forceRequired() {
        return this.currentFrame && this.currentFrame.forceRequired;
    }

    getCurrentAnimationName() {
        for (let name in this.animations) {
            if (this.animations[name].includes(this.currentFrame)) {
                return name;
            }
        }
        return undefined;
    }
    
    getCurrentFrame() {
        return this.currentFrame;
    }

    getFrameByRef(ref: string) {
        let parts = ref.split('/');
        if (parts.length != 2) {
            console.error(`Cannot get frame '${ref}' on sprite`, this.sprite, "as it does not fit the form '[animation]/[frame]'");
            return null;
        }
        let animation = this.animations[parts[0]];
        if (!animation) {
            console.error(`Cannot get frame '${ref}' on sprite`, this.sprite, `as animation '${parts[0]}' does not exist`);
            return null;
        }
        let frame = parseInt(parts[1]);
        if (!isFinite(frame) || frame < 0 || frame >= animation.length) {
            console.error(`Cannot get frame '${ref}' on sprite`, this.sprite, `as animation '${parts[0]} does not have frame '${parts[1]}'`);
            return null;
        }
        return animation[frame];
    }

    hasAnimation(name: string) {
        return !!this.animations[name];
    }

    isAnimationEmpty(name: string) {
        return A.isEmpty(this.animations[name]);
    }

    get isPlaying() {
        return !!this.currentFrame;
    }

    playAnimation(name: string, force: boolean = false) {
        if (!force && (this.forceRequired || this.getCurrentAnimationName()?.startsWith(name))) {
            return;
        }
        if (this.hasAnimation(name) && this.isAnimationEmpty(name)) {
            this.setCurrentFrame(undefined, true, force);
            return;
        }
        this.setCurrentFrame(`${name}/0`, true, force);
    }

    setCurrentFrame(frameRef: string | undefined, resetFrameTime: boolean = true, force: boolean = false) {
        if (this.forceRequired && !force) {
            return;
        }

        // Reset frame time.
        if (resetFrameTime) {
            this.currentFrameTime = 0;
        }

        if (!frameRef) {
            this.currentFrame = undefined;
            return;
        }

        let frame = this.getFrameByRef(frameRef);
        if (!frame) {
            console.error('No animation frame found:', frameRef);
            return;
        }

        this.currentFrame = frame;

        // Set sprite properties from the frame.
        if (this.currentFrame.texture) {
            this.sprite.setTexture(this.currentFrame.texture);
        }

        // Call the callback
        if (this.currentFrame.callback) {
            this.currentFrame.callback();
        }
    }

    stop() {
        this.setCurrentFrame(undefined, true, true);
    }
}