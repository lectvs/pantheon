class NullBehavior implements Behavior {
    controller: Controller;

    constructor() {
        this.controller = new Controller();
    }

    update(delta: number) {}
    interrupt() {}
}