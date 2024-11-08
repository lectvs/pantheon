class ControllerBehavior implements Behavior {
    controller: Controller;

    private updateCallback: (this: ControllerBehavior, delta: number) => any;

    constructor(update: (this: ControllerBehavior, delta: number) => any) {
        this.controller = new Controller();

        this.updateCallback = update;
    }

    update(delta: number) {
        this.controller.reset();
        this.updateCallback(delta);
    }

    interrupt() {}
}