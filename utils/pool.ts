class SingleKeyPool<K, V> {
    private factory: (key: K) => V;
    private keyToStringFn: (key: K) => string;

    private pool: Dict<V[]>;

    constructor(factory: (key: K) => V, keyToStringFn: (key: K) => string = (key) => `${key}`) {
        this.factory = factory;
        this.keyToStringFn = keyToStringFn;
        this.pool = {};
    }

    borrow(key: K) {
        let keyString = this.keyToStringFn(key);
        if (_.isEmpty(this.pool[keyString])) {
            return this.factory(key);
        }
        return this.pool[keyString].pop();
    }

    return(key: K, value: V) {
        let keyString = this.keyToStringFn(key);
        if (!(keyString in this.pool)) {
            this.pool[keyString] = [];
        }
        this.pool[keyString].push(value);
    }
}

class DualKeyPool<K1, K2, V> {
    private factory: (key1: K1, key2: K2) => V;
    private keysToStringFn: (key1: K1, key2: K2) => string;

    private pool: Dict<V[]>;

    constructor(factory: (key1: K1, key2: K2) => V, keysToStringFn: (key1: K1, key2: K2) => string = (key1, key2) => `${key1}|/|${key2}`) {
        this.factory = factory;
        this.keysToStringFn = keysToStringFn;
        this.pool = {};
    }

    borrow(key1: K1, key2: K2) {
        let keyString = this.keysToStringFn(key1, key2);
        if (_.isEmpty(this.pool[keyString])) {
            return this.factory(key1, key2);
        }
        return this.pool[keyString].pop();
    }

    return(key1: K1, key2: K2, value: V) {
        let keyString = this.keysToStringFn(key1, key2);
        if (!(keyString in this.pool)) {
            this.pool[keyString] = [];
        }
        this.pool[keyString].push(value);
    }
}