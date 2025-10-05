namespace SimpleStateMachine {
    export type State = {
        callback?: (previousState?: string) => any;
        script?: Script.Function;
        update?: () => any;
        transitions?: Transition[];
    }

    export type Transition = {
        toState: string | ((currentState?: string) => string);
        condition?: (currentState?: string) => any;
        afterConditionDelay?: number;
        onTransition?: (currentState?: string) => any;
    }
}

class SimpleStateMachine {
    private stateMachine: StateMachine<{ state: string }>;

    get timeInState() { return this.stateMachine.timeInState; }

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
                toState: O.isFunction(transition.toState) ? (currentStateData => (transition.toState as Function)(currentStateData?.state)) : { state: transition.toState },
                condition: transition.condition ? (currentStateData => transition.condition!(currentStateData?.state)) : undefined,
                afterConditionDelay: transition.afterConditionDelay,
                onTransition: transition.onTransition ? (currentStateData => transition.onTransition!(currentStateData?.state)) : undefined,
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