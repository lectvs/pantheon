function deadBody(parent: Enemy, texture: string) {

    let deadBody = new Sprite();
    deadBody.name = 'deadbody';
    deadBody.layer = 'bg';
    deadBody.x = parent.x;
    deadBody.y = parent.y;
    deadBody.vx = parent.vx;
    deadBody.vy = parent.vy;
    deadBody.setTexture(texture);
    deadBody.flipX = parent.vx > 0;
    deadBody.tint = parent.tint === 0xFFFF00 ? 0x888800 : (parent.tint === 0xFF00FF ? 0x880088 : 0x888888);
    deadBody.effects.updateFromConfig({
        silhouette: { color: 0xFFFFFF },
        outline: { color: parent.effects.outline.color === 0xFFFFFF ? 0x555555 : 0x000000 },
    });
    deadBody.bounds = new CircleBounds(0, -2, 8, deadBody);
    deadBody.data.flashed = false;
    deadBody.updateCallback = obj => {
        if (!obj.data.flashed) {
            obj.runScript(S.chain(
                S.wait(0.05),
                S.call(() => obj.effects.silhouette.enabled = false),
                S.wait(3),
                S.call(() => {
                    // if (obj.world.hasWorldObject('floor')) {
                    //     obj.getTexture().renderTo(obj.world.select.name<Sprite>('floor').getTexture(), {
                    //         x: obj.x,
                    //         y: obj.y,
                    //         tint: obj.tint,
                    //         scaleX: obj.flipX ? -1 : 1,
                    //         filters: [ obj.effects.outline ],
                    //     });
                    // }
                    // obj.kill();
                }),
            ));
            obj.data.flashed = true;
        }
        obj.vx = M.lerpTime(obj.vx, 0, 10, obj.delta);
        obj.vy = M.lerpTime(obj.vy, 0, 10, obj.delta);
    };

    return deadBody;
}