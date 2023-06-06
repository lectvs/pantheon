interface LocalStorageBackend {
    delete(key: string): void;
    getJson<T>(key: string): T;
    getString(key: string): string;
    setJson(key: string, value: any): void;
    setString(key: string, value: string): void;
}

class LocalStorage {
    private static backend: LocalStorageBackend;

    static init() {
        if (this.doesLocalStorageWork()) {
            this.backend = new LocalStorageTrueBackend();
        } else {
            console.error('LocalStorage does not work! Using temporary in-memory storage.');
            this.backend = new LocalStorageFacadeBackend();
        }
    }

    private static doesLocalStorageWork() {
        try {
            localStorage.setItem('_lsc', 'checked');
            let result = localStorage.getItem('_lsc') === 'checked';
            localStorage.removeItem('_lsc');
            return result;
        } catch (e) {
            console.error('Unable to get localStorage:', e);
            return false;
        }
    }

    static delete(key: string) {
        this.backend.delete(key);
    }

    static getJson<T>(key: string) {
        return this.backend.getJson<T>(key);
    }

    static getString(key: string) {
        return this.backend.getString(key);
    }

    static setJson(key: string, value: any) {
        this.backend.setJson(key, value);
    }

    static setString(key: string, value: string) {
        this.backend.setString(key, value);
    }
}

class LocalStorageTrueBackend implements LocalStorageBackend {
    delete(key: string) {
        localStorage.removeItem(key);
    }

    getJson<T>(key: string) {
        let str = this.getString(key);
        return _.isEmpty(str) || str === 'undefined' ? undefined : <T>JSON.parse(str);
    }

    getString(key: string) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Unable to get localStorage:', e);
        }
        return undefined;
    }

    setJson(key: string, value: any) {
        this.setString(key, JSON.stringify(value));
    }

    setString(key: string, value: string) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('Unable to set localStorage:', e);
        }
    }
}

class LocalStorageFacadeBackend implements LocalStorageBackend {
    private storage: Dict<string>;

    constructor() {
        this.storage = {};
    }

    delete(key: string) {
        delete this.storage[key];
    }

    getJson<T>(key: string) {
        let str = this.getString(key);
        return _.isEmpty(str) ? undefined : <T>JSON.parse(str);
    }

    getString(key: string) {
        return key in this.storage ? this.storage[key] : undefined;
    }

    setJson(key: string, value: any) {
        this.setString(key, JSON.stringify(value));
    }

    setString(key: string, value: string) {
        this.storage[key] = value;
    }
}