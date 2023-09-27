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
        let blendedColorArray: [number, number, number] = [
            M.lerp(a, bgColorArray[0], fgColorArray[0]),
            M.lerp(a, bgColorArray[1], fgColorArray[1]),
            M.lerp(a, bgColorArray[2], fgColorArray[2]),
        ];

        return vec3ToColor(blendedColorArray);
    }

    export function colorToVec3(color: number): [number, number, number] {
        let r = (color >> 16) & 255;
        let g = (color >> 8) & 255;
        let b = color & 255;
        return [r/255, g/255, b/255];
    }

    export function lerpColorByLch(t: number, color1: number, color2: number): number {
        if (color1 === color2) return color1;

        let vec3color1 = colorToVec3(color1);
        let vec3color2 = colorToVec3(color2);

        let chroma1 = chroma.rgb(vec3color1[0] * 255, vec3color1[1] * 255, vec3color1[2] * 255);
        let chroma2 = chroma.rgb(vec3color2[0] * 255, vec3color2[1] * 255, vec3color2[2] * 255);

        let chromaf = chroma.interpolate(chroma1, chroma2, t, 'lch');
        let rgbf = chromaf.rgb();

        return vec3ToColor([rgbf[0] / 255, rgbf[1] / 255, rgbf[2] / 255]);
    }

    export function lerpColorByRgb(t: number, color1: number, color2: number): number {
        if (color1 === color2) return color1;

        let vec3color1 = colorToVec3(color1);
        let vec3color2 = colorToVec3(color2);

        let chroma1 = chroma.rgb(vec3color1[0] * 255, vec3color1[1] * 255, vec3color1[2] * 255);
        let chroma2 = chroma.rgb(vec3color2[0] * 255, vec3color2[1] * 255, vec3color2[2] * 255);

        let chromaf = chroma.interpolate(chroma1, chroma2, t, 'rgb');
        let rgbf = chromaf.rgb();

        return vec3ToColor([rgbf[0] / 255, rgbf[1] / 255, rgbf[2] / 255]);
    }

    export function vec3ToColor(vec3: [number, number, number]) {
        return (Math.round(vec3[0] * 255) << 16) + (Math.round(vec3[1] * 255) << 8) + Math.round(vec3[2] * 255);
    }

    export function vec4ToArgb(vec3: [number, number, number, number]) {
        return (Math.round(vec3[0] * 255) << 24) + (Math.round(vec3[1] * 255) << 16) + (Math.round(vec3[2] * 255) << 8) + Math.round(vec3[3] * 255);
    }
}