class AnimationManager {
    sprite: Sprite;
    animations: Dict<Animation.Frame[]>;

    private currentFrame: Animation.Frame;
    private currentFrameTime: number;

    constructor(sprite: Sprite) {
        this.sprite = sprite;
        this.animations = {};

        this.currentFrame = null;
        this.currentFrameTime = 0;
    }

    update(delta: number) {
        if (this.currentFrame) {
            this.currentFrameTime += delta;

            if (this.currentFrameTime >= this.currentFrame.duration) {
                this.currentFrameTime -= this.currentFrame.duration;
                this.setCurrentFrame(this.currentFrame.nextFrameRef, false, true);
            }
        }
    }

    addAnimation(name: string, frames: Animation.Frame[]) {
        if (this.animations[name]) {
            debug(`Cannot add animation '${name}' to sprite`, this.sprite, "since it already exists");
            return;
        }
        this.animations[name] = frames;
    }

    get forceRequired() {
        return this.currentFrame && this.currentFrame.forceRequired;
    }

    getCurrentAnimationName() {
        for (let name in this.animations) {
            if (_.contains(this.animations[name], this.currentFrame)) {
                return name;
            }
        }
        return null;
    }
    
    getCurrentFrame() {
        return this.currentFrame;
    }

    getFrameByRef(ref: string) {
        let parts = ref.split('/');
        if (parts.length != 2) {
            debug(`Cannot get frame '${name}' on sprite`, this.sprite, "as it does not fit the form '[animation]/[frame]'");
            return null;
        }
        let animation = this.animations[parts[0]];
        if (!animation) {
            debug(`Cannot get frame '${name}' on sprite`, this.sprite, `as animation '${parts[0]}' does not exist`);
            return null;
        }
        let frame = parseInt(parts[1]);
        if (!isFinite(frame) || frame < 0 || frame >= animation.length) {
            debug(`Cannot get frame '${name}' on sprite`, this.sprite, `as animation '${parts[0]} does not have frame '${parts[1]}'`);
            return null;
        }
        return animation[frame];
    }

    get isPlaying() {
        return !!this.currentFrame;
    }

    playAnimation(name: string, startFrame: number = 0, force: boolean = false) {
        if (!force && (this.forceRequired || this.getCurrentAnimationName() == name)) {
            return;
        }
        this.setCurrentFrame(`${name}/${startFrame}`, true, force);
    }

    setCurrentFrame(frameRef: string, resetFrameTime: boolean = true, force: boolean = false) {
        if (this.forceRequired && !force) {
            return;
        }

        // Reset frame time.
        if (resetFrameTime) {
            this.currentFrameTime = 0;
        }

        if (!frameRef) {
            this.currentFrame = null;
            return;
        }

        let frame = this.getFrameByRef(frameRef);
        if (!frame) return;

        this.currentFrame = frame;

        // Set sprite properties from the frame.
        if (this.currentFrame.texture) {
            this.sprite.setTexture(this.currentFrame.texture);
        }
    }

    stop() {
        this.setCurrentFrame(null, true, true);
    }
}