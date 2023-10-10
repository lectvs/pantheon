namespace TextureFilters {
    export class Slice extends TextureFilter {
        constructor(rect: Rect) {
            super({
                uniforms: {
                    'float sliceX': rect.x,
                    'float sliceY': rect.y,
                    'float sliceWidth': rect.width,
                    'float sliceHeight': rect.height,
                },
                code: `
                    if (x < sliceX || x >= sliceX + sliceWidth || y < sliceY || y >= sliceY + sliceHeight) {
                        outp.a = 0.0;
                    }
                `
            });
        }
    
        setSlice(rect: Rect) {
            this.setUniforms({
                'sliceX': rect.x,
                'sliceY': rect.y,
                'sliceWidth': rect.width,
                'sliceHeight': rect.height,
            });
        }
    }
}