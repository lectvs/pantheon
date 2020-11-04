function deadBody(parent: Enemy, texture: string) {

    let deadBody = new Sprite();
    deadBody.name = 'deadbody';
    deadBody.layer = 'bg';
    deadBody.x = parent.x;
    deadBody.y = parent.y;
    deadBody.v.x = parent.v.x;
    deadBody.v.y = parent.v.y;
    deadBody.setTexture(texture);
    deadBody.flipX = parent.v.x > 0;
    deadBody.tint = parent.tint === 0xFFFF00 ? 0x888800 : (parent.tint === 0xFF00FF ? 0x880088 : 0x888888);
    deadBody.effects.updateFromConfig({
        silhouette: { color: 0xFFFFFF },
        outline: { color: parent.effects.outline.color === 0xFFFFFF ? 0x555555 : 0x000000 },
    });
    deadBody.bounds = new CircleBounds(0, -2, 8);
    deadBody.onAddCallback = obj => {
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
    };
    deadBody.updateCallback = obj => {
        obj.v.x = M.lerpTime(obj.v.x, 0, 10, obj.delta);
        obj.v.y = M.lerpTime(obj.v.y, 0, 10, obj.delta);
    };

    return deadBody;
}