class Bat extends Sprite {
    private readonly ACCELERATION = 64;
    private readonly MAX_SPEED = 32;
    private readonly KNOCKBACK_SPEED = 100;

    private health: number = 2;

    constructor(tx: number, ty: number) {
        super({
            x: tx*16 + 8, y: ty*16 + 8,
            animations: [
                Animations.fromTextureList({ name: 'sleep', texturePrefix: 'bat', textures: [0], frameRate: 1 }),
                Animations.fromTextureList({ name: 'fly', texturePrefix: 'bat', textures: [1, 2, 3, 3, 4], frameRate: 12, count: -1 }),
            ],
            defaultAnimation: 'sleep',
            layer: 'entities',
            physicsGroup: 'enemies',
            bounds: new RectBounds(-4, -2, 8, 4),
            tags: ['deadly'],
        });
        let bat = this;

        this.stateMachine.addState('sleep', {
            update: () => {
                this.playAnimation('sleep');
            },
            transitions: [
                { toState: 'active', condition: () => {
                    let player = this.world.select.name<Player>('player');
                    return player && this.world.select.raycast(this.x, this.y, player.x - this.x, player.y - this.y, ['walls']).every(rr => rr.t > 1);
                }}
            ]
        });
        this.stateMachine.addState('active', {
            callback: () => {
                this.v.y = this.MAX_SPEED;
            },
            update: () => {
                let a = this.controller.moveDirection.withMagnitude(this.ACCELERATION);
                SmartAccelerate.accelerate(this.v, a.x, a.y, this.delta, this.MAX_SPEED);

                this.flipX = this.controller.moveDirection.x < 0;
                this.playAnimation('fly');
            }
        });
        this.stateMachine.addState('stunned', {
            script: function*() {
                bat.effects.addSilhouette.color = 0x000000;
                bat.effects.addOutline.color = 0xFFFFFF;
                yield S.wait(0.2);
                bat.effects.silhouette.enabled = false;
                bat.effects.outline.enabled = false;
            },
            transitions: [{ toState: 'active' }]
        });
        this.setState('sleep');

        this.behavior = new Bat.BatBehavior(this);
    }

    damage(direction: Vector2) {
        this.v.x += direction.x * this.KNOCKBACK_SPEED;
        this.v.y += direction.y * this.KNOCKBACK_SPEED;
        let oppdir = new Vector2(-direction.x, -direction.y);
        Puff.puffDirection(this.world, this.x, this.y, 5, oppdir, 50, 50);
        this.world.playSound('bathit');
        this.setState('stunned');

        this.health--;
        if (this.health <= 0) {
            this.kill();
        }
    }

    kill() {
        Puff.puff(this.world, this.x, this.y, 20, () => Random.inCircle(50));
        super.kill();
    }
}

namespace Bat {
    export class BatBehavior extends ControllerBehavior {
        constructor(bat: Bat) {
            super(function() {
                let player = bat.world.select.name<Player>('player');
                if (!player) return;
                this.controller.moveDirection.x = player.x - bat.x;
                this.controller.moveDirection.y = player.y - bat.y;
            });
        }
    }
}