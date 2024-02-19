namespace SimpleStateMachine {
    export type State = {
        callback?: () => any;
        script?: Script.Function;
        update?: () => any;
        transitions?: Transition[];
    }

    export type Transition = {
        toState: string;
        condition?: () => any;
        afterConditionDelay?: number;
    }
}

class SimpleStateMachine {
    private stateMachine: StateMachine<{ state: string }>;

    constructor() {
        this.stateMachine = new StateMachine();
    }

    addState(name: string, state: SimpleStateMachine.State = {}) {
        let stateScript = state.script;

        this.stateMachine.addState(name, {
            callback: state.callback,
            script: stateScript ? (() => stateScript!) : undefined,
            update: state.update,
            transitions: state.transitions?.map(transition => ({
                toState: { state: transition.toState },
                condition: transition.condition,
                afterConditionDelay: transition.afterConditionDelay,
            })),
        });
    }

    setState(name: string) {
        this.stateMachine.setState({ state: name });
    }

    update(delta: number) {
        this.stateMachine.update(delta);
    }

    getCurrentStateName() {
        return this.stateMachine.getCurrentStateName();
    }
}