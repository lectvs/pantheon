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