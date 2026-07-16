namespace GraphicsUtils {
    export function getFilterArea$(graphics: PIXI.Graphics, filters: TextureFilter[], x: number, y: number, scaleX: number, scaleY: number, angle: number) {
        let localBounds = GraphicsUtils.getGraphicsLocalBounds$(graphics, x, y, scaleX, scaleY, angle);

        if (!localBounds.isFinite()) {
            return undefined;
        }

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

    export function getGraphicsLocalBounds$(graphics: PIXI.Graphics, x: number, y: number, scaleX: number, scaleY: number, angle: number) {
        let baseBounds = FrameCache.rectangle(0, 0, 0, 0);
        graphics.getLocalBounds(baseBounds as any);

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
        let anchorX = 0.5;
        let anchorY = 0.5;
        let ax = Math.floor(anchorX * baseBounds.width) * scaleX;
        let ay = Math.floor(anchorY * baseBounds.height) * scaleY;
        let rotatedAndScaled_ax = (-ax) * M.cos(angle) - (-ay) * M.sin(angle);
        let rotatedAndScaled_ay = (-ax) * M.sin(angle) + (-ay) * M.cos(angle);

        return baseBounds.set(x + rotatedAndScaled_ax + minx, y + rotatedAndScaled_ay + miny, maxx - minx, maxy - miny);
    }
}