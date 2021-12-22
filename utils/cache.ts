class SingleKeyCache<K, V> {
    private factory: (key: K) => V;
    private keyToStringFn: (key: K) => string;

    private cache: Dict<V[]>;

    constructor(factory: (key: K) => V, keyToStringFn: (key: K) => string) {
        this.factory = factory;
        this.keyToStringFn = keyToStringFn;
        this.cache = {};
    }

    borrow(key: K) {
        let keyString = this.keyToStringFn(key);
        if (_.isEmpty(this.cache[keyString])) {
            return this.factory(key);
        }
        return this.cache[keyString].pop();
    }

    return(key: K, value: V) {
        let keyString = this.keyToStringFn(key);
        if (!(keyString in this.cache)) {
            this.cache[keyString] = [];
        }
        this.cache[keyString].push(value);
    }
}

class DualKeyCache<K1, K2, V> {
    private factory: (key1: K1, key2: K2) => V;
    private keysToStringFn: (key1: K1, key2: K2) => string;

    private cache: Dict<V[]>;

    constructor(factory: (key1: K1, key2: K2) => V, keysToStringFn: (key1: K1, key2: K2) => string) {
        this.factory = factory;
        this.keysToStringFn = keysToStringFn;
        this.cache = {};
    }

    borrow(key1: K1, key2: K2) {
        let keyString = this.keysToStringFn(key1, key2);
        if (_.isEmpty(this.cache[keyString])) {
            return this.factory(key1, key2);
        }
        return this.cache[keyString].pop();
    }

    return(key1: K1, key2: K2, value: V) {
        let keyString = this.keysToStringFn(key1, key2);
        if (!(keyString in this.cache)) {
            this.cache[keyString] = [];
        }
        this.cache[keyString].push(value);
    }
}