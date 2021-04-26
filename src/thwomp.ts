class Thwomp extends Sprite {
    private readonly SLEEP_TIME = 0.7;
    private readonly GRAVITY = 1000;
    private readonly MAX_SPEED = 300;

    constructor(tx: number, ty: number) {
        super({
            x: tx*16 + 8,
            y: ty*16 + 8,
            animations: [
                Animations.fromTextureList({ name: 'sleep',  texturePrefix: 'thwomp', textures: ['sleep'], frameRate: 1 }),
                Animations.fromTextureList({ name: 'awake',  texturePrefix: 'thwomp', textures: ['awake'], frameRate: 1 }),
                Animations.fromTextureList({ name: 'active', texturePrefix: 'thwomp', textures: ['active'], frameRate: 1 }),
            ],
            defaultAnimation: 'awake',
            layer: 'entities',
            physicsGroup: 'thwomps',
            bounds: new RectBounds(-8, -8, 16, 16),
        });

        this.stateMachine.addState('awake', {
            callback: () => this.playAnimation('awake'),
            transitions: [
                { toState: 'active', condition: () => !V.isZero(this.controller.moveDirection) },
            ]
        });

        this.stateMachine.addState('active', {
            callback: () => {
                this.playAnimation('active');
                this.gravity.x = this.controller.moveDirection.x * this.GRAVITY;
                this.gravity.y = this.controller.moveDirection.y * this.GRAVITY;
            }
        });

        this.stateMachine.addState('sleep', {
            callback: () => {
                this.playAnimation('sleep');
                this.gravity.x = 0;
                this.gravity.y = 0;
            },
            script: S.wait(this.SLEEP_TIME),
            transitions: [{ toState: 'awake' }]
        });

        this.setState('awake');

        this.behavior = new Thwomp.ThwompBehavior(this);
    }

    update() {
        V.clampMagnitude(this.v, this.MAX_SPEED);
        super.update();
    }

    onCollide(collision: Physics.CollisionInfo) {
        super.onCollide(collision);
        let gdir = V.normalized(this.gravity);
        Puff.puff(this.world, this.x + gdir.x*8, this.y + gdir.y*8, 10, () => Random.inCircle(50));
        this.world.playSound('thwomphit')
        this.setState('sleep');
    }
}

namespace Thwomp {
    export class ThwompBehavior extends ControllerBehavior {
        constructor(thwomp: Thwomp) {
            super(function() {
                for (let direction of [Direction2D.LEFT, Direction2D.RIGHT, Direction2D.UP, Direction2D.DOWN]) {
                    let result = thwomp.world.select.raycast(thwomp.x, thwomp.y, direction.h, direction.v, ['player', 'walls', 'thwomps']);
                    if (_.size(result) > 1 && result[1].obj instanceof Player) {
                        this.controller.moveDirection = { x: direction.h, y: direction.v };
                    }
                }
            })
        }
    }
}