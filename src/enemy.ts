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
}