class NullBehavior implements IBehavior {
    controller: Controller;

    constructor() {
        this.controller = new Controller();
    }

    update(delta: number) {}
    interrupt() {}
}