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

    
    export class Maskf extends PIXI.Filter {
        rect: Rect;
        constructor(rect: Rect) {
            super(vert, frag, {});
            this.rect = rect;
            this.update();
        }

        update() {
            this.uniforms.filterDimensions = [Main.width, Main.width];
            this.uniforms.left = this.rect.x;
            this.uniforms.right = this.rect.x + this.rect.width;
            this.uniforms.top = this.rect.y;
            this.uniforms.bottom = this.rect.y + this.rect.height;
        }
    }

    export const vert = `
        attribute vec2 aVertexPosition;
        uniform mat3 projectionMatrix;
        varying vec2 vTextureCoord;
        uniform vec4 inputSize;
        uniform vec4 outputFrame;
        
        vec4 filterVertexPosition(void) {
            vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
            return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
        }
        
        vec2 filterTextureCoord(void) {
            return aVertexPosition * (outputFrame.zw * inputSize.zw);
        }
        
        void main(void) {
            gl_Position = filterVertexPosition();
            vTextureCoord = filterTextureCoord();
        }
    `;

    export const frag = `
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform vec2 filterDimensions;

        uniform float top;
        uniform float bottom;
        uniform float left;
        uniform float right;

        void main(void) {
            vec2 px = vec2(1.0/filterDimensions.x, 1.0/filterDimensions.y);
            vec4 c = texture2D(uSampler, vTextureCoord);

            if (vTextureCoord.x < left*px.x || vTextureCoord.x > right*px.x || vTextureCoord.y < top*px.y || vTextureCoord.y > bottom*px.y) {
                c.a = 0.0;
            }

            gl_FragColor = c * c.a;
        }
    `;
}