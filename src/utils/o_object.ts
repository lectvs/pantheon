namespace O {
    export function deepClone<T>(obj: T): T {
        let result: any = {};
        for (let key in obj) {
            if (obj[key] && _.isObject(obj[key])) {
                result[key] = deepClone(obj[key]);
            } else {
                result[key] = obj[key];
            }
        }
        return <T>result;
    }
    export function deepOverride<T>(obj: T, overrides: any) {
        for (let key in overrides) {
            if (obj[key] && _.isObject(obj[key]) && _.isObject(overrides[key])) {
                deepOverride(obj[key], overrides[key]);
            } else {
                obj[key] = overrides[key];
            }
        }
    }

    export function getOrDefault<T>(obj: T, def: T) {
        return obj === undefined ? def : obj;
    }

    export function mergeObject<T>(obj: T, into: T, combine: (e: any, into: any) => any = ((e, into) => e)) {
        let result = _.clone(into);
        for (let key in obj) {
            if (result[key]) {
                result[key] = combine(obj[key], result[key]);
            } else {
                result[key] = obj[key];
            }
        }
        return result;
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