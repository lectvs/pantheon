namespace GraphicsUtils {
    export function getFilterArea$(graphics: PIXI.Graphics, filters: TextureFilter[], x: number, y: number, scaleX: number, scaleY: number, angle: number) {
        let localBounds = GraphicsUtils.getGraphicsLocalBounds$(graphics, x, y, scaleX, scaleY, angle);

        if (!localBounds.isFinite()) {
            return undefined;
        }

        // Add padding because the local bounds method is not super accurate
        localBounds.scale(1.5);

        if (!A.isEmpty(filters)) {
            for (let filter of filters) {
                let visualPadding = filter.getVisualPadding();
                if (!isFinite(visualPadding)) return undefined;
                localBounds.x -= visualPadding;
                localBounds.y -= visualPadding;
                localBounds.width += 2*visualPadding;
                localBounds.height += 2*visualPadding;
            }
        }

        return localBounds;
    }

    // Calculating precise graphics local bounds would be expensive and require modifying the pixijs source code, so this
    // is an approximation. It uses graphics.getLocalBounds and treats those bounds as if the graphics was a rectangular
    // texture. So if the graphics rotates, the local bounds will expand as if the whole bounding box was rotating.
    // This may not be super accurate...
    export function getGraphicsLocalBounds$(graphics: PIXI.Graphics, x: number, y: number, scaleX: number, scaleY: number, angle: number) {
        let baseBounds = FrameCache.rectangle(0, 0, 0, 0);
        graphics.getLocalBounds(baseBounds as any);
        baseBounds.scaleX(scaleX);
        baseBounds.scaleY(scaleY);

        let v1x = 0;
        let v1y = 0;
        let v2x = baseBounds.width * M.cos(angle);
        let v2y = baseBounds.width * M.sin(angle);
        let v3x = -baseBounds.height * M.sin(angle);
        let v3y = baseBounds.height * M.cos(angle);
        let v4x = v2x + v3x;
        let v4y = v2y + v3y;

        let minx = Math.min(v1x, v2x, v3x, v4x);
        let maxx = Math.max(v1x, v2x, v3x, v4x);
        let miny = Math.min(v1y, v2y, v3y, v4y);
        let maxy = Math.max(v1y, v2y, v3y, v4y);

        // Anchor adjustment
        let anchorX = -baseBounds.x / baseBounds.width;
        let anchorY = -baseBounds.y / baseBounds.height;
        let ax = Math.floor(anchorX * baseBounds.width);
        let ay = Math.floor(anchorY * baseBounds.height);
        let rotatedAndScaled_ax = (-ax) * M.cos(angle) - (-ay) * M.sin(angle);
        let rotatedAndScaled_ay = (-ax) * M.sin(angle) + (-ay) * M.cos(angle);

        return baseBounds.set(x + rotatedAndScaled_ax + minx, y + rotatedAndScaled_ay + miny, maxx - minx, maxy - miny);
    }
}