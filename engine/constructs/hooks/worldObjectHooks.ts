namespace Hooks {
    export function oscillate(key: string, low: number, high: number, cyclesPerSecond: number) {
        return function(this: WorldObject) {
            (this as any)[key] = M.lerp(this.life.time, low, high, Tween.Easing.OscillateSine(cyclesPerSecond)) as any;
        }
        
    }
}