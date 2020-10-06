class Hoop extends Sprite {
    radius: number;
    private bounceSpeed: number = 75;

    currentAttackStrength: number;
    private readonly strengthThreshold = 0.3;

    private swingSound: Sound;

    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'hoop',
            bounds: { type: 'circle', x: 0, y: 0, radius: 50 },
        });

        this.radius = 47;
        this.currentAttackStrength = 0;
    }

    update() {
        if (!this.swingSound) {
            this.swingSound = this.world.playSound('swing');
            this.swingSound.loop = true;
            this.swingSound.volume = 0;
        }

        super.update();

        let player = this.world.select.type(Player);
        let px = player.x;
        let py = player.y - 4;
        let radius = this.radius - player.radius;

        let d = M.distance(px, py, this.x, this.y);
        if (d > radius) {
            let adx = px - this.x;
            let ady = py - this.y;

            let dx = adx * radius/d;
            let dy = ady * radius/d;
            this.x = px - dx;
            this.y = py - dy;

            this.vx += (adx - dx) * this.bounceSpeed;
            this.vy += (ady - dy) * this.bounceSpeed;
        }

        this.vx = M.lerpTime(this.vx, 0, 1.2, this.delta);
        this.vy = M.lerpTime(this.vy, 0, 1.2, this.delta);

        this.setStrength(player);

        let visibleAttackStrength = M.clamp(this.currentAttackStrength, 0, 1);

        this.effects.outline.enabled = true;
        this.effects.outline.color = 0x00FFFF;
        this.effects.outline.alpha = visibleAttackStrength;

        this.swingSound.volume = 0.5*visibleAttackStrength;
        this.swingSound.webAudioSound.speed = visibleAttackStrength;
    }

    postUpdate() {
        super.postUpdate();

        let player = this.world.select.type(Player);
        if (!isFinite(this.x)) this.x = player.x;
        if (!isFinite(this.y)) this.y = player.y;
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        if (other instanceof Enemy && this.isStrongEnoughToDealDamage()) {
            let d = { x: this.x - other.x, y: this.y - other.y };
            V.setMagnitude(d, this.currentAttackStrength * 200);
            this.vx += d.x;
            this.vy += d.y;
        }
    }

    isStrongEnoughToDealDamage() {
        return this.currentAttackStrength > this.strengthThreshold;
    }

    private setStrength(player: Player) {
        let pureVelStrength = M.magnitude(this.vx, this.vy)/500;
        let relPlayerStrength = M.magnitude(this.vx - player.vx, this.vy - player.vy)/500;

        this.currentAttackStrength = pureVelStrength * relPlayerStrength;

        if (!_.isEmpty(this.world.select.overlap(this.bounds, ['walls']))) {
            this.currentAttackStrength = 0;
        }
    }
}