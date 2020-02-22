type Ray = {
    x: number;
    y: number;
    z: number;
    dx: number;
    dy: number;
    dz: number;
}

class Raytracer extends Sprite {
    tex: Texture;
    camX: number;
    camY: number;
    camZ: number;

    lightX: number;
    lightY: number;
    lightZ: number;

    ar: number;
    ag: number;
    ab: number;

    t: number;

    constructor(config: Sprite.Config) {
        super(config);

        this.tex = new Texture(32, 32);
        this.setTexture(this.tex);

        this.camX = 0;
        this.camY = 0;
        this.camZ = -2;

        this.lightX = 2;
        this.lightY = -2;
        this.lightZ = -2;

        this.ar = 0.4;
        this.ag = 0.1;
        this.ab = 0.1;

        this.t = 0;

        this.draw();
    }

    update(delta: number) {
        super.update(delta);
        this.t += 4*delta;
        this.lightX = 2*Math.cos(this.t);
        this.lightY = -2*Math.sin(this.t);
    }

    render(screen: Texture) {
        this.draw();
        super.render(screen);
    }

    draw() {
        for (let x = 0; x < this.tex.width; x++) {
            for (let y = 0; y < this.tex.height; y++) {
                let ray = this.pixelToRay(x, y);
                Draw.brush.color = this.raycast(ray);
                Draw.brush.alpha = 1;
                Draw.pixel(this.tex, x, y);
            }
        }
    }

    private raycast(ray: Ray) {
        let i = this.intersect(ray);
        if (isNaN(i)) {
            return 0xFFFFFF;
        }

        let x = ray.x + i*ray.dx;
        let y = ray.y + i*ray.dy;
        let z = ray.z + i*ray.dz;

        let dotp = this.dot(x, y, z, -ray.dx, -ray.dy, -ray.dz);
        let lx = 2*dotp*x + ray.dx;
        let ly = 2*dotp*y + ray.dy;
        let lz = 2*dotp*z + ray.dz;

        let ldx = this.lightX - x;
        let ldy = this.lightY - y;
        let ldz = this.lightZ - z;

        let lightValue = this.ndot(lx, ly, lz, ldx, ldy, ldz);
        lightValue = Math.max(0, lightValue) / (ldx**2 + ldy**2 + ldz**2) * 4;

        return M.vec3ToColor([Math.min(1, this.ar + lightValue), Math.min(1, this.ag + lightValue), Math.min(1, this.ab + lightValue)]);
    }

    private intersect(ray: Ray) {
        let a = ray.dx**2 + ray.dy**2 + ray.dz**2;
        let b = 2*ray.x*ray.dx + 2*ray.y*ray.dy + 2*ray.z*ray.dz;
        let c = ray.x**2 + ray.y**2 + ray.z**2 - 1;

        let disc = b**2 - 4*a*c;
        if (disc < 0) return NaN;

        let t1 = (-b + Math.sqrt(disc)) / 2 / a;
        let t2 = (-b - Math.sqrt(disc)) / 2 / a;

        if (t1 < 0 && t2 < 0) return NaN;
        if (t1 < 0) return t2;
        if (t2 < 0) return t1;
        return Math.min(t1, t2);
    }

    private pixelToRay(x: number, y: number): Ray {
        return {
            x: this.camX,
            y: this.camY,
            z: this.camZ,
            dx: x-16,
            dy: y-16,
            dz: 16
        };
    }

    private dot(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
        return x1*x2 + y1*y2 + z1*z2;
    }

    private ndot(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
        return (x1*x2 + y1*y2 + z1*z2) / Math.sqrt(x1**2 + y1**2 + z1**2) / Math.sqrt(x2**2 + y2**2 + z2**2);
    }
}