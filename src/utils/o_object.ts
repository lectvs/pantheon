namespace O {
    export function getOrDefault<T>(obj: T, def: T) {
        return obj === undefined ? def : obj;
    }

    export function withDefaults<T>(obj: T, defaults: any): T {
        let result = _.clone(obj);
        _.defaults(result, defaults);
        return result;
    }

    export function withOverrides<T>(obj: T, overrides: any): T {
        let result = _.clone(obj);
        _.extend(result, overrides);
        return result;
    }
}