namespace Actions {
    export function fadeAndKill(worldObject: (WorldObject & { alpha: number }) | undefined, duration: number, easingFn?: Tween.Easing.Function) {
        if (!worldObject) return;
        worldObject.runScript(S.chain(
            S.tween(duration, worldObject, 'alpha', worldObject.alpha, 0, easingFn),
            S.call(() => worldObject.kill()),
        ));
    }
}