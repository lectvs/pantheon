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

    private _granularity: number;
    get granularity() { return this._granularity; }
    set granularity(value: number) {
        this._granularity = value;
        this.setUniform('granularity', value);
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
     * @param granularity - how big is the time rubberbanding
     * @param offset - time offset
     */
    constructor(strength: number, speed: number, granularity: number, spread: number, offset: number = 0) {
        super({
            uniforms: {
                'float strength': strength,
                'float speed': speed,
                'float granularity': granularity,
                'float offset': offset,
                'float spread': spread,
            },
            code: `
                float zoom = 11.0 * spread;
                float tt = floor((t + offset) * speed / granularity) * granularity;
                float offsety = pnoise(x/zoom, 0.0, tt*5.1) * strength;
                float offsetx = pnoise(0.0, y/zoom, tt*5.1) * strength;
                outp = getColor(x + offsetx * upscale, y + offsety * upscale);
            `
        });

        this._strength = strength;
        this._speed = speed;
        this._granularity = granularity;
        this._offset = offset;
    }
}