class Diggur extends Sprite {
    readonly MAX_SPEED = 100;

    spinning = false;
    laying = false;

    constructor(x: number, y: number) {
        super({
            name: 'diggur',
            x, y,
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'diggur', textures: [0, 1], frameRate: 2.2, count: Infinity }),
                Animations.fromTextureList({ name: 'run',  texturePrefix: 'diggur', textures: [4, 5, 6], frameRate: 4, count: Infinity, overrides: {
                    0: { callback: () => { this.world.playSound('walk'); } },
                    1: { callback: () => { this.world.playSound('walk'); } },
                    2: { callback: () => { this.world.playSound('walk'); } },
                } }),
                Animations.fromTextureList({ name: 'spin', texturePrefix: 'diggur', textures: [8], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'laying', texturePrefix: 'diggur', textures: [9], frameRate: 1, count: Infinity }),
            ],
            defaultAnimation: 'idle',
            layer: 'main',
            physicsGroup: 'npcs',
            bounds: new RectBounds(-12, -4, 24, 24),
            gravityy: 400,
        });
    }

    update() {
        let grounded = this.isGrounded();
        let haxis = (this.controller.left ? -1 : 0) + (this.controller.right ? 1 : 0);
        this.v.x = haxis * this.MAX_SPEED;

        if (this.spinning) {
            this.angle += 720 * this.delta;
            if (grounded) {
                this.spinning = false;
                this.laying = true;
                this.angle = 0;
            }
        }

        super.update();

        if (haxis < 0) {
            this.flipX = true;
        } else {
            this.flipX = false;
        }

        if (this.laying) {
            this.playAnimation('laying');
        } else if (this.spinning) {
            this.playAnimation('spin');
        } else if (haxis === 0) {
            this.playAnimation('idle');
        } else {
            this.playAnimation('run');
        }
    }

    onCollide(collison: Physics.Collision) {
        super.onCollide(collison);

        if (collison.other.obj instanceof CrackedWall) {
            collison.other.obj.removeFromWorld();
            global.theater.runScript(S.loopFor(3, S.chain(
                S.call(() => global.world.playSound('crush')),
                S.wait(0.15),
            )));
            global.theater.runScript(S.chain(
                S.fadeOut(0, 0xFFFFFF),
                S.call(() => {
                    global.world.addWorldObject(new Sprite({ x: 3567, y: 1152, texture: 'smoke1', life: 2, update: function() { this.alpha = 0.8 * (1-this.life.progress); }, vx: -10, vy: -10 }));
                    global.world.addWorldObject(new Sprite({ x: 3567, y: 1152, texture: 'smoke2', life: 2, update: function() { this.alpha = 0.8 * (1-this.life.progress); }, vx: 10, vy: 0 }));
                    global.world.addWorldObject(new Sprite({ x: 3567, y: 1152, texture: 'smoke3', life: 2, update: function() { this.alpha = 0.8 * (1-this.life.progress); }, vx: -20, vy: 20 }));
                }),
                S.wait(0.2),
                S.fadeSlides(0),
                S.shake(4, 1),
            ));
        }
    }

    private isGrounded() {
        (<RectBounds>this.bounds).y++;
        let ground = this.world.select.overlap(this.bounds, ['walls']);
        (<RectBounds>this.bounds).y--;
        return !_.isEmpty(ground);
    }
}