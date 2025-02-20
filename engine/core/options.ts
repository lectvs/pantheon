namespace Options {
    export type Options = {
        [Options.VOLUME]: number;
        [Options.SFX_VOLUME]: number;
        [Options.MUSIC_VOLUME]: number;
    } & Dict<any>;
}

class Options {
    static readonly VOLUME = 'volume';
    static readonly SFX_VOLUME = 'sfx_volume';
    static readonly MUSIC_VOLUME = 'music_volume';

    static optionsName: string;
    private static options: Options.Options;
    private static defaultOptions: Options.Options;

    static get volume() { return this.getOption(Options.VOLUME); }
    static set volume(value: number) { this.updateOption(Options.VOLUME, value); }

    static get sfxVolume() { return this.getOption(Options.SFX_VOLUME); }
    static set sfxVolume(value: number) { this.updateOption(Options.SFX_VOLUME, value); }

    static get musicVolume() { return this.getOption(Options.MUSIC_VOLUME); }
    static set musicVolume(value: number) { this.updateOption(Options.MUSIC_VOLUME, value); }

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
    }

    private static loadOptions() {
        this.options = O.deepClone(this.defaultOptions);
        let loadedOptions: Partial<Options.Options> = LocalStorage.getJson<Options.Options>(this.getOptionsLocalStorageName()) || {};

        for (let option in loadedOptions) {
            this.options[option] = loadedOptions[option];
        }
    }

    private static getOptionsLocalStorageName() {
        return `${this.optionsName}_options`;
    }
}