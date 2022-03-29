class LocalStorage {
    static delete(key: string) {
        localStorage.removeItem(key);
    }

    static getJson<T>(key: string) {
        let str = this.getString(key);
        return _.isEmpty(str) ? undefined : <T>JSON.parse(str);
    }

    static getString(key: string) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            error('Unable to get localStorage:', e);
        }
        return undefined;
    }

    static setJson(key: string, value: any) {
        this.setString(key, JSON.stringify(value));
    }

    static setString(key: string, value: string) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            error('Unable to set localStorage:', e);
        }
    }
}