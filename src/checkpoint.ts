class Checkpoint extends Sprite {

    isCheckpointGot: boolean;

    constructor(tx: number, ty: number, angle: number) {
        super({
            x: tx*16 + 8, y: ty*16 + 8,
            texture: 'checkpoint_low',
            angle: angle,
            layer: 'entities',
            physicsGroup: 'checkpoints',
            bounds: new RectBounds(-8, -16, 16, 16),
        });

        this.isCheckpointGot = false;
    }

    update() {
        super.update();
        if (!this.isCheckpointGot) {
            let players = this.world.select.overlap(this.bounds, ['player']);
            if (!_.isEmpty(players)) {
                this.checkpointGet(true);
            }
        }
    }

    checkpointGet(fanfare: boolean) {
        this.world.select.typeAll(Checkpoint).forEach(checkpoint => checkpoint.checkpointUnget());
        this.setTexture('checkpoint_high');
        this.isCheckpointGot = true;
        Checkpoints.current = this.name;

        if (fanfare) {
            Puff.puff(this.world, this.x, this.y, 10, () => pt(Random.float(-50, 50), Random.float(-40, 0)));
            this.world.playSound('checkpoint');
            //this.world.playSound('checkpoint2');
        }
    }

    checkpointUnget() {
        this.setTexture('checkpoint_low');
        this.isCheckpointGot = false;
    }
}

namespace Checkpoints {
    export function init(checkpoints: Checkpoint[]) {
        checkpoints.sort((a,b) => a.y - b.y);
        for (let i = 0; i < checkpoints.length; i++) {
            checkpoints[i].name = `checkpoint_${i+1}`;
            if (checkpoints[i].name === current) {
                checkpoints[i].checkpointGet(false);
            }
        }
    }

    export var current: string = 'checkpoint_4';
}