namespace Actions {
    export function fadeAndKill(worldObject: (WorldObject & { alpha: number }) | undefined, duration: number, easingFn?: Tween.Easing.Function) {
        if (!worldObject) return;
        worldObject.runScript(S.chain(
            S.tween(duration, worldObject, 'alpha', worldObject.alpha, 0, easingFn),
            S.call(() => worldObject.kill()),
        ));
    }

    export function fadeIn(worldObject: (WorldObject & { alpha: number }) | undefined, duration: number, toAlpha: number = 1, easingFn?: Tween.Easing.Function) {
        if (!worldObject) return;
        worldObject.alpha = 0;
        worldObject.runScript(S.tween(duration, worldObject, 'alpha', 0, toAlpha, easingFn));
    }
}