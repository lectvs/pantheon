class Controller {
    moveDirection: Vector2;
    aimDirection: Vector2;
    keys: Dict<boolean>;

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
    get interact() { return this.keys.interact; }
    set interact(value: boolean) { this.keys.interact = value; }

    constructor() {
        this.moveDirection = vec2(0, 0);
        this.aimDirection = vec2(0, 0);
        this.keys = {};
    }

    updateFromBehavior(behavior: Behavior) {
        if (behavior instanceof NullBehavior) return;

        this.moveDirection.x = behavior.controller.moveDirection.x;
        this.moveDirection.y = behavior.controller.moveDirection.y;
        this.aimDirection.x = behavior.controller.aimDirection.x;
        this.aimDirection.y = behavior.controller.aimDirection.y;

        for (let key in behavior.controller.keys) {
            this.keys[key] = behavior.controller.keys[key];
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
