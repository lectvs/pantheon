namespace Color {
    export function argbToVec4(argb: number): [number, number, number, number] {
        let a = (argb >> 24) & 255;
        let r = (argb >> 16) & 255;
        let g = (argb >> 8) & 255;
        let b = argb & 255;
        return [a/255, r/255, g/255, b/255];
    }

    export function blendAlpha(bgColor: number, fgColor: number, alpha: number) {
        let bgColorArray = M.colorToVec3(bgColor);
        let fgColorArray = M.colorToVec3(fgColor);

        let a = M.clamp(alpha, 0, 1);
        let blendedColorArray: [number, number, number] = [
            M.lerp(bgColorArray[0], fgColorArray[0], a),
            M.lerp(bgColorArray[1], fgColorArray[1], a),
            M.lerp(bgColorArray[2], fgColorArray[2], a),
        ];

        return M.vec3ToColor(blendedColorArray);
    }

    export function lerpColorByLch(color1: number, color2: number, t: number): number {
        if (color1 === color2) return color1;

        let vec3color1 = M.colorToVec3(color1);
        let vec3color2 = M.colorToVec3(color2);

        let chroma1 = chroma.rgb(vec3color1[0] * 255, vec3color1[1] * 255, vec3color1[2] * 255);
        let chroma2 = chroma.rgb(vec3color2[0] * 255, vec3color2[1] * 255, vec3color2[2] * 255);

        let chromaf = chroma.interpolate(chroma1, chroma2, t, 'lch');
        let rgbf = chromaf.rgb();

        return M.vec3ToColor([rgbf[0] / 255, rgbf[1] / 255, rgbf[2] / 255]);
    }

    export function lerpColorByRgb(color1: number, color2: number, t: number): number {
        if (color1 === color2) return color1;

        let vec3color1 = M.colorToVec3(color1);
        let vec3color2 = M.colorToVec3(color2);

        let chroma1 = chroma.rgb(vec3color1[0] * 255, vec3color1[1] * 255, vec3color1[2] * 255);
        let chroma2 = chroma.rgb(vec3color2[0] * 255, vec3color2[1] * 255, vec3color2[2] * 255);

        let chromaf = chroma.interpolate(chroma1, chroma2, t, 'rgb');
        let rgbf = chromaf.rgb();

        return M.vec3ToColor([rgbf[0] / 255, rgbf[1] / 255, rgbf[2] / 255]);
    }

    export function vec4ToArgb(vec3: [number, number, number, number]) {
        return (Math.round(vec3[0] * 255) << 24) + (Math.round(vec3[1] * 255) << 16) + (Math.round(vec3[2] * 255) << 8) + Math.round(vec3[3] * 255);
    }
}