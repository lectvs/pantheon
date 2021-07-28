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

    private stateMachine: StateMachine;
    private actions: Dict<ActionBehavior.Action>;

    private currentActionName: string;
    private get currentAction() { return this.actions[this.currentActionName]; }

    constructor(startAction: string, startWait: OrFactory<number>) {
        this.controller = new Controller();
        this.stateMachine = new StateMachine();
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
            let waitActionName = `wait_after_${name}`;

            this.addAction(name, {
                script: action.script,
                interrupt: action.interrupt,
                nextAction: waitActionName,
            });

            this.addAction(waitActionName, {
                script: function*() {
                    yield S.wait(action.wait);
                },
                nextAction: action.nextAction,
            });

            return;
        }

        this.stateMachine.addState(name, {
            script: function*() {
                if (action.script) yield action.script;
                yield;  // Yield once before doing the next action to let final controller inputs go through.
                b.doAction(b.getNextAction(action.nextAction));
            }
        });

        this.actions[name] = action;
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

    private canInterrupt(interrupt: ActionBehavior.Interrupt): boolean {
        return !!interrupt;
    }

    private getNextAction(nextAction: ActionBehavior.NextAction): string {
        if (_.isString(nextAction)) return nextAction;
        return nextAction.call(this);
    }

    private getInterruptAction(action: ActionBehavior.Action) {
        if (_.isString(action.interrupt)) return action.interrupt;
        return this.getNextAction(action.nextAction);
    }

    static readonly START_ACTION = 'start';
}
