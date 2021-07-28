class ControllerBehavior implements Behavior {
    controller: Controller;

    private updateCallback: (this: ControllerBehavior) => any;

    constructor(update: (this: ControllerBehavior) => any) {
        this.controller = new Controller();

        this.updateCallback = update;
    }

    update(delta: number) {
        this.controller.reset();
        this.updateCallback();
    }

    interrupt() {}
}