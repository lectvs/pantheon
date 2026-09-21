namespace ParticleSystem {
    export type Config<T extends ParticleSystem> = WorldObject.Config<T> & {
        particleTextureSize?: number;
        moveParticlesWithSystem?: boolean;
        colorLerpMethod?: 'lch' | 'rgb';
    }

    export type ParticleConfig = {
        p?: Pt;
        maxLife: number;
        textureRoot?: string;
        textures?: (string | number | PIXI.Texture)[];
        frameRate?: number;
        stages: ParticleStageConfig[];
    }

    export type ParticleStageConfig = {
        weightTo?: number;
        easingFnTo?: Tween.Easing.Function;

        v?: Pt;
        radius?: number;
        color?: number;
        alpha?: number;
        gravity?: Pt;
        gravityContribution?: number;
    }

    export type Particle = {
        i: number;
        x: number;
        y: number;
        baseVx: number;
        baseVy: number;
        gravityVx: number;
        gravityVy: number;
        gravityX: number;
        gravityY: number;
        gravityContribution: number;
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
        baseVx?: number;
        baseVy?: number;
        gravityX?: number;
        gravityY?: number;
        gravityContribution?: number;
        radius?: number;
        color?: number;
        alpha?: number;
    }
}

class ParticleSystem extends WorldObject {
    private particleTextureSize: number;
    private moveParticlesWithSystem: boolean;
    private colorLerpMethod: 'lch' | 'rgb';

    particles: ParticleSystem.Particle[] = [];
    particleI: number = 0;
    private sprites: PIXI.Sprite[] = [];

    constructor(config: ParticleSystem.Config<ParticleSystem>) {
        super(config);

        this.particleTextureSize = config.particleTextureSize ?? 16;
        this.moveParticlesWithSystem = config.moveParticlesWithSystem ?? false;
        this.colorLerpMethod = config.colorLerpMethod ?? 'lch';
    }

    override update() {
        super.update();

        this.updateParticles(this.delta);
    }

    protected updateParticles(delta: number) {
        this.particles.filterInPlace(particle => {
            particle.gravityVx += particle.gravityX * this.delta;
            particle.gravityVy += particle.gravityY * this.delta;
            particle.x += (particle.baseVx + particle.gravityVx * particle.gravityContribution) * this.delta;
            particle.y += (particle.baseVy + particle.gravityVy * particle.gravityContribution) * this.delta;
            particle.t += delta;
            return particle.t < particle.maxLife;
        });
    }

    override render() {
        let result: Render.Result = FrameCache.array();
        
        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];

            let scale = particle.usesDefaultTexture ? particle.radius/this.particleTextureSize : particle.radius;
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
            i: this.particleI,
            // If moveParticlesWithSystem is set, particle position includes this.x/y so the system can
            // move around without affecting existing particles.
            x: this.moveParticlesWithSystem ? (config.p?.x ?? 0) : this.x + (config.p?.x ?? 0),
            y: this.moveParticlesWithSystem ? (config.p?.y ?? 0) : this.y + (config.p?.y ?? 0),
            baseVx: config.stages[0].v?.x ?? 0,
            baseVy: config.stages[0].v?.y ?? 0,
            gravityVx: 0,
            gravityVy: 0,
            gravityX: config.stages[0].gravity?.x ?? 0,
            gravityY: config.stages[0].gravity?.y ?? 0,
            gravityContribution: config.stages[0].gravityContribution ?? 1,
            radius: config.stages[0].radius ?? 1,
            color: config.stages[0].color ?? 0xFFFFFF,
            alpha: config.stages[0].alpha ?? 1,
            textures: config.textures
                ? config.textures.map(texture => texture instanceof PIXI.Texture
                    ? texture
                    : AssetCache.getTexture(config.textureRoot ? `${config.textureRoot}/${texture}` : `${texture}`))
                : [Textures.filledCircle(this.particleTextureSize, 0xFFFFFF)],
            frameRate: config.frameRate ?? 1,
            usesDefaultTexture: !config.textures,
            t: 0,
            maxLife: config.maxLife,
            stages: config.stages.map(stageConfig => ({
                timeTo: totalStageWeights <= 0 ? config.maxLife : config.maxLife * (stageConfig.weightTo ?? 1) / totalStageWeights,
                easingFnTo: stageConfig.easingFnTo ?? Tween.Easing.Linear,
                baseVx: stageConfig.v?.x,
                baseVy: stageConfig.v?.y,
                gravityX: stageConfig.gravity?.x,
                gravityY: stageConfig.gravity?.y,
                gravityContribution: stageConfig.gravityContribution,
                radius: stageConfig.radius,
                color: stageConfig.color,
                alpha: stageConfig.alpha
            } satisfies ParticleSystem.ParticleStage)),
        };

        this.particles.push(particle);

        if (this.sprites.length < this.particles.length) {
            this.sprites.push(new PIXI.Sprite());
        }

        this.runScript(this.tweenProperty(particle, 'baseVx'));
        this.runScript(this.tweenProperty(particle, 'baseVy'));
        this.runScript(this.tweenProperty(particle, 'gravityX'));
        this.runScript(this.tweenProperty(particle, 'gravityY'));
        this.runScript(this.tweenProperty(particle, 'gravityContribution'));
        this.runScript(this.tweenProperty(particle, 'radius'));
        this.runScript(this.tweenProperty(particle, 'color'));
        this.runScript(this.tweenProperty(particle, 'alpha'));

        this.particleI++;
    }

    private tweenProperty(particle: ParticleSystem.Particle,
            property: 'baseVx' | 'baseVy' | 'gravityX' | 'gravityY' | 'gravityContribution' | 'radius' | 'color' | 'alpha'): Script.Function {
        let ps = this;
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

                let tween = property === 'color'
                    ? (ps.colorLerpMethod === 'lch' ? S.tweenColorLch : S.tweenColorRgb)
                    : S.tween;

                yield tween(time, particle, property, currentStage[property] ?? particle[property], nextStage[property] ?? 0, nextStage.easingFnTo);

                currentStageI = nextStageI;
                nextStageI = particle.stages.findIndex((stage, i) => i > currentStageI && stage[property] !== undefined);
            }
        }
    }
}