/// <reference path="../controller/controller.ts" />

interface IBehavior {
    controller: Controller;

    update(delta: number): void;
    interrupt(): void;
}

namespace Behavior {
    export type Interrupt = boolean | string;
    export type Wait = number | ((this: Behavior) => number);
    export type NextAction = string | ((this: Behavior) => string);

    export type Action = {
        script?: Script.Function;
        interrupt?: Interrupt;
        wait?: Wait;
        nextAction: NextAction;
    }
}

class Behavior implements IBehavior {
    controller: Controller;

    private stateMachine: StateMachine;
    private actions: Dict<Behavior.Action>;

    private currentActionName: string;
    private get currentAction() { return this.actions[this.currentActionName]; }

    constructor(startAction: string, startWait: number) {
        this.controller = new Controller();
        this.stateMachine = new StateMachine();
        this.actions = {};

        this.addAction(Behavior.START_ACTION, {
            wait: startWait,
            nextAction: startAction,
        });
    }

    update(delta: number) {
        this.controller.reset();
        this.stateMachine.update(delta);

        if (!this.currentAction) {
            this.stateMachine.setState(Behavior.START_ACTION);
        }
    }

    addAction(name: string, action: Behavior.Action) {
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
                    yield* S.wait(b.getWait(action.wait))();
                },
                nextAction: action.nextAction,
            });

            return;
        }

        this.stateMachine.addState(name, {
            script: function*() {
                if (action.script) yield* action.script();

                b.doAction(b.getNextAction(action.nextAction));
            }
        });

        this.actions[name] = action;
    }

    interrupt() {
        if (!this.currentAction) return;
        if (!this.canInterrupt(this.currentAction.interrupt)) return;
        let interruptAction = this.getInterruptAction(this.currentAction);
        this.doAction(interruptAction);
    }

    private doAction(name: string) {
        this.currentActionName = name;
        this.stateMachine.setState(name);
    }

    private canInterrupt(interrupt: Behavior.Interrupt): boolean {
        return !!interrupt;
    }

    private getNextAction(nextAction: Behavior.NextAction): string {
        if (_.isString(nextAction)) return nextAction;
        return nextAction.call(this);
    }

    private getWait(wait: Behavior.Wait): number {
        if (_.isNumber(wait)) return wait;
        return wait.call(this);
    }

    private getInterruptAction(action: Behavior.Action) {
        if (_.isString(action.interrupt)) return action.interrupt;
        return this.getNextAction(action.nextAction);
    }

    static readonly START_ACTION = 'start';
}
