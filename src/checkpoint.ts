class Checkpoint extends Sprite {

    isCheckpointGot: boolean;

    constructor(x: number, y: number, angle: number) {
        super({
            x: x, y: y,
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
            Puff.puff(this.world, this.x, this.y, 10, () => vec2(Random.float(-50, 50), Random.float(-40, 0)));
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

    export function killCheckpointsForHardMode(checkpoints: Checkpoint[]) {
        if (!hardCheckpoints) return;
        if (!current) return;

        let current_i = checkpoints.findIndex(cp => cp.name === current);
        if (current_i < 0) return;

        for (let checkpoint of checkpoints.splice(0, current_i+1)) {
            checkpoint.removeFromWorld();
        }

        this.current = undefined;
    }

    export var current: string = 'checkpoint_10';
    export var hardCheckpoints:  boolean = false;
}