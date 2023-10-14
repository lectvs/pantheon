namespace SpriteTextFormations {
    export function rainbow(text: string) {
        let colors = [
            0xFF0000,
            0xFF6600,
            0xFFFF00,
            0x00FF00,
            0x00D1FF,
            0x0000FF,
            0xDD00B2,
        ];

        let colori = 0;
        let result = "";
        for (let char of text) {
            if (St.isBlank(char)) {
                result += char;
            } else {
                result += `[color ${colors[colori]}]${char}[/]`;
                colori = (colori + 1) % colors.length;
            }
        }

        return result;
    }
}