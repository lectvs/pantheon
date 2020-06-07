class LogPiece extends Sprite {
    private readonly friction = 20000;
    private readonly timeToStartBurning = Random.float(0, 0.2);
    private readonly burnTime = 0.3;

    constructor(config: Sprite.Config) {
        super(config);
        this.gravityz = -100;

        this.stateMachine.addState('normal', {
            script: S.wait(this.timeToStartBurning),
            transitions: [{ type: 'instant', toState: 'burning' }]
        });
        this.stateMachine.addState('burning', {
            callback: () => {
                this.addChild(<Sprite.Config>{
                    parent: fireSpriteConfig(),
                    offset: {
                        x: this.offset.x,
                        y: this.offset.y
                    },
                    layer: this.layer,
                    scaleX: 0.3,
                    scaleY: 0.3,
                });
            },
            script: S.chain(
                S.doOverTime(this.burnTime, t => {
                    let fire = <Sprite>this.children[0];
                    fire.offset.x = this.offset.x;
                    fire.offset.y = this.offset.y;
                }),
                S.call(() => this.kill()),
            )
        });
        this.stateMachine.setState('normal');
    }

    update(delta: number) {
        this.updateMovement(delta);
        super.update(delta);

        if (this.z <= 0) {
            this.z = 0;
            this.vz = 0;
        }
    }

    private updateMovement(delta: number) {
        if (this.z <= 0) {
            if (this.vx > 0) {
                this.vx = Math.max(0, this.vx - this.friction*delta);
            } else if (this.vx < 0) {
                this.vx = Math.min(0, this.vx + this.friction*delta);
            }

            if (this.vy > 0) {
                this.vy = Math.max(0, this.vy - this.friction*delta);
            } else if (this.vy < 0) {
                this.vy = Math.min(0, this.vy + this.friction*delta);
            }
        }
    }
}

namespace LogPiece {
    export function getLogPieces(log: Item) {
        let logPieces: LogPiece[] = [];

        let stemx = log.flipX ? 4 : 8;
        let logTexture = AssetCache.getTexture('log');
        if (log.flipX) logTexture = logTexture.flipX();
        let subdivisions = logTexture.subdivide(4, 4, 0.5, 0.5).filter(sub =>
            (sub.y !== 0 || sub.x === stemx) && (sub.y !== 12)
        );

        for (let subdivision of subdivisions) {
           logPieces.push(new LogPiece({
               x: log.x, y: log.y, z: log.z,
               texture: subdivision.texture,
               offset: {
                   x: log.offset.x - 8 + subdivision.x,
                   y: log.offset.y - 8 + subdivision.y,
               },
               vx: log.vx, vy: log.vy, vz: log.vz,
               layer: log.layer,
           }));
        }

        return logPieces;
    }
}