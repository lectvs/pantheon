namespace S {
    type SquetchableWorldObject = WorldObject & { scaleX: number, scaleY: number };

    export function squetchHit(obj: SquetchableWorldObject, duration: number, startScaleX: number, startScaleY: number, elasticity: number = 1) {
        return S.simul(
            S.tween(duration, obj, 'scaleX', startScaleX, 1, Tween.Easing.OutElastic(elasticity)),
            S.tween(duration, obj, 'scaleY', startScaleY, 1, Tween.Easing.OutElastic(elasticity)),
        );
    }

    export function squetchVibrate(obj: SquetchableWorldObject, cycleDuration: number, minScaleX: number, minScaleY: number, maxScaleX: number, maxScaleY: number) {
        return S.chain(
            S.simul(
                S.tween(cycleDuration/4, obj, 'scaleX', 1, maxScaleX, Tween.Easing.OutQuad),
                S.tween(cycleDuration/4, obj, 'scaleY', 1, minScaleY, Tween.Easing.OutQuad),
            ),
            S.simul(
                S.tween(cycleDuration/4, obj, 'scaleX', maxScaleX, 1, Tween.Easing.InQuad),
                S.tween(cycleDuration/4, obj, 'scaleY', minScaleY, 1, Tween.Easing.InQuad),
            ),
            S.simul(
                S.tween(cycleDuration/4, obj, 'scaleX', 1, minScaleX, Tween.Easing.OutQuad),
                S.tween(cycleDuration/4, obj, 'scaleY', 1, maxScaleY, Tween.Easing.OutQuad),
            ),
            S.simul(
                S.tween(cycleDuration/4, obj, 'scaleX', minScaleX, 1, Tween.Easing.InQuad),
                S.tween(cycleDuration/4, obj, 'scaleY', maxScaleY, 1, Tween.Easing.InQuad),
            ),
        );
    }
}