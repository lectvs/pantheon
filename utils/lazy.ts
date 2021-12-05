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
}