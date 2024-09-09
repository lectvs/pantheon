namespace ParticleFocus {
    export type Config = WorldObject.Config<ParticleFocus> & {
        effectRadius: number;
        effectRate?: number;
        particleRadius: number;
        particleSpeed?: number;
        particleColor?: number;
    }
}

class ParticleFocus extends WorldObject {
    effectRadius: number;
    effectRate: number;
    particleSpeed: number;
    particleRadius: number;
    particleColor: number;

    private timer: Timer;

    constructor(config: ParticleFocus.Config) {
        super({
            ...config,
        });

        this.effectRadius = config.effectRadius;
        this.effectRate = config.effectRate ?? 1;
        this.particleSpeed = config.particleSpeed ?? 1;
        this.particleRadius = config.particleRadius;
        this.particleColor = config.particleColor ?? 0xFFFFFF;

        this.timer = this.addTimer(0.05, () => {
            this.createParticle();
        }, Infinity);
    }

    override update(): void {
        super.update();

        this.timer.speed = this.effectRate;
    }

    public createParticle() {
        let parent = this;
        let particle = this.worldd.addWorldObject(new Sprite({
            p: Random.onCircle(this.effectRadius).scale(Random.float(0.6, 1)).add(this),
            texture: Textures.filledCircle(32, 0xFFFFFF),
            tint: this.particleColor,
            alpha: 0,
            scale: this.particleRadius / 32,
            layer: this.layer,
            timeScale: this.particleSpeed,
            useGlobalTime: this.useGlobalTime,
            hooks: {
                onAdd() {
                    this.angle = tmp.vec2(parent).subtract(this).angle;
                },
            },
        }));

        particle.runScript(function*() {
            yield S.tween(0.1, particle, 'alpha', 0, 1);
            yield S.schedule(
                0, S.tweenPt(0.5, particle, particle, parent, Tween.Easing.InQuad),
                0, S.tween(0.35, particle, 'scaleX', particle.scaleX, particle.scaleX * 2),
                0, S.tween(0.35, particle, 'scaleY', particle.scaleY, particle.scaleY * 0.5),
                0.35, S.tween(0.15, particle, 'scaleX', particle.scaleX, 0),
            );
            particle.kill();
        });
    }
}