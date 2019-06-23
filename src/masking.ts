type Mask = PIXI.Sprite | PIXI.Graphics;

namespace Mask {
    export function drawRectangleMask(mask: PIXI.Graphics, rect: Rect) {
        mask.clear();
        mask.lineStyle(0);
        mask.beginFill(0xFFFFFF, 1);
        mask.drawRect(rect.x, rect.y, rect.width, rect.height);
        mask.endFill();
    }

    export function newRectangleMask(rect: Rect) {
        let result = new PIXI.Graphics();
        result.lineStyle(0);
        result.beginFill(0xFFFFFF, 1);
        result.drawRect(rect.x, rect.y, rect.width, rect.height);
        result.endFill();
        return result;
    }
}