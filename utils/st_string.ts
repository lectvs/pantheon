namespace St {
    export function asciiToBinary(ascii: string) {
        let result = "";
        for (var i = 0; i < ascii.length; i++) {
            var bin = ascii[i].charCodeAt(0).toString(2);
            result += Array(8 - bin.length + 1).join("0") + bin;
        }
        return result;
    }

    export function binaryToAscii(binary: string) {
        var result = "";
            var arr = binary.match(/.{1,8}/g);
            for (var i = 0; i < arr.length; i++) {
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