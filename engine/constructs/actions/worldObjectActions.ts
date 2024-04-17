namespace Actions {
    type EnterInitialValues = {
        dx?: number;
        dy?: number;
        dz?: number;
        alpha?: number;
    }

    export function enter(worldObject: WorldObject | undefined, duration: number, initialValues: EnterInitialValues, easingFn?: Tween.Easing.Function) {
        if (!worldObject) return;

        if (initialValues.dx !== undefined) {
            worldObject.teleport(worldObject.x + initialValues.dx, worldObject.y);
            worldObject.runScript(S.tween(duration, worldObject, 'x', worldObject.x, worldObject.x - initialValues.dx, easingFn));
        }

        if (initialValues.dy !== undefined) {
            worldObject.teleport(worldObject.x, worldObject.y + initialValues.dy);
            worldObject.runScript(S.tween(duration, worldObject, 'y', worldObject.y, worldObject.y - initialValues.dy, easingFn));
        }

        if (initialValues.dz !== undefined) {
            worldObject.z += initialValues.dz;
            worldObject.runScript(S.tween(duration, worldObject, 'z', worldObject.z, worldObject.z - initialValues.dz, easingFn));
        }

        let wo = worldObject as any;

        if (initialValues.alpha !== undefined && typeof(wo.alpha) === 'number') {
            let currentAlpha = wo.alpha;
            wo.alpha = initialValues.alpha;
            worldObject.runScript(S.tween(duration, wo, 'alpha', wo.alpha, currentAlpha, easingFn));
        }
    }

    type ExitFinalValues = {
        dx?: number;
        dy?: number;
        dz?: number;
        alpha?: number;
    }

    export function exit(worldObject: WorldObject | undefined, duration: number, finalValues: ExitFinalValues, easingFn?: Tween.Easing.Function) {
        if (!worldObject || worldObject.data.exiting) return;

        worldObject.data.exiting = true;

        worldObject.runScript(function*() {
            let scripts: Script.Function[] = [];

            if (finalValues.dx !== undefined) {
                scripts.push(S.tween(duration, worldObject, 'x', worldObject.x, worldObject.x + finalValues.dx, easingFn));
            }

            if (finalValues.dy !== undefined) {
                scripts.push(S.tween(duration, worldObject, 'y', worldObject.y, worldObject.y + finalValues.dy, easingFn));
            }

            if (finalValues.dz !== undefined) {
                scripts.push(S.tween(duration, worldObject, 'z', worldObject.z, worldObject.z + finalValues.dz, easingFn));
            }

            let wo = worldObject as any;

            if (finalValues.alpha !== undefined && typeof(wo.alpha) === 'number') {
                scripts.push(S.tween(duration, wo, 'alpha', wo.alpha, finalValues.alpha, easingFn));
            }

            if (scripts.length === 0) {
                scripts.push(S.wait(duration));
            }

            yield scripts;

            worldObject.kill();
            delete worldObject.data.exiting;
        });
    }

    export function flash(worldObject: WorldObject & { effects: Effects }, duration: number, keepPreviousEnabled?: 'keepPreviousEnabled', color: number = 0xFFFFFF) {
        let previousColor = worldObject.effects.silhouette.color;
        let previousAlpha = worldObject.effects.silhouette.alpha;
        let previousAmount = worldObject.effects.silhouette.amount;
        let previousEnabled = worldObject.effects.silhouette.enabled;
        worldObject.runScript(function*() {
            worldObject.effects.silhouette.enable(color, 1, 0);
            yield S.tween(duration/2, worldObject.effects.silhouette, 'amount', 0, 1);
            yield S.tween(duration/2, worldObject.effects.silhouette, 'amount', 1, 0);
            worldObject.effects.silhouette.enable(previousColor, previousAlpha, previousAmount);
            if (!previousEnabled || !keepPreviousEnabled) worldObject.effects.silhouette.disable();
        });
    }
}