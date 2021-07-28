namespace Options {
    export type Options = {
        volume: number;
        controls: Input.KeyCodesByName;
    } & Dict<any>;
}

class Options {
    static optionsName: string;
    private static options: Options.Options;
    private static defaultOptions: Options.Options;

    static updateCallbacks: (() => any)[] = [];

    static get volume() { return this.getOption('volume'); }
    static set volume(value: number) { this.updateOption('volume', value); }

    static init(name: string, defaultOptions: Options.Options) {
        this.optionsName = name;
        this.defaultOptions = defaultOptions;
        this.loadOptions();

        if (Debug.RESET_OPTIONS_AT_START) {
            this.resetOptions();
        }
    }

    static getOption<T>(option: string): T {
        return this.options[option];
    }

    static updateOption<T>(option: string, value: T) {
        this.options[option] = value;
        this.saveOptions();
    }

    static resetOption(option: string) {
        this.options[option] = O.deepClone(this.defaultOptions[option]);
        this.saveOptions();
    }

    static resetOptions() {
        this.options = O.deepClone(this.defaultOptions);
        this.saveOptions();
    }

    static saveOptions() {
        LocalStorage.setJson(this.getOptionsLocalStorageName(), this.options);
        this.onUpdate();
    }

    private static loadOptions() {
        this.options = LocalStorage.getJson<Options.Options>(this.getOptionsLocalStorageName());
        
        if (_.isEmpty(this.options)) {
            this.resetOptions();
        } else {
            this.onUpdate();
        }
    }

    private static onUpdate() {
        for (let callback of this.updateCallbacks) {
            callback();
        }
    }

    private static getOptionsLocalStorageName() {
        return `${this.optionsName}_options`;
    }
}