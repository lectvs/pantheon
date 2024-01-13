namespace Hooks {
    export function oscillate<T extends WorldObject & Partial<Record<K, number>>, K extends keyof T>(worldObject: T, key: K, low: number, high: number, cyclesPerSecond: number) {
        worldObject.addHook('onUpdate', function() {
            worldObject[key] = M.lerp(this.life.time, low, high, Tween.Easing.OscillateSine(cyclesPerSecond)) as any;
        });
    }
}