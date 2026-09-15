namespace ParticleSystem {
    export type Config<T extends ParticleSystem> = WorldObject.Config<T> & {
        moveParticlesWithSystem?: boolean;
    }

    export type ParticleConfig = {
        p?: Pt;
        maxLife: number;
        textureRoot?: string;
        textures?: (string | number | PIXI.Texture)[];
        frameRate?: number;
        stages: [ParticleInitialStageConfig, ...ParticleStageConfig[]];
    }

    export type ParticleStageConfig = {
        weightTo?: number;
        easingFnTo?: Tween.Easing.Function;

        v?: Pt;
        radius?: number;
        color?: number;
        alpha?: number;
    }

    export type ParticleInitialStageConfig = ParticleStageConfig & {
        v: Pt;
        radius: number;
    }

    export type Particle = {
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
        color: number;
        alpha: number;
        textures: PIXI.Texture[];
        frameRate: number;
        usesDefaultTexture: boolean;
        t: number;
        maxLife: number;
        stages: ParticleStage[];
    }

    export type ParticleStage = {
        timeTo: number;
        easingFnTo: Tween.Easing.Function;
        vx?: number;
        vy?: number;
        radius?: number;
        color?: number;
        alpha?: number;
    }
}

class ParticleSystem extends WorldObject {
    private moveParticlesWithSystem: boolean;

    protected particles: ParticleSystem.Particle[] = [];
    private sprites: PIXI.Sprite[] = [];

    constructor(config: ParticleSystem.Config<ParticleSystem>) {
        super(config);

        this.moveParticlesWithSystem = config.moveParticlesWithSystem ?? false;
    }

    override update() {
        super.update();

        this.updateParticles(this.delta);
    }

    protected updateParticles(delta: number) {
        this.particles.filterInPlace(particle => {
            particle.x += particle.vx * this.delta;
            particle.y += particle.vy * this.delta;
            particle.t += delta;
            return particle.t < particle.maxLife;
        });
    }

    override render() {
        let result: Render.Result = FrameCache.array();
        
        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];

            let scale = particle.usesDefaultTexture ? particle.radius/16 : particle.radius;
            let textureI = Math.floor(particle.t * particle.frameRate) % particle.textures.length;
            let texture = particle.textures[textureI];

            // If moveParticlesWithSystem is set, particle position includes this.x/y so the system can
            // move around without affecting existing particles.
            this.sprites[i].x = this.moveParticlesWithSystem ? particle.x : particle.x - this.x;
            this.sprites[i].y = this.moveParticlesWithSystem ? particle.y : particle.y - this.y;
            this.sprites[i].scale.set(scale);
            this.sprites[i].tint = Color.combineTints(particle.color, this.getTotalTint());
            this.sprites[i].alpha = particle.alpha * this.getTotalAlpha();

            this.sprites[i].texture = texture;
            this.sprites[i].anchor.set(texture.defaultAnchor.x, texture.defaultAnchor.y);

            result.push(this.sprites[i]);
        }

        result.pushAll(super.render());

        return result;
    }

    clearParticles() {
        this.particles.clear();
    }

    protected addParticle(config: ParticleSystem.ParticleConfig) {
        let totalStageWeights = A.sum(config.stages.slice(1, config.stages.length), stage => stage.weightTo ?? 1);
        let particle: ParticleSystem.Particle = {
            // If moveParticlesWithSystem is set, particle position includes this.x/y so the system can
            // move around without affecting existing particles.
            x: this.moveParticlesWithSystem ? (config.p?.x ?? 0) : this.x + (config.p?.x ?? 0),
            y: this.moveParticlesWithSystem ? (config.p?.y ?? 0) : this.y + (config.p?.y ?? 0),
            vx: config.stages[0].v.x,
            vy: config.stages[0].v.y,
            radius: config.stages[0].radius,
            color: config.stages[0].color ?? 0xFFFFFF,
            alpha: config.stages[0].alpha ?? 1,
            textures: config.textures
                ? config.textures.map(texture => texture instanceof PIXI.Texture
                    ? texture
                    : AssetCache.getTexture(config.textureRoot ? `${config.textureRoot}/${texture}` : `${texture}`))
                : [Textures.filledCircle(16, 0xFFFFFF)],
            frameRate: config.frameRate ?? 1,
            usesDefaultTexture: !config.textures,
            t: 0,
            maxLife: config.maxLife,
            stages: config.stages.map(stageConfig => ({
                timeTo: totalStageWeights <= 0 ? config.maxLife : config.maxLife * (stageConfig.weightTo ?? 1) / totalStageWeights,
                easingFnTo: stageConfig.easingFnTo ?? Tween.Easing.Linear,
                vx: stageConfig.v?.x,
                vy: stageConfig.v?.y,
                radius: stageConfig.radius,
                color: stageConfig.color,
                alpha: stageConfig.alpha
            })),
        };

        this.particles.push(particle);

        if (this.sprites.length < this.particles.length) {
            this.sprites.push(new PIXI.Sprite());
        }

        this.runScript(this.tweenProperty(particle, 'vx'));
        this.runScript(this.tweenProperty(particle, 'vy'));
        this.runScript(this.tweenProperty(particle, 'radius'));
        this.runScript(this.tweenProperty(particle, 'color'));
        this.runScript(this.tweenProperty(particle, 'alpha'));
    }

    private tweenProperty(particle: ParticleSystem.Particle, property: 'vx' | 'vy' | 'radius' | 'color' | 'alpha'): Script.Function {
        return function*() {
            let currentStageI = 0;
            let nextStageI = particle.stages.findIndex((stage, i) => i > currentStageI && stage[property] !== undefined);

            while (nextStageI > currentStageI) {
                let currentStage = particle.stages[currentStageI];
                let nextStage = particle.stages[nextStageI];

                let time = 0;
                for (let i = currentStageI + 1; i <= nextStageI; i++) {
                    time += particle.stages[i].timeTo;
                }

                let tween = property === 'color' ? S.tweenColorLch : S.tween;

                yield tween(time, particle, property, currentStage[property] ?? particle[property], nextStage[property] ?? 0, nextStage.easingFnTo);

                currentStageI = nextStageI;
                nextStageI = particle.stages.findIndex((stage, i) => i > currentStageI && stage[property] !== undefined);
            }
        }
    }
}