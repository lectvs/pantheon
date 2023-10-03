namespace PuffSystem {
    export type PuffConfig = {
        p?: Vector2;
        v: Vector2;
        maxLife: number;
        radius: number;
        color: number;
        alpha?: number;

        finalRadius?: number;
        finalColor?: number;
        finalAlpha?: number;
    }

    export type Puff = {
        x: number;
        y: number;
        vx: number;
        vy: number;
        t: number;
        maxLife: number;
        initialRadius: number;
        finalRadius: number;
        initialColor: number;
        finalColor: number;
        initialAlpha: number;
        finalAlpha: number;
    }
}

class PuffSystem extends WorldObject {

    protected puffs: PuffSystem.Puff[] = [];

    constructor(config: WorldObject.Config) {
        super(config);
    }

    override update() {
        super.update();

        for (let i = this.puffs.length-1; i >= 0; i--) {
            let puff = this.puffs[i];
            puff.x += puff.vx * this.delta;
            puff.y += puff.vy * this.delta;
            
            puff.t += this.delta;
            if (this.puffs[i].t > this.puffs[i].maxLife) {
                this.puffs.splice(i, 1);
            }
        }
    }

    override render(texture: Texture, x: number, y: number) {
        for (let puff of this.puffs) {
            let progress = puff.t / puff.maxLife;

            let radius = M.lerp(progress, puff.initialRadius, puff.finalRadius);
            let color = Color.lerpColorByLch(progress, puff.initialColor, puff.finalColor);
            let alpha = M.lerp(progress, puff.initialAlpha, puff.finalAlpha);

            Draw.brush.color = color;
            Draw.brush.alpha = alpha;
            Draw.circleSolid(texture, x - this.x + puff.x, y - this.y + puff.y, radius);
        }

        super.render(texture, x, y);
    }

    protected addPuff(config: PuffSystem.PuffConfig) {
        this.puffs.push({
            x: this.x + (config.p?.x ?? 0),
            y: this.y + (config.p?.y ?? 0),
            vx: config.v.x,
            vy: config.v.y,
            t: 0,
            maxLife: config.maxLife,
            initialRadius: config.radius,
            finalRadius: config.finalRadius ?? config.radius,
            initialColor: config.color,
            finalColor: config.finalColor ?? config.color,
            initialAlpha: config.alpha ?? 1,
            finalAlpha: config.finalAlpha ?? config.alpha ?? 1,
        });
    }
}