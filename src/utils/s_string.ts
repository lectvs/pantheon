namespace S {
    export function splitOnWhitespace(str: string) {
        if (_.isEmpty(str)) return [];
        return str.match(/\S+/g) || [];
    }
}