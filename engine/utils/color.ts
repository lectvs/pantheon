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

    export function tint(color: number, tint: number) {
        let colorR = (color >> 16) & 255;
        let colorG = (color >> 8) & 255;
        let colorB = color & 255;
        let tintR = (tint >> 16) & 255;
        let tintG = (tint >> 8) & 255;
        let tintB = tint & 255;
        return (Math.round(colorR * tintR / 255) << 16) + (Math.round(colorG * tintG / 255) << 8) + Math.round(colorB * tintB / 255);
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