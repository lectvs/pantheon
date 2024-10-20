/// <reference path="../../worldObject/module/module.ts" />

class KillOnPause extends Module<WorldObject> {
    constructor() {
        super(WorldObject);
    }

    override update(): void {
        super.update();

        if (Input.isDown(Input.GAME_PAUSE) && !this.worldObject.isControlRevoked()) {
            this.worldObject.kill();
            Input.consume(Input.GAME_PAUSE);
        }
    }
}