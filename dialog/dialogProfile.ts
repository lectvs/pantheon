namespace DialogProfile {
    export type Config = {
        name: string;
        font: string;
        dialogStart?: string;
        dialogSpeak?: string;
        defaultPortrait?: Factory<WorldObject>;
        entries: Dict<Entry>;
    }
    
    export type Entry = {
        name?: string;
        font?: string;
        dialogStart?: string;
        dialogSpeak?: string;
        portrait?: Factory<WorldObject>;
    }
}

class DialogProfile {
    private name: string;
    private font: string;
    private dialogStart: string;
    private dialogSpeak: string;
    private defaultPortrait: Factory<WorldObject>;
    private entries: Dict<DialogProfile.Entry>;

    constructor(config: DialogProfile.Config) {
        this.name = config.name;
        this.font = config.font;
        this.dialogStart = config.dialogStart;
        this.dialogSpeak = config.dialogSpeak;
        this.defaultPortrait = config.defaultPortrait;
        this.entries = config.entries;
    }

    getName(entry: string) {
        return this.getEntry(entry)?.name ?? this.name;
    }

    getPortrait(entry: string) {
        let portrait = this.getEntry(entry)?.portrait ?? this.defaultPortrait;
        if (!portrait) return undefined;
        return portrait();
    }

    getDialogStart(entry: string) {
        return this.getEntry(entry)?.dialogStart ?? this.dialogStart;
    }

    getDialogSpeak(entry: string) {
        return this.getEntry(entry)?.dialogSpeak ?? this.dialogSpeak;
    }

    getFont(entry: string) {
        return this.getEntry(entry)?.font ?? this.font;
    }

    private getEntry(entry: string) {
        if (entry in this.entries) {
            return this.entries[entry];
        }
        return this.entries['default'];
    }

    static splitKey(profileKey: string): [string, string] {
        let parts = profileKey.split('/');
        if (parts.length === 1) {
            return [parts[0], 'default'];
        }
        if (parts.length > 2) {
            error(`Dialog profile key has more than two parts: ${profileKey}`);
        }
        return [parts[0], parts[1]];
    }
}

namespace DialogProfiles {
    const profilesByCharacter: Dict<DialogProfile> = {};

    export function initProfiles(profiles: Dict<DialogProfile.Config>) {
        for (let key in profiles) {
            profilesByCharacter[key] = new DialogProfile(profiles[key]);
        }
    }

    export function getProfile(profileKey: string) {
        let profile = profilesByCharacter[profileKey];
        if (!profile) {
            error(`No profile found for: ${profileKey}`);
            return undefined;
        }

        return profile;
    }

    export function simplePortrait(key: string): Factory<WorldObject> {
        return () => new Sprite({ texture: key });
    }
}