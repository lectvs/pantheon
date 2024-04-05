namespace ActionBehavior {
    export type Interrupt = boolean | string;
    export type NextAction = string | ((this: ActionBehavior) => string);

    export type Action = {
        script?: Script.Function;
        interrupt?: Interrupt;
        wait?: OrFactory<number>;
        nextAction: NextAction;
    }
}

class ActionBehavior implements Behavior {
    controller: Controller;

    private stateMachine: SimpleStateMachine;
    private actions: Dict<ActionBehavior.Action>;

    private currentActionName: string | undefined;
    private get currentAction() { return this.currentActionName ? this.actions[this.currentActionName] : undefined; }

    constructor(startAction: string, startWait: OrFactory<number>) {
        this.controller = new Controller();
        this.stateMachine = new SimpleStateMachine();
        this.actions = {};

        this.addAction(ActionBehavior.START_ACTION, {
            wait: startWait,
            nextAction: startAction,
        });
    }

    update(delta: number) {
        this.stateMachine.update(delta);

        if (!this.currentAction) {
            this.stateMachine.setState(ActionBehavior.START_ACTION);
        }
    }

    addAction(name: string, action: ActionBehavior.Action) {
        let b = this;

        if (action.wait) {
            let wait = action.wait;
            let waitActionName = `wait_after_${name}`;

            this.addAction(name, {
                script: action.script,
                interrupt: action.interrupt,
                nextAction: waitActionName,
            });

            this.addAction(waitActionName, {
                script: function*() {
                    yield S.wait(wait);
                },
                nextAction: action.nextAction,
            });

            return this;
        }

        this.stateMachine.addState(name, {
            script: function*() {
                if (action.script) yield action.script;
                yield;  // Yield once before doing the next action to let final controller inputs go through.
                b.doAction(b.getNextAction(action.nextAction));
            }
        });

        this.actions[name] = action;

        return this;
    }

    interrupt(action?: string) {
        if (!this.currentAction) return;
        if (action && action !== this.currentActionName) return;
        if (!this.canInterrupt(this.currentAction.interrupt)) return;
        let interruptAction = this.getInterruptAction(this.currentAction);
        this.doAction(interruptAction);
    }

    protected doAction(name: string) {
        this.controller.reset();
        this.currentActionName = name;
        this.stateMachine.setState(name);
    }

    private canInterrupt(interrupt: ActionBehavior.Interrupt | undefined): boolean {
        return !!interrupt;
    }

    private getNextAction(nextAction: ActionBehavior.NextAction): string {
        if (St.isString(nextAction)) return nextAction;
        return nextAction.call(this);
    }

    private getInterruptAction(action: ActionBehavior.Action) {
        if (St.isString(action.interrupt)) return action.interrupt;
        return this.getNextAction(action.nextAction);
    }

    static readonly START_ACTION = 'start';
}
