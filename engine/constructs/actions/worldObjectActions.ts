namespace Actions {
    export type EnterInitialValues = {
        dx?: number;
        dy?: number;
        dz?: number;
        alpha?: number;
        scaleX?: number;
        scaleY?: number;
    }

    export function enter(worldObject: WorldObject | undefined, duration: number, initialValues: EnterInitialValues, easingFn?: Tween.Easing.Function, delay?: number): Script {
        if (!worldObject) return new Script(S.noop());

        worldObject.setVisible(true);

        let scripts: Script.Function[] = [];

        if (initialValues.dx !== undefined) {
            worldObject.teleport(worldObject.x + initialValues.dx, worldObject.y);
            scripts.push(S.tween(duration, worldObject, 'x', worldObject.x, worldObject.x - initialValues.dx, easingFn));
        }

        if (initialValues.dy !== undefined) {
            worldObject.teleport(worldObject.x, worldObject.y + initialValues.dy);
            scripts.push(S.tween(duration, worldObject, 'y', worldObject.y, worldObject.y - initialValues.dy, easingFn));
        }

        if (initialValues.dz !== undefined) {
            worldObject.z += initialValues.dz;
            scripts.push(S.tween(duration, worldObject, 'z', worldObject.z, worldObject.z - initialValues.dz, easingFn));
        }

        if (initialValues.alpha !== undefined) {
            let currentAlpha = worldObject.alpha;
            worldObject.alpha = initialValues.alpha;
            scripts.push(S.tween(duration, worldObject, 'alpha', worldObject.alpha, currentAlpha, easingFn));
        }

        let wo = worldObject as any;

        if (initialValues.scaleX !== undefined && typeof(wo.scaleX) === 'number') {
            let currentScaleX = wo.scaleX;
            wo.scaleX = initialValues.scaleX;
            scripts.push(S.tween(duration, wo, 'scaleX', wo.scaleX, currentScaleX, easingFn));
        }

        if (initialValues.scaleY !== undefined && typeof(wo.scaleY) === 'number') {
            let currentScaleY = wo.scaleY;
            wo.scaleY = initialValues.scaleY;
            scripts.push(S.tween(duration, wo, 'scaleY', wo.scaleY, currentScaleY, easingFn));
        }

        if (scripts.length === 0) {
            scripts.push(S.wait(duration));
        }

        return worldObject.runScript(function*() {
            yield S.wait(delay ?? 0);
            yield scripts;
        });
    }

    export type ExitFinalValues = {
        dx?: number;
        dy?: number;
        dz?: number;
        alpha?: number;
        scaleX?: number;
        scaleY?: number;
    }

    export function exit(worldObject: WorldObject | undefined, duration: number, finalValues: ExitFinalValues, easingFn?: Tween.Easing.Function, delay?: number): Script {
        if (!worldObject || worldObject.data.exiting) return new Script(S.noop());

        worldObject.data.exiting = true;

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

        if (finalValues.scaleX !== undefined && typeof(wo.scaleX) === 'number') {
            scripts.push(S.tween(duration, wo, 'scaleX', wo.scaleX, finalValues.scaleX, easingFn));
        }

        if (finalValues.scaleY !== undefined && typeof(wo.scaleY) === 'number') {
            scripts.push(S.tween(duration, wo, 'scaleY', wo.scaleY, finalValues.scaleY, easingFn));
        }

        if (scripts.length === 0) {
            scripts.push(S.wait(duration));
        }

        return worldObject.runScript(function*() {
            yield S.wait(delay ?? 0);
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