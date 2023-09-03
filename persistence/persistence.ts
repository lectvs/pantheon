namespace Persistence {
    type ProfileData = {
        profileId: string;
        totalPlayTime: number;
        lastPlayed: number;
    } & Dict<any>;

    type SessionData = {
        profileId: string;
        startTime: number;
        playTime: number;
        averageFrameRate: number;
    } & Dict<any>;

    type RegisteredUpdater<T> = {
        update: (updateFn: (currentValue: T) => T) => void;
    }

    type RegisteredSubmitter<T> = {
        get: Getter<T>;
    }

    export const profileData: ProfileData = {
        profileId: '',
        totalPlayTime: 0,
        lastPlayed: 0,
    };

    export const sessionData: SessionData = {
        profileId: '',
        startTime: 0,
        playTime: 0,
        averageFrameRate: 0,
    };

    const registeredUpdaters: Dict<RegisteredUpdater<any>> = {};
    const registeredSubmitters: Dict<RegisteredSubmitter<any>> = {};

    var sessionFrames: number;

    export function init() {
        let now = Date.now();
        profileData.profileId = `${now}_${new UIDGenerator().generate()}`;
        profileData.totalPlayTime = 0;

        let loadedData = load();
        if (loadedData) {
            for (let key in loadedData) {
                profileData[key] = loadedData[key];
            }
        }

        profileData.lastPlayed = now;

        sessionData.profileId = profileData.profileId;
        sessionData.startTime = now;
        sessionData.playTime = 0;
        sessionData.averageFrameRate = 0;

        sessionFrames = 0;
    }

    export function update(delta: number) {
        profileData.totalPlayTime += delta;

        sessionData.playTime += delta;
        sessionFrames++;
        if (sessionData.playTime > 0) sessionData.averageFrameRate = sessionFrames / sessionData.playTime;
    }

    export function submit() {
        for (let key in registeredSubmitters) {
            let value = registeredSubmitters[key].get();
            profileData[key] = value;
            sessionData[key] = value;
        }

        save();
    }

    export function getProfileId() {
        return profileData.profileId;
    }

    export function getAverageFrameRate() {
        return sessionData.averageFrameRate;
    }

    export function registerUpdater<T>(key: string, initialValue: T): RegisteredUpdater<T> {
        if (key in registeredUpdaters) {
            console.error(`Persistence Updater '${key}' has already been registered`);
            return registeredUpdaters[key];
        }

        let registeredUpdater: RegisteredUpdater<T> = {
            update: (updateFn: (currentValue: T) => T) => {
                profileData[key] = updateFn(<T>profileData[key]);
                sessionData[key] = updateFn(<T>sessionData[key]);
            },
        };

        registeredUpdaters[key] = registeredUpdater;
        profileData[key] = profileData[key] ?? initialValue;
        sessionData[key] = sessionData[key] ?? initialValue;
        
        return registeredUpdater;
    }

    export function registerSubmitter<T>(key: string, get: Getter<T>) {
        if (key in registeredSubmitters) {
            console.error(`Persistence Submitter '${key}' has already been registered`);
            return;
        }

        let registeredSubmitter: RegisteredSubmitter<T> = {
            get: get,
        };

        registeredSubmitters[key] = registeredSubmitter;
    }

    function load() {
        try {
            let encoded = LocalStorage.getString(`${global.gameCodeName}_analytics`);
            return <ProfileData>JSON.parse(St.decodeB64S(encoded));
        } catch {
            return undefined;
        }
    }

    function save() {
        let encoded = St.encodeB64S(JSON.stringify(profileData));
        LocalStorage.setString(`${global.gameCodeName}_analytics`, encoded);
    }
}