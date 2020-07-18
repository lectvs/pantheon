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
    }

    static getOption(option: string) {
        return this.options[option];
    }

    static updateOption(option: string, value: any) {
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
        localStorage.setItem(this.getOptionsLocalStorageName(), JSON.stringify(this.options));
        this.onUpdate();
    }

    private static loadOptions() {
        this.options = JSON.parse(localStorage.getItem(this.getOptionsLocalStorageName()));
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