namespace Color {
    // Source: https://github.com/gka/chroma.js/blob/master/src/interpolator/_hsx.js
    export function lerplch([l1, c1, h1]: [number, number, number], [l2, c2, h2]: [number, number, number], t: number): [number, number, number] {
        let hf: number, cf: number, lf: number;
        if (!isNaN(h1) && !isNaN(h2)) {
            let dh: number;
            if (h2 > h1 && h2 - h1 > 180) {
                dh = h2 - (h1 + 360);
            } else if (h2 < h1 && h1 - h2 > 180) {
                dh = h2 + 360 - h1;
            } else {
                dh = h2 - h1;
            }
            hf = h1 + t * dh;
        } else if (!isNaN(h1)) {
            hf = h1;
            if (l2 === 1 || l2 === 0) cf = c1;
        }  else if (!isNaN(h2)) {
            hf = h2;
            if (l1 === 1 || l1 === 0) cf = c2;
        } else {
            hf = Number.NaN;
        }

        if (cf === undefined) cf = c1 + t * (c2 - c1);
        lf = l1 + t * (l2 - l1);
        return [lf, cf, hf];
    }

    // Source: https://github.com/gka/chroma.js/blob/master/src/io/lch/rgb2lch.js
    export function rgb2lch(rgb: [number, number, number]) {
        return lab2lch(rgb2lab(rgb));
    }

    // Source: https://github.com/gka/chroma.js/blob/master/src/io/lch/lch2rgb.js
    export function lch2rgb(lch: [number, number, number]) {
        return lab2rgb(lch2lab(lch));
    }

    // Source: https://github.com/gka/chroma.js/blob/master/src/io/lch/lab2lch.js
    function lab2lch([l, a, b]: [number, number, number]): [number, number, number] {
        let c = Math.sqrt(a*a + b*b);
        let h = (Math.atan2(b, a) * (180/Math.PI) + 360) % 360;
        if (Math.round(c * 10000) === 0) h = Number.NaN;
        return [l, c, h];
    }

    // Source: https://github.com/gka/chroma.js/blob/master/src/io/lab/lab2rgb.js
    function lab2rgb([l, a, b]: [number, number, number]): [number, number, number] {
        let y = (l + 16) / 116;
        let x = isNaN(a) ? y : y + a / 500;
        let z = isNaN(b) ? y : y - b / 200;

        y = 1.000000 * lab_xyz(y);
        x = 0.950470 * lab_xyz(x);
        z = 1.088830 * lab_xyz(z);

        let rgbr = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
        let rgbg = xyz_rgb(-0.969266 * x + 1.8760108 * y + 0.0415560 * z);
        let rgbb = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

        return [rgbr, rgbg, rgbb];
    }

    // Source: https://github.com/gka/chroma.js/blob/master/src/io/lch/lch2lab.js
    function lch2lab([l, c, h]: [number, number, number]): [number, number, number] {
        if (isNaN(h)) h = 0;
        h = h * (Math.PI/180);
        return [l, Math.cos(h) * c, Math.sin(h) * c];
    }

    // Source: https://github.com/gka/chroma.js/blob/master/src/io/lab/rgb2lab.js
    function rgb2lab(rgb: [number, number, number]): [number, number, number] {
        let [x, y, z] = rgb2xyz(rgb);
        let l = 116 * y - 16;
        return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
    }

    function rgb2xyz([r, g, b]: [number, number, number]): [number, number, number] {
        r = rgb_xyz(r);
        g = rgb_xyz(g);
        b = rgb_xyz(b);
        let x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.950470);
        let y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / 1.000000);
        let z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / 1.088830);
        return [x, y, z];
    }

    function rgb_xyz(r: number): number {
        r /= 255;
        if (r < 0.04045) return r / 12.92;
        return Math.pow((r + 0.055) / 1.055, 2.4);
    }

    function xyz_lab(t: number): number {
        if (t > 0.008856452) return Math.pow(t, 1/3);
        return t / 0.12841855 + 0.137931034;
    }

    function xyz_rgb(r: number): number {
        return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055);
    }

    function lab_xyz(t: number): number {
        return t > 0.206896552 ? t*t*t : 0.12841855 * (t - 0.137931034);
    }
}