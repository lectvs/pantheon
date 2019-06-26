namespace S {
    export function replaceAll(str: string, replace: string, wiith: string) {
        if (!str) return "";
        return str.split(replace).join(wiith);
    }

    export function splitOnWhitespace(str: string) {
        if (_.isEmpty(str)) return [];
        return str.match(/\S+/g) || [];
    }
}