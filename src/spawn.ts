function spawn(worldObject: WorldObject) {
    let spawn = new Sprite({
        name: 'spawn',
        layer: 'bg',
        x: worldObject.x, y: worldObject.y,
        texture: 'spawn',
        tint: 0x00FFFF,
        alpha: 0,
        onAdd: function() {
            this.runScript(S.chain(
                S.doOverTime(1, t => {
                    this.alpha = t;
                }),
                S.wait(1),
                S.call(() => {
                    this.world.addWorldObject(worldObject);
                    this.kill();
                }),
            ));
        }
    });

    return spawn;
}