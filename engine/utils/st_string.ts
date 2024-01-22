namespace St {
    export function asciiToBinary(ascii: string) {
        let result = '';
        for (let i = 0; i < ascii.length; i++) {
            let bin = ascii[i].charCodeAt(0).toString(2);
            result += Array(8 - bin.length + 1).join('0') + bin;
        }
        return result;
    }

    export function binaryToAscii(binary: string) {
        let arr = binary.match(/.{1,8}/g);
        if (!arr) return '';
        let result = '';
        for (let i = 0; i < arr.length; i++) {
            result += String.fromCharCode(parseInt(arr[i], 2));
        }
        return result;
    }

    export function encodeB64S(text: string) {
        let binary = St.asciiToBinary(text);
        return btoa(St.binaryToAscii(binary[binary.length-1] + binary.substring(0, binary.length-1)));
    }

    export function decodeB64S(text: string) {
        let binary = St.asciiToBinary(atob(text));
        return St.binaryToAscii(binary.substring(1) + binary[0]);
    }

    export function isBlank(text: string | undefined | null): text is undefined {
        return isEmpty(text) || isEmpty(text!.trim());
    }

    export function isEmpty(text: string | undefined | null): text is undefined {
        return !text || text.length === 0;
    }

    export function isString(obj: any): obj is string {
        return typeof obj === 'string';
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

    export function removeWhitespace(str: string) {
        return str.replace(/\s/g, '');
    }

    export function replaceAll(str: string, replace: string, wiith: string) {
        if (!str) return "";
        return str.split(replace).join(wiith);
    }

    export function splitOnWhitespace(str: string): string[] {
        if (isEmpty(str)) return [];
        return str.match(/\S+/g) || [];
    }
}