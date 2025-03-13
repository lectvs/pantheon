/// <reference path="./a_array.ts" />

class Perlin {
    /**
     * Normalized to [-1, 1].
     * Algorithm taken from https://adrianb.io/2014/08/09/perlinnoise.html
     */
    get(x: number, y: number = 0, z: number = 0) {
        let xi = Math.floor(x) & 255;
        let yi = Math.floor(y) & 255;
        let zi = Math.floor(z) & 255;
        let xf = x - Math.floor(x);
        let yf = y - Math.floor(y);
        let zf = z - Math.floor(z);
        let u = this.fade(xf);
        let v = this.fade(yf);
        let w = this.fade(zf);
    
        let aaa = this.hash(xi  , yi  , zi  );
        let aba = this.hash(xi  , yi+1, zi  );
        let aab = this.hash(xi  , yi  , zi+1);
        let abb = this.hash(xi  , yi+1, zi+1);
        let baa = this.hash(xi+1, yi  , zi  );
        let bba = this.hash(xi+1, yi+1, zi  );
        let bab = this.hash(xi+1, yi  , zi+1);
        let bbb = this.hash(xi+1, yi+1, zi+1);

        let x11 = M.lerp(u, this.grad(aaa, xf, yf  , zf  ), this.grad(baa, xf-1, yf  , zf  ));
        let x12 = M.lerp(u, this.grad(aba, xf, yf-1, zf  ), this.grad(bba, xf-1, yf-1, zf  ));
        let x21 = M.lerp(u, this.grad(aab, xf, yf  , zf-1), this.grad(bab, xf-1, yf  , zf-1));
        let x22 = M.lerp(u, this.grad(abb, xf, yf-1, zf-1), this.grad(bbb, xf-1, yf-1, zf-1));
        let y1 = M.lerp(v, x11, x12);
        let y2 = M.lerp(v, x21, x22);

        return M.lerp(w, y1, y2);
    }

    private fade(t: number) {
        // 6t^5 - 15t^4 + 10t^3
        return t*t*t*(t*(t*6-15)+10);
    }

    private grad(hash: number, x: number, y: number, z: number) {
        switch (hash & 0xF) {
            case 0x0: return  x + y;
            case 0x1: return -x + y;
            case 0x2: return  x - y;
            case 0x3: return -x - y;
            case 0x4: return  x + z;
            case 0x5: return -x + z;
            case 0x6: return  x - z;
            case 0x7: return -x - z;
            case 0x8: return  y + z;
            case 0x9: return -y + z;
            case 0xA: return  y - z;
            case 0xB: return -y - z;
            case 0xC: return  y + x;
            case 0xD: return -y + z;
            case 0xE: return  y - x;
            case 0xF: return -y - z;
            default: return 0;
        }
    }

    private hash(x: number, y: number, z: number) {
        return Perlin.PERMUTATION[Perlin.PERMUTATION[Perlin.PERMUTATION[x] + y] + z];
    }

    // Hash lookup table as defined by Ken Perlin.  This is a randomly
    // arranged array of all numbers from 0-255 inclusive.
    private static readonly PERMUTATION = A.repeat([ 151,160,137,91,90,15,                 
        131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,    
        190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
        88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
        77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
        102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
        135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
        5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
        223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
        129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
        251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
        49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
        138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180], 2);

    // From https://thebookofshaders.com/11/
    static readonly SHADER_SOURCE = `
        // From https://lygia.xyz/generative/random
        float random(vec2 st) {
            return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float random(vec3 st) {
            return fract(sin(dot(st, vec3(70.9898, 78.233, 32.4355))) * 43758.5453123);
        }

        // Normalized to (-1, 1)
        float pnoise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);

            vec2 u = f*f*(3.0-2.0*f);

            float p00 = random(i + vec2(0.0, 0.0));
            float p01 = random(i + vec2(0.0, 1.0));
            float p10 = random(i + vec2(1.0, 0.0));
            float p11 = random(i + vec2(1.0, 1.0));

            float p0 = lerp(p00, p01, u.y);
            float p1 = lerp(p10, p11, u.y);

            float p = lerp(p0, p1, u.x);

            return (p * 2.0) - 1.0;
        }

        // Normalized to (-1, 1)
        float pnoise(vec3 st) {
            vec3 i = floor(st);
            vec3 f = fract(st);

            vec3 u = f*f*(3.0-2.0*f);

            float p000 = random(i + vec3(0.0, 0.0, 0.0));
            float p001 = random(i + vec3(0.0, 0.0, 1.0));
            float p010 = random(i + vec3(0.0, 1.0, 0.0));
            float p011 = random(i + vec3(0.0, 1.0, 1.0));
            float p100 = random(i + vec3(1.0, 0.0, 0.0));
            float p101 = random(i + vec3(1.0, 0.0, 1.0));
            float p110 = random(i + vec3(1.0, 1.0, 0.0));
            float p111 = random(i + vec3(1.0, 1.0, 1.0));

            float p00 = lerp(p000, p001, u.z);
            float p01 = lerp(p010, p011, u.z);
            float p10 = lerp(p100, p101, u.z);
            float p11 = lerp(p110, p111, u.z);

            float p0 = lerp(p00, p01, u.y);
            float p1 = lerp(p10, p11, u.y);

            float p = lerp(p0, p1, u.x);

            return (p * 2.0) - 1.0;
        }

        // Normalized to (-1, 1)
        float pnoise(float x, float y) {
            return pnoise(vec2(x, y));
        }

        // Normalized to (-1, 1)
        float pnoise(float x, float y, float z) {
            return pnoise(vec3(x, y, z));
        }

        // Normalized to (0, 1)
        float pnoise01(vec2 st) {
            return map(pnoise(st), -1.0, 1.0, 0.0, 1.0);
        }

        // Normalized to (0, 1)
        float pnoise01(vec3 st) {
            return map(pnoise(st), -1.0, 1.0, 0.0, 1.0);
        }

        // Normalized to (0, 1)
        float pnoise01(float x, float y) {
            return map(pnoise(x, y), -1.0, 1.0, 0.0, 1.0);
        }

        // Normalized to (0, 1)
        float pnoise01(float x, float y, float z) {
            return map(pnoise(x, y, z), -1.0, 1.0, 0.0, 1.0);
        }

        // Normalized to (-1, 1)
        // x - input value
        // min/max - wrapping bounds of x
        // circleRadius - radius of circle in p-space
        float pnoiseCircle(float x, float min, float max, float circleRadius) {
            float angle = map(x, min, max, 0.0, TWOPI);
            return pnoise(circleRadius * cos(angle), circleRadius * sin(angle));
        }

        // Normalized to (-1, 1)
        float pnoiseCircle(float x, float min, float max, float circleRadius, float z) {
            float angle = map(x, min, max, 0.0, TWOPI);
            return pnoise(circleRadius * cos(angle), circleRadius * sin(angle), z);
        }

        // Normalized to (0, 1)
        float pnoiseCircle01(float x, float min, float max, float circleRadius) {
            return map(pnoiseCircle(x, min, max, circleRadius), -1.0, 1.0, 0.0, 1.0);
        }

        // Normalized to (0, 1)
        float pnoiseCircle01(float x, float min, float max, float circleRadius, float z) {
            return map(pnoiseCircle(x, min, max, circleRadius, z), -1.0, 1.0, 0.0, 1.0);
        }
    `;
}