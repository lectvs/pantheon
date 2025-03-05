namespace Mask {
    export type Config = {
        texture: PIXI.Texture;
        x?: number;
        y?: number;
        relativeTo?: 'world' | 'worldobject';
        textureAnchor?: Vector2;
        scaleX?: number;
        scaleY?: number;
        angle?: number;
    }
}