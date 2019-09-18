namespace O {
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