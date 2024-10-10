namespace PuffSystem {
    export type PuffConfig = {
        p?: Pt;
        v: Pt;
        maxLife: number;
        radius: number;
        color: number;
        alpha?: number;

        finalV?: Pt;
        finalRadius?: number;
        finalColor?: number;
        finalAlpha?: number;

        easingFn?: Tween.Easing.Function;
    }

    export type Puff = {
        x: number;
        y: number;
        vx: number;
        vy: number;
        t: number;
        maxLife: number;
        finalVx: number;
        finalVy: number;
        initialRadius: number;
        finalRadius: number;
        initialColor: number;
        finalColor: number;
        initialAlpha: number;
        finalAlpha: number;
        easingFn: Tween.Easing.Function;
    }
}

class PuffSystem extends WorldObject {
    protected puffs: PuffSystem.Puff[] = [];
    private sprites: PIXI.Sprite[] = [];

    constructor(config: WorldObject.Config<PuffSystem>) {
        super(config);
    }

    override update() {
        super.update();

        this.updateParticles(this.delta);
    }

    protected updateParticles(delta: number) {
        this.puffs.filterInPlace(puff => {
            let progress = puff.t / puff.maxLife;

            let vx = M.lerp(progress, puff.vx, puff.finalVx, puff.easingFn);
            let vy = M.lerp(progress, puff.vy, puff.finalVy, puff.easingFn);

            puff.x += vx * delta;
            puff.y += vy * delta;
            
            puff.t += delta;
            return puff.t < puff.maxLife;
        });
    }

    override render() {
        let result: Render.Result = FrameCache.array();
        
        for (let i = 0; i < this.puffs.length; i++) {
            let puff = this.puffs[i];
            let progress = puff.t / puff.maxLife;

            let radius = M.lerp(progress, puff.initialRadius, puff.finalRadius, puff.easingFn);
            let particleColor = Color.lerpColorByLch(progress, puff.initialColor, puff.finalColor, puff.easingFn);
            let alpha = M.lerp(progress, puff.initialAlpha, puff.finalAlpha, puff.easingFn);

            // Puff position includes this.x/y so the system can move around without affecting existing puffs.
            this.sprites[i].x = puff.x - this.x;
            this.sprites[i].y = puff.y - this.y;
            this.sprites[i].scale.set(radius/16);
            this.sprites[i].tint = Color.combineTints(particleColor, this.getTotalTint());
            this.sprites[i].alpha = alpha * this.getTotalAlpha();

            result.push(this.sprites[i]);
        }

        result.pushAll(super.render());

        return result;
    }

    protected addPuff(config: PuffSystem.PuffConfig) {
        this.puffs.push({
            // Puff position includes this.x/y so the system can move around without affecting existing puffs.
            x: this.x + (config.p?.x ?? 0),
            y: this.y + (config.p?.y ?? 0),
            vx: config.v.x,
            vy: config.v.y,
            t: 0,
            maxLife: config.maxLife,
            finalVx: config.finalV?.x ?? config.v.x,
            finalVy: config.finalV?.y ?? config.v.y,
            initialRadius: config.radius,
            finalRadius: config.finalRadius ?? config.radius,
            initialColor: config.color,
            finalColor: config.finalColor ?? config.color,
            initialAlpha: config.alpha ?? 1,
            finalAlpha: config.finalAlpha ?? config.alpha ?? 1,
            easingFn: config.easingFn ?? Tween.Easing.Linear,
        });

        if (this.sprites.length < this.puffs.length) {
            this.sprites.push(new PIXI.Sprite(Textures.filledCircle(16, 0xFFFFFF)));
        }
    }
}