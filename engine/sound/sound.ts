namespace Sound {
    export type Controller = SoundManager | MusicManager | World | WorldObject | Module<WorldObject>;
}

abstract class Sound {
    protected markedForDisable: boolean;
    get isMarkedForDisable() { return this.markedForDisable; }

    key: string;

    paused: boolean;
    /** Must be between 0 and Sound.MAX_VOLUME */
    volume: number;
    /** Must be between 0 and Sound.MAX_SPEED */
    speed: number;
    loopsLeft: number;

    abstract get done(): boolean;
    
    abstract get onDone(): () => void;
    abstract set onDone(value: () => void);

    protected pos: number;
    get position() { return this.pos; }
    abstract get duration(): number;

    controller?: Sound.Controller;
    protected hanging: boolean;

    constructor(key: string, controller?: Sound.Controller) {
        this.markedForDisable = false;
        this.key = key;
        this.paused = false;
        this.pos = 0;

        this.volume = 1;
        this.speed = 1;
        this.loopsLeft = 0;
        this.hanging = false;

        this.controller = controller;
    }

    abstract update(delta: number): void;

    markForDisable() {
        this.markedForDisable = true;
    }

    unmarkForDisable() {
        this.markedForDisable = false;
    }

    abstract ensureDisabled(): void;
    abstract ensureEnabled(): void;

    hang() {
        this.hanging = true;
    }

    abstract seek(position: number): void;

    abstract stop(): void;

    humanize(percent: number = 0.05) {
        this.speed *= Random.float(1 - percent, 1 + percent);
    }

    abstract setFilter(filter: WebAudioFilter): void;
}

namespace Sound {
    export const MAX_VOLUME: number = 2;
    export const MAX_SPEED: number = 100;

    /**
     * Each note increment by 1 represents one semitone.
     * @returns 2^(note/12).
     */
    export function pitchUpBySemitone(note: number) {
        return 2**(note/12);
    }

    /**
     * Each note increment by 1 represents one semitone.
     * @returns 2^(-note/12).
     */
    export function pitchDownBySemitone(note: number) {
        return 2**(-note/12);
    }

    export function getControllerVolume(controller: Sound.Controller | undefined) {
        if (controller instanceof SoundManager) return controller.volume;
        if (controller instanceof MusicManager) return controller.volume;
        if (controller instanceof World) return controller.soundManager.volume;
        if (controller instanceof WorldObject && controller.world) return controller.world.soundManager.volume;
        if (controller instanceof Module && controller.worldObject && controller.worldObject.world) return controller.worldObject.world.soundManager.volume;
        return 1;
    }
}