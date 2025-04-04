namespace SoundUtils {
    export type PlaySoundConfig = SoundManager.PlaySoundConfig & {
        fadeIn?: number;
        echoDelay?: number;
        echoDecay?: number;
    }

    export function playSound(soundManager: SoundManager, scriptManager: ScriptManager, allowSounds: boolean, key: string, config?: PlaySoundConfig) {
        if (global.theater?.isSkippingCutscene || !allowSounds) return new BasicSound(key);
        
        let sound = soundManager.playSound(key, config);

        if (config?.fadeIn) {
            scriptManager.runScript(S.tween(config.fadeIn, sound, 'volume', 0, sound.volume));
        }

        if (config?.echoDelay) {
            let decay = config.echoDecay ?? 0.5;
            scriptManager.runScript(function*() {
                for (let i = 1; i < 5; i++) {
                    yield config.echoDelay;
                    soundManager.playSound(key, {
                        ...config,
                        volume: (config.volume ?? 1) * (decay**i),
                    });
                }
            });
        }

        return sound;
    }

    export function stopSound(soundManager: SoundManager, scriptManager: ScriptManager, sound: string | Sound, fadeOut: number = 0) {
        let sounds: Sound[];
        if (St.isString(sound)) {
            sounds = soundManager.getSoundsByKey(sound);
        } else {
            sounds = [sound];
        }

        if (fadeOut <= 0) {
            sounds.forEach(s => s.stop());
            return S.noop();
        }

        return scriptManager.runScript(function*() {
            yield sounds.map(s => S.tween(fadeOut, s, 'volume', s.volume, 0));
            sounds.forEach(s => s.stop());
        });
    }
}