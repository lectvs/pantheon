class SingleKeyCache<K, V> {
    private factory: (...args: any[]) => V;
    private keyToStringFn: (key: K) => string;

    private cache: Dict<V[]>;

    constructor(factory: (...args: any[]) => V, keyToStringFn: (key: K) => string) {
        this.factory = factory;
        this.keyToStringFn = keyToStringFn;
        this.cache = {};
    }

    borrow(key: K, ...factoryArgs: any[]) {
        let keyString = this.keyToStringFn(key);
        if (_.isEmpty(this.cache[keyString])) {
            return this.factory(...factoryArgs);
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