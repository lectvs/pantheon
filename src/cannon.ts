class Cannon extends Sprite {
    private readonly SHOT_SPEED = 250;
    
    constructor(tx: number, ty: number, angle: number) {
        super({
            x: tx*16 + 8,
            y: ty*16 + 8,
            texture: 'cannon',
            angle: angle,
            layer: 'entities',
            physicsGroup: 'cannons',
            bounds: new RectBounds(-7, -7, 14, 14),
        });
        let cannon = this;

        this.stateMachine.addState('shoot', {
            script: function* () {
                yield S.wait(1);
                if (cannon.world.camera.y - 120 < cannon.y && cannon.y < cannon.world.camera.y + 120) cannon.shoot();
            },
            transitions: [
                { toState: 'shoot' },
            ]
        });

        this.runScript(S.chain(
            S.wait(Random.float(this.x / 160)),
            S.call(() => this.setState('shoot'))
        ));
    }

    shoot() {
        let dir = V.rotated({ x: -1, y: 0 }, M.degToRad(this.angle + 45));
        let off = 10;
        this.world.addWorldObject(new Cannonball(this.x + dir.x*off, this.y + dir.y*off, V.withMagnitude(dir, this.SHOT_SPEED)));
        this.world.playSound('cannonshoot');
    }
}
