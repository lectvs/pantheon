namespace Options {
    export type Options = {
        [Options.VOLUME]: number;
        [Options.SFX_VOLUME]: number;
        [Options.MUSIC_VOLUME]: number;
        [Options.CONTROLS]: Input.KeyCodesByName;
    } & Dict<any>;
}

class Options {
    static readonly VOLUME = 'volume';
    static readonly SFX_VOLUME = 'sfx_volume';
    static readonly MUSIC_VOLUME = 'music_volume';
    static readonly CONTROLS = 'controls';

    static optionsName: string;
    private static options: Options.Options;
    private static defaultOptions: Options.Options;

    static updateCallbacks: (() => any)[] = [];

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
        this.onUpdate();
    }

    private static loadOptions() {
        this.options = O.deepClone(this.defaultOptions);
        let loadedOptions = LocalStorage.getJson<Options.Options>(this.getOptionsLocalStorageName()) || {};

        for (let option in loadedOptions) {
            if (option === Options.CONTROLS) {
                /* NOOP FOR NOW, DEAL WITH CONTROLS OVERRIDING LATER */
                // let controls = this.options[Options.CONTROLS];
                // let loadedControls = loadedOptions[Options.CONTROLS]
                // for (let control in controls) {
                //     if (control in loadedControls) {
                //         controls[control] = loadedControls[controls];
                //     }
                // }
            } else {
                this.options[option] = loadedOptions[option];
            }
        }
        
        if (_.isEmpty(loadedOptions)) {
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