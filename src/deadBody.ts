function deadBody(parent: Enemy, texture: string) {
    return new Sprite({
        name: 'deadbody',
        layer: 'bg',
        physicsGroup: 'deadbodies',
        x: parent.x, y: parent.y,
        vx: parent.v.x, vy: parent.v.y,
        texture: texture,
        flipX: parent.v.x > 0,
        tint: parent.tint === 0xFFFF00 ? 0x888800 : (parent.tint === 0xFF00FF ? 0x880088 : 0x888888),
        effects: {
            silhouette: { color: 0xFFFFFF },
            outline: { color: parent.effects.outline.color === 0xFFFFFF ? 0x555555 : 0x000000 } 
        },
        bounds: new CircleBounds(0, -2, 8),
        onAdd: obj => {
            obj.runScript(S.chain(
                S.wait(0.05),
                S.call(() => obj.effects.silhouette.enabled = false),
                S.wait(1),
                S.call(() => {
                    if (obj.world.hasWorldObject('floor')) {
                        obj.render(obj.world.select.name<Sprite>('floor').getTexture(), obj.x, obj.y);
                    }
                    obj.kill();
                }),
            ));
        },
        update: obj => {
            obj.v.x = M.lerpTime(obj.v.x, 0, 10, obj.delta);
            obj.v.y = M.lerpTime(obj.v.y, 0, 10, obj.delta);
        }
    });
}