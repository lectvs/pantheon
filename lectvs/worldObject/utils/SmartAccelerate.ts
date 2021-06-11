class SmartAccelerate {
    static accelerate(v: Vector2, ax: number, ay: number, delta: number, maxSpeed: number) {
        let oldMagnitude = v.magnitude;

        v.x += ax * delta;
        v.y += ay * delta;

        if (v.magnitude > maxSpeed) {
            v.clampMagnitude(oldMagnitude);
        }
    }
}