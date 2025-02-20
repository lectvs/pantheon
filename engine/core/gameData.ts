/**
 * After initializing, you should call GameData.load() inside Main.beforeStart().
 */
class GameDataBase<T> {
    _memGameData!: T;

    constructor(private fillGameDataWithDefaults: (gameData: Partial<T>) => T) {}

    getData<K extends keyof T>(key: K): T[K] {
        if (!this.checkGameDataLoaded()) return undefined!;
        return this._memGameData[key];
    }

    setData<K extends keyof T>(key: K, value: T[K]) {
        if (!this.checkGameDataLoaded()) return;
        this._memGameData[key] = value;
        this.save();
    }

    load() {
        let localGameData = LocalStorage.getJson<T>(this.getGameDataLocalStorageKey());
        this._memGameData = this.fillGameDataWithDefaults(localGameData ?? {});
    }

    save() {
        LocalStorage.setJson(this.getGameDataLocalStorageKey(), this._memGameData);
    }

    resetSave() {
        LocalStorage.delete(this.getGameDataLocalStorageKey());
        this.load();
    }

    private checkGameDataLoaded() {
        if (!this._memGameData) {
            console.error("GameData not loaded. You should call GameData.load()!");
            return false;
        }
        return true;
    }

    private getGameDataLocalStorageKey() {
        return `${GAME_NAME}_gamedata`;
    }
}
