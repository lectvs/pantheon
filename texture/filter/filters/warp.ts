namespace TextureFilters {
    export class Warp extends TextureFilter {
        constructor() {
            super({
                uniforms: {
                    'float x1': 0,
                    'float y1': 0,
                    'float x2': 1,
                    'float y2': 0,
                    'float x3': 0,
                    'float y3': 1,
                    'float x4': 1,
                    'float y4': 1,
                },
                code: `
                    float a1 = width * (x1);
                    float b1 = width * (x2 - x1);
                    float c1 = width * (x3 - x1);
                    float d1 = width * (x1 + x4 - x2 - x3);
                    float a2 = height * (y1);
                    float b2 = height * (y2 - y1);
                    float c2 = height * (y3 - y1);
                    float d2 = height * (y1 + y4 - y2 - y3);

                    float a = c2*d1 - c1*d2;
                    float b = a2*d1 - a1*d2 + b1*c2 - b2*c1 + x*d2 - y*d1;
                    float c = a2*b1 - a1*b2 + x*b2 - y*b1;
                    float disc = b*b - 4.0*a*c;

                    float py = -1.0;
                    if ((a == 0.0 && b == 0.0) || disc < 0.0) {
                        outp.a = 0.0;
                    } else if (a == 0.0) {
                        py = -c/b;
                    } else {
                        float pos = (-b + sqrt(disc)) / (2.0 * a);
                        float neg = (-b - sqrt(disc)) / (2.0 * a);
                        if (0.0 <= pos && pos <= 1.0) {
                            py = pos;
                        } else if (0.0 <= neg && neg <= 1.0) {
                            py = neg; //-0.02
                        }
                    }

                    float denom = b1 + d1*py;
                    if (py < 0.0 || 1.0 < py || denom == 0.0) {
                        outp.a = 0.0;
                    } else {
                        float px = (x - a1 - c1*py) / denom;
                        if (px < 0.0 || 1.0 < px) { 
                            outp.a = 0.0;
                        } else {
                            outp = getColor(px*84.0, py*64.0);
                        }
                    }
                `
            });
        }

        setVertex1(x: number, y: number) {
            this.setUniform('x1', x);
            this.setUniform('y1', y);
        }

        setVertex2(x: number, y: number) {
            this.setUniform('x2', x);
            this.setUniform('y2', y);
        }

        setVertex3(x: number, y: number) {
            this.setUniform('x3', x);
            this.setUniform('y3', y);
        }

        setVertex4(x: number, y: number) {
            this.setUniform('x4', x);
            this.setUniform('y4', y);
        }
    }
}