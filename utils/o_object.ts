namespace O {
    export function clone<T>(obj: T): T {
        if (!obj || !isObject(obj)) return obj;
        if (Array.isArray(obj)) return <T>A.clone(obj);
        let result: any = {};
        for (let key in obj) {
            result[key] = obj[key];
        }
        return result as T;
    }

    /** Warning: make sure your object has no reference loops! */
    export function deepClone<T>(obj: T): T {
        return <T>deepCloneInternal(obj);
    }

    function deepCloneInternal<T>(obj: T): T {
        if (Array.isArray(obj)) {
            if (isEmpty(obj)) return [] as T;
            let result: any[] = [];
            for (let el of obj) {
                result.push(deepCloneInternal(el));
            }
            return result as T;
        }

        if (isFunction(obj)) return obj;

        if (isObject(obj)) {
            if (isEmpty(obj)) return {} as T;
            let result: any = {};
            for (let key in obj) {
                result[key] = deepCloneInternal(obj[key]);
            }
            return result as T;
        }

        return obj;
    }

    export function deepOverride<T>(obj: T, overrides: any) {
        for (let key in overrides) {
            if (obj[key] && Array.isArray(overrides[key])) {
                obj[key] = overrides[key];
            } else if (obj[key] && isObject(obj[key]) && isObject(overrides[key])) {
                deepOverride(obj[key], overrides[key]);
            } else {
                obj[key] = overrides[key];
            }
        }
    }

    export function defaults<T, K extends Partial<T>>(obj: T, defaults: K): T & K {
        for (let key in defaults) {
            if ((obj as any)[key] === undefined) {
                (obj as any)[key] = defaults[key];
            }
        }
        return obj as T & K;
    }

    export function getClass(obj: Object) {
        return obj.constructor;
    }

    export function getPath(obj: Object, path: string) {
        let pathParts = path.split('.');
        let current = obj;
        for (let part of pathParts) {
            if (!current || !(part in current)) return undefined;
            current = current[part];
        }
        return current;
    }

    export function hasPath(obj: Object, path: string) {
        let pathParts = path.split('.');
        let current = obj;
        for (let part of pathParts) {
            if (!(part in current)) return false;
            current = current[part];
        }
        return true;
    }

    export function isEmpty(obj: any): obj is undefined {
        if (obj === null || obj === undefined) return true;
        if (Array.isArray(obj)) return obj.length === 0;
        return Object.keys(obj).length === 0;
    }

    export function isFunction(obj: any): obj is Function {
        return typeof obj === 'function';
    }

    export function isObject(obj: any): obj is Object {
        var type = typeof obj;
        return type === 'function' || (type === 'object' && !!obj);
    }

    export function mergeObject<T>(obj: T, into: T, combine: (e: any, into: any) => any = ((e, into) => e)) {
        let result = clone(into);
        for (let key in obj) {
            if (result[key]) {
                result[key] = combine(obj[key], result[key]);
            } else {
                result[key] = obj[key];
            }
        }
        return result;
    }

    export function override<T>(obj: T, overrides: Partial<T>) {
        for (let key in overrides) {
            (obj as any)[key] = overrides[key];
        }
    }

    export function setPath(obj: Object, path: string, value: any) {
        let pathParts = path.split('.');
        let lastPart = pathParts.pop();
        if (!lastPart) return;
        let current = obj;
        for (let part of pathParts) {
            if (!current || !(part in current)) return;
            current = current[part];
        }
        current[lastPart] = value;
    }

    export function withDefaults<T, K extends Partial<T>>(obj: T, defaults: K): T & K {
        return O.defaults(clone(obj), defaults);
    }

    export function withOverrides<T>(obj: T, overrides: Partial<T>): T {
        let result = clone(obj);
        override(result, overrides);
        return result;
    }
}