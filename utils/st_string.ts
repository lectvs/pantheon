namespace St {
    export function isEmpty(text: string) {
        return !text;
    }

    export function isBlank(text: string) {
        return isEmpty(text) || isEmpty(text.trim());
    }

    export function padLeft(text: string, minLength: number, padString: string = ' ') {
        while (text.length < minLength) {
            text = padString + text;
        }
        return text;
    }

    export function padLeftRight(text: string, minLength: number, extraPadBias: 'left' | 'right' | 'both' | 'none', padString: string = ' ', ) {
        while (text.length < minLength-1) {
            text = padString + text + padString;
        }
        if (text.length === minLength-1) {
            if (extraPadBias === 'left') return padString + text;
            if (extraPadBias === 'right') return text + padString;
            if (extraPadBias === 'both') return padString + text + padString;
        }
        return text;
    }

    export function padRight(text: string, minLength: number, padString: string = ' ') {
        while (text.length < minLength) {
            text = text + padString;
        }
        return text;
    }

    export function replaceAll(str: string, replace: string, wiith: string) {
        if (!str) return "";
        return str.split(replace).join(wiith);
    }

    export function splitOnWhitespace(str: string) {
        if (_.isEmpty(str)) return [];
        return str.match(/\S+/g) || [];
    }
}