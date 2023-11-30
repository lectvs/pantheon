namespace TextureUtils {
    export function getTextureLocalBounds(texture: PIXI.Texture, properties: { x?: number, y?: number, scaleX?: number, scaleY?: number, angle?: number }) {
        let x = properties.x ?? 0;
        let y = properties.y ?? 0;
        let scaleX = properties.scaleX ?? 1;
        let scaleY = properties.scaleY ?? 1;
        let angle = properties.angle ?? 0;
        let width = texture.width * scaleX;
        let height = texture.height * scaleY;

        let v1x = 0;
        let v1y = 0;
        let v2x = width * M.cos(angle);
        let v2y = width * M.sin(angle);
        let v3x = -height * M.sin(angle);
        let v3y = height * M.cos(angle);
        let v4x = v2x + v3x;
        let v4y = v2y + v3y;

        let minx = Math.min(v1x, v2x, v3x, v4x);
        let maxx = Math.max(v1x, v2x, v3x, v4x);
        let miny = Math.min(v1y, v2y, v3y, v4y);
        let maxy = Math.max(v1y, v2y, v3y, v4y);

        return new Rectangle(x + minx, y + miny, maxx - minx, maxy - miny);
    }
}