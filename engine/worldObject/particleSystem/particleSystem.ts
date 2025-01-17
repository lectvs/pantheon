namespace ParticleSystem {
    export type ParticleConfig = {
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

    export type Particle = {
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

class ParticleSystem extends WorldObject {
    protected particles: ParticleSystem.Particle[] = [];
    private sprites: PIXI.Sprite[] = [];

    constructor(config: WorldObject.Config<ParticleSystem>) {
        super(config);
    }

    override update() {
        super.update();

        this.updateParticles(this.delta);
    }

    protected updateParticles(delta: number) {
        this.particles.filterInPlace(particle => {
            let progress = particle.t / particle.maxLife;

            let vx = M.lerp(progress, particle.vx, particle.finalVx, particle.easingFn);
            let vy = M.lerp(progress, particle.vy, particle.finalVy, particle.easingFn);

            particle.x += vx * delta;
            particle.y += vy * delta;
            
            particle.t += delta;
            return particle.t < particle.maxLife;
        });
    }

    override render() {
        let result: Render.Result = FrameCache.array();
        
        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];
            let progress = particle.t / particle.maxLife;

            let radius = M.lerp(progress, particle.initialRadius, particle.finalRadius, particle.easingFn);
            let particleColor = Color.lerpColorByLch(progress, particle.initialColor, particle.finalColor, particle.easingFn);
            let alpha = M.lerp(progress, particle.initialAlpha, particle.finalAlpha, particle.easingFn);

            // Particle position includes this.x/y so the system can move around without affecting existing particles.
            this.sprites[i].x = particle.x - this.x;
            this.sprites[i].y = particle.y - this.y;
            this.sprites[i].scale.set(radius/16);
            this.sprites[i].tint = Color.combineTints(particleColor, this.getTotalTint());
            this.sprites[i].alpha = alpha * this.getTotalAlpha();

            result.push(this.sprites[i]);
        }

        result.pushAll(super.render());

        return result;
    }

    protected addParticle(config: ParticleSystem.ParticleConfig) {
        this.particles.push({
            // Particle position includes this.x/y so the system can move around without affecting existing particles.
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

        if (this.sprites.length < this.particles.length) {
            this.sprites.push(new PIXI.Sprite(Textures.filledCircle(16, 0xFFFFFF)));
        }
    }
}