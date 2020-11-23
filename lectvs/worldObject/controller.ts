class Controller {
    schema: Controller.Schema;

    moveDirection?: Pt;
    aimDirection?: Pt;
    keys?: Dict<boolean>;

    get left() { return this.keys.left; }
    set left(value: boolean) { this.keys.left = value; }
    get right() { return this.keys.right; }
    set right(value: boolean) { this.keys.right = value; }
    get up() { return this.keys.up; }
    set up(value: boolean) { this.keys.up = value; }
    get down() { return this.keys.down; }
    set down(value: boolean) { this.keys.down = value; }
    get jump() { return this.keys.jump; }
    set jump(value: boolean) { this.keys.jump = value; }
    get attack() { return this.keys.attack; }
    set attack(value: boolean) { this.keys.attack = value; }

    constructor() {
        this.schema = {};

        this.moveDirection = pt(0, 0);
        this.aimDirection = pt(0, 0);
        this.keys = {};
    }

    updateFromSchema() {
        if (this.schema.moveDirection) {
            let moveDirection = this.schema.moveDirection();
            this.moveDirection.x = moveDirection.x;
            this.moveDirection.y = moveDirection.y;
        }
        if (this.schema.aimDirection) {
            let aimDirection = this.schema.aimDirection();
            this.aimDirection.x = aimDirection.x;
            this.aimDirection.y = aimDirection.y;
        }
        if (this.schema.keys) {
            for (let key in this.schema.keys) {
                this.keys[key] = this.schema.keys[key]();
            }
        }
    }

    reset() {
        this.moveDirection.x = 0;
        this.moveDirection.y = 0;
        this.aimDirection.x = 0;
        this.aimDirection.y = 0;
        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }
}

namespace Controller {
    export type Schema = {
        moveDirection?: () => Pt;
        aimDirection?: () => Pt;

        keys?: Dict<() => boolean>;
    }
}