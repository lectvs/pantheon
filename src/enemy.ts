namespace Enemy {
    export type Config = {
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
        super();

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

        this.vx = M.lerpTime(this.vx, 0, 10, this.delta);
        this.vy = M.lerpTime(this.vy, 0, 10, this.delta);
    }

    postUpdate() {
        super.postUpdate();

        let p = 4;
        if (this.x < -p || this.x > 768+p || this.y < 192-p || this.y > 768+p) {
            this.kill();
        }
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

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if (other instanceof Hoop && this.damagableByHoop && !this.immune && other.isStrongEnoughToDealDamage()) {
            let d = { x: this.x - other.x, y: this.y - other.y };
            V.setMagnitude(d, other.currentAttackStrength * 500 / this.weight);
            this.vx += d.x;
            this.vy += d.y;

            this.damage(other.currentAttackStrength);
        }
    }
}