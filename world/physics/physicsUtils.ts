class PhysicsUtils {

    static applyFriction(v: Vector2, fx: number, fy: number, delta: number) {
        if (v.x > 0) v.x = Math.max(v.x - fx * delta, 0);
        if (v.x < 0) v.x = Math.min(v.x + fx * delta, 0);
        if (v.y > 0) v.y = Math.max(v.y - fy * delta, 0);
        if (v.y < 0) v.y = Math.min(v.y + fy * delta, 0);
    }

    static applyFriction1d(v: number, f: number, delta: number) {
        if (v > 0) return Math.max(v - f * delta, 0);
        if (v < 0) return Math.min(v + f * delta, 0);
        return 0;
    }

    static inverseLinear(v: Vector2, G: number) {
        let mag = v.magnitude;
        if (mag === 0) return v;
        v.setMagnitude(G / mag);
        return v;
    }

    static inverseSquare(v: Vector2, G: number) {
        let magSq = v.magnitudeSq;
        if (magSq === 0) return v;
        v.setMagnitude(G / magSq);
        return v;
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
        v += a * delta;

        if (Math.abs(v) > maxSpeed) {
            v = Math.sign(v) * maxSpeed;
        }

        return v;
    }
}