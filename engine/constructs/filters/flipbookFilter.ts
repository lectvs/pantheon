class FlipbookFilter extends TextureFilter {
    private _strength: number;
    get strength() { return this._strength; }
    set strength(value: number) {
        this._strength = value;
        this.setUniform('strength', value);
    }

    private _speed: number;
    get speed() { return this._speed; }
    set speed(value: number) {
        this._speed = value;
        this.setUniform('speed', value);
    }

    private _timeGranularity: number;
    get timeGranularity() { return this._timeGranularity; }
    set timeGranularity(value: number) {
        this._timeGranularity = value;
        this.setUniform('timeGranularity', value);
    }

    private _offset: number;
    get offset() { return this._offset; }
    set offset(value: number) {
        this._offset = value;
        this.setUniform('offset', value);
    }

    /**
     * @param strength - the amplitude of the offset
     * @param speed - the speed at which the offset cycles
     * @param timeGranularity - how big is the time rubberbanding
     * @param spread - the physical spread of the effect
     * @param offset - time offset
     */
    constructor(strength: number, speed: number, timeGranularity: number, spread: number, offset: number = 0) {
        super({
            uniforms: {
                'float strength': strength,
                'float speed': speed,
                'float timeGranularity': timeGranularity,
                'float offset': offset,
                'float spread': spread,
            },
            code: `
                float zoom = 11.0 * spread;
                float tt = floor((t + offset) * speed / timeGranularity) * timeGranularity;
                float offsety = pnoise(x/zoom, 0.0, tt*5.1) * strength;
                float offsetx = pnoise(0.0, y/zoom, tt*5.1) * strength;
                outp = getColor(x + offsetx * upscale, y + offsety * upscale);
            `
        });

        this._strength = strength;
        this._speed = speed;
        this._timeGranularity = timeGranularity;
        this._offset = offset;
    }
}