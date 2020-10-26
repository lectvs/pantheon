function spawn(worldObject: WorldObject) {
    let spawn = new Sprite();
    spawn.name = 'spawn';
    spawn.layer = 'bg';
    spawn.x = worldObject.x;
    spawn.y = worldObject.y;
    spawn.setTexture('spawn');
    spawn.tint = 0x00FFFF;
    spawn.alpha = 0;
    spawn.data.flashed = false;
    spawn.updateCallback = obj => {
        if (!obj.data.flashed) {
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
            obj.data.flashed = true;
        }
    };

    return spawn;
}