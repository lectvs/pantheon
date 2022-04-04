class LazyValue<T> {
    private factory: Factory<T>;
    private value: T;
    private resolved: boolean;

    constructor(factory: Factory<T>) {
        this.factory = factory;
        this.value = undefined;
        this.resolved = false;
    }

    get() {
        if (!this.resolved) {
            this.value = this.factory();
            this.resolved = true;
        }
        return this.value;
    }

    has() {
        return !!this.resolved;
    }
}

class LazyDict<T> {
    private factory: (key: string) => T;
    private values: Dict<T>;
    private resolvedKeys: Set<string>;

    constructor(factory: (key: string) => T) {
        this.factory = factory;
        this.values = {};
        this.resolvedKeys = new Set();
    }

    get(key: string) {
        if (!this.resolvedKeys.has(key)) {
            this.values[key] = this.factory(key);
            this.resolvedKeys.add(key);
        }
        return this.values[key];
    }

    has(key: string) {
        return this.resolvedKeys.has(key);
    }
}

class LazyDictNumber<T> {
    private factory: (key: number) => T;
    private values: Dict<T>;
    private resolvedKeys: Set<number>;

    constructor(factory: (key: number) => T) {
        this.factory = factory;
        this.values = {};
        this.resolvedKeys = new Set();
    }

    get(key: number) {
        if (!this.resolvedKeys.has(key)) {
            this.values[key] = this.factory(key);
            this.resolvedKeys.add(key);
        }
        return this.values[key];
    }

    has(key: number) {
        return this.resolvedKeys.has(key);
    }
}

const LAZY_CACHE: Dict<LazyValue<any>> = {};
function lazy<T>(key: string, factory: Factory<T>) {
    if (!(key in LAZY_CACHE)) {
        LAZY_CACHE[key] = new LazyValue(factory);
    }

    return (<LazyValue<T>>LAZY_CACHE[key]).get();
}