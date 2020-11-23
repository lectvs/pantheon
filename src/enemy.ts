namespace Enemy {
    export type Config = Sprite.Config & {
        maxHealth: number;
        immuneTime: number;
        weight: number;
        speed: number;
        damagableByHoop?: boolean;
        deadTexture?: string;
    }
}

class Enemy extends Sprite {
    health: number;
    immuneTime: number;
    weight: number;
    speed: number;
    damagableByHoop: boolean;
    deadTexture: string;
    
    private immunitySm: ImmunitySm;
    get immune() { return this.immunitySm.isImmune(); }

    constructor(config: Enemy.Config) {
        super(config);

        this.health = config.maxHealth;
        this.immuneTime = config.immuneTime;
        this.weight = config.weight;
        this.speed = config.speed;
        this.damagableByHoop = config.damagableByHoop ?? true;
        this.deadTexture = config.deadTexture;

        this.immunitySm = new ImmunitySm(this.immuneTime);
    }

    update() {
        this.immunitySm.update(this.delta);

        super.update();

        this.v.x = M.lerpTime(this.v.x, 0, 10, this.delta);
        this.v.y = M.lerpTime(this.v.y, 0, 10, this.delta);
    }

    damage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.kill();
        }
        this.immunitySm.setImmune();
        this.world.playSound('hitenemy');
    }

    kill() {
        if (this.deadTexture) {
            this.world.addWorldObject(deadBody(this, this.deadTexture));
        }
        super.kill();
    }

    pickNextTargetPos(target: Pt) {
        if (this.x < 64 || this.x > 706 || this.y < 338 || this.y > 704) {
            // Too close to edge of room
            let candidates = A.range(20).map(i => {
                return { x: Random.float(64, 706), y: Random.float(338, 704) };
            });
            return M.argmin(candidates, pos => M.distance(this.x, this.y, pos.x, pos.y));
        }

        let candidates = A.range(3).map(i => {
            let d = Random.inDisc(50, 100);
            d.x += this.x;
            d.y += this.y;
            return d;
        });

        return M.argmin(candidates, pos => Math.abs(M.distance(target.x, target.y, pos.x, pos.y) - 150));
    }
}