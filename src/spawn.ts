function spawn(worldObject: WorldObject) {
    let spawn = new Sprite({
        name: 'spawn',
        layer: 'bg',
        x: worldObject.x, y: worldObject.y,
        texture: 'spawn',
        tint: 0x00FFFF,
        alpha: 0,
        onAdd: obj => {
            obj.runScript(S.chain(
                S.doOverTime(1, t => {
                    obj.alpha = t;
                }),
                S.wait(1),
                S.call(() => {
                    obj.world.addWorldObject(worldObject);
                    obj.kill();
                }),
            ));
        }
    });

    return spawn;
}