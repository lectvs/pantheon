class LogPiece extends Sprite {
    private zGravity: number = 100;
    vz: number;
    constructor(config: Sprite.Config) {
        super(config);
        this.vz = O.getOrDefault(this.data.vz, 0);
    }

    update(delta: number) {
        this.updateMovement(delta);
        super.update(delta);
    }        

    private updateMovement(delta: number) {
        this.offset.y = Math.min(0, this.offset.y + this.vz*delta);
        this.vz += this.zGravity*delta;
    }
}

namespace LogPiece {
    export function getLogPieces(log: Item) {
        let logPieces: LogPiece[] = [];

        for (let pos of [{x: log.flipX ? 4 : 8, y: 1},
                         {x: 0,  y: 5},
                         {x: 4,  y: 5},
                         {x: 8,  y: 5},
                         {x: 12, y: 5},
                         {x: 0,  y: 9},
                         {x: 4,  y: 9},
                         {x: 8,  y: 9},
                         {x: 12, y: 9}]) {
            let texture = new Texture(4, 4);
            texture.render(AssetCache.getTexture('log'), {
                x: 8 - pos.x,
                y: 8 - pos.y,
                scaleX: log.flipX ? -1 : 1,
            });
            logPieces.push(new LogPiece({
                x: log.x, y: log.y,
                texture: texture,
                offset: {
                    x: log.offset.x - 8 + pos.x,
                    y: log.offset.y - 8 + pos.y,
                },
                vx: log.vx, vy: log.vy,
                layer: log.layer,
                data: {
                    vz: log.vz,
                }
            }));
        }

        return logPieces;
    }
}