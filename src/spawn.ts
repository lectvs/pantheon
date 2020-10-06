function spawn(config: WorldObject.Config) {
    return <Sprite.Config>{
        name: 'spawn',
        constructor: Sprite,
        x: config.x, y: config.y,
        texture: 'spawn',
        tint: 0x00FFFF,
        alpha: 0,
        layer: 'bg',
        data: { flashed: false },
        updateCallback: (obj: Sprite) => {
            if (!obj.data.flashed) {
                obj.runScript(S.chain(
                    S.doOverTime(1, t => {
                        obj.alpha = t;
                    }),
                    S.wait(1),
                    S.call(() => {
                        obj.world.addWorldObject(config);
                        obj.kill();
                    }),
                ));
                obj.data.flashed = true;
            }
        }
    };
}