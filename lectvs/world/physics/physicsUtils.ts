class PhysicsUtils {

    static applyFriction(v: Vector2, fx: number, fy: number, delta: number) {
        if (v.x > 0) v.x = Math.max(v.x - fx * delta, 0);
        if (v.x < 0) v.x = Math.min(v.x + fx * delta, 0);
        if (v.y > 0) v.y = Math.max(v.y - fy * delta, 0);
        if (v.y < 0) v.y = Math.min(v.y + fy * delta, 0);
    }

    static smartAccelerate(v: Vector2, ax: number, ay: number, delta: number, maxSpeed: number) {
        let oldMagnitude = v.magnitude;

        v.x += ax * delta;
        v.y += ay * delta;

        if (v.magnitude > maxSpeed) {
            v.clampMagnitude(oldMagnitude);
        }
    }

    static smartAccelerate1d(v: number, a: number, delta: number, maxSpeed: number) {
        let vv = vec2(v, 0);
        this.smartAccelerate(vv, a, 0, delta, maxSpeed);
        return vv.x;
    }
}