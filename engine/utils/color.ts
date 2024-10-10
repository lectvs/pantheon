namespace Color {
    export function argbToVec4(argb: number): [number, number, number, number] {
        let a = (argb >> 24) & 255;
        let r = (argb >> 16) & 255;
        let g = (argb >> 8) & 255;
        let b = argb & 255;
        return [a/255, r/255, g/255, b/255];
    }

    export function blendAlpha(bgColor: number, fgColor: number, alpha: number) {
        let bgColorArray = colorToVec3(bgColor);
        let fgColorArray = colorToVec3(fgColor);

        let a = M.clamp(alpha, 0, 1);
        let r = M.lerp(a, bgColorArray[0], fgColorArray[0]);
        let g = M.lerp(a, bgColorArray[1], fgColorArray[1]);
        let b = M.lerp(a, bgColorArray[2], fgColorArray[2]);

        return xyzToColor(r, g, b);
    }

    export function colorToVec3(color: number): [number, number, number] {
        let r = (color >> 16) & 255;
        let g = (color >> 8) & 255;
        let b = color & 255;
        return [r/255, g/255, b/255];
    }

    export function lerpColorByLch(t: number, color1: number, color2: number, easingFn: Tween.Easing.Function = Tween.Easing.Linear): number {
        if (color1 === color2) return color1;

        let vec3color1 = colorToVec3(color1);
        let vec3color2 = colorToVec3(color2);

        let chroma1 = chroma.rgb(vec3color1[0] * 255, vec3color1[1] * 255, vec3color1[2] * 255);
        let chroma2 = chroma.rgb(vec3color2[0] * 255, vec3color2[1] * 255, vec3color2[2] * 255);

        let chromaf = chroma.interpolate(chroma1, chroma2, easingFn(t), 'lch');
        let rgbf = chromaf.rgb();

        return xyzToColor(rgbf[0] / 255, rgbf[1] / 255, rgbf[2] / 255);
    }

    export function lerpColorByRgb(t: number, color1: number, color2: number, easingFn: Tween.Easing.Function = Tween.Easing.Linear): number {
        if (color1 === color2) return color1;

        let vec3color1 = colorToVec3(color1);
        let vec3color2 = colorToVec3(color2);

        let chroma1 = chroma.rgb(vec3color1[0] * 255, vec3color1[1] * 255, vec3color1[2] * 255);
        let chroma2 = chroma.rgb(vec3color2[0] * 255, vec3color2[1] * 255, vec3color2[2] * 255);

        let chromaf = chroma.interpolate(chroma1, chroma2, easingFn(t), 'rgb');
        let rgbf = chromaf.rgb();

        return xyzToColor(rgbf[0] / 255, rgbf[1] / 255, rgbf[2] / 255);
    }

    export function rgbaToVec4(rgba: number): [number, number, number, number] {
        return argbToVec4(rgba);
    }

    export function combineTints(tint1: number, tint2: number) {
        if (tint1 === 0xFFFFFF) return tint2;
        if (tint2 === 0xFFFFFF) return tint1;
        let tint1R = (tint1 >> 16) & 255;
        let tint1G = (tint1 >> 8) & 255;
        let tint1B = tint1 & 255;
        let tint2R = (tint2 >> 16) & 255;
        let tint2G = (tint2 >> 8) & 255;
        let tint2B = tint2 & 255;
        return (Math.round(tint1R * tint2R / 255) << 16) + (Math.round(tint1G * tint2G / 255) << 8) + Math.round(tint1B * tint2B / 255);
    }

    export function vec3ToColor(vec3: [number, number, number]) {
        return xyzToColor(vec3[0], vec3[1], vec3[2]);
    }

    export function vec4ToArgb(vec4: [number, number, number, number]) {
        return xyzwToArgb(vec4[0], vec4[1], vec4[2], vec4[3]);
    }

    export function xyzToColor(x: number, y: number, z: number) {
        return (Math.round(x * 255) << 16) + (Math.round(y * 255) << 8) + Math.round(z * 255);
    }

    export function xyzwToArgb(x: number, y: number, z: number, w: number) {
        return (Math.round(x * 255) << 24) + (Math.round(y * 255) << 16) + (Math.round(z * 255) << 8) + Math.round(w * 255);
    }
}